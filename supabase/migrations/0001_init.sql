-- AIComply — initial schema
-- Run in the Supabase SQL editor, or via `supabase db push`.
-- Multi-tenant: an organisation owns employees, enrolments and certificates.

create extension if not exists "pgcrypto";

-- ───────────────────────── Organisations ─────────────────────────
create table if not exists public.organizations (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  owner_id           uuid references auth.users (id) on delete set null,
  plan               text not null default 'none',        -- none|starter|team|business
  seats              integer not null default 0,
  seats_used         integer not null default 0,
  stripe_customer_id text unique,
  invite_token       text not null default encode(gen_random_bytes(12), 'hex'),
  created_at         timestamptz not null default now()
);

-- ───────────────────────── Profiles ─────────────────────────
-- One row per auth user, linked to an organisation.
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  org_id     uuid references public.organizations (id) on delete set null,
  email      text not null,
  full_name  text,
  role       text not null default 'employee',            -- admin|employee
  created_at timestamptz not null default now()
);

-- ───────────────────────── Enrolments ─────────────────────────
create table if not exists public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  org_id       uuid references public.organizations (id) on delete cascade,
  course_slug  text not null default 'ai-literacy-article-4',
  status       text not null default 'in_progress',       -- in_progress|completed
  score        integer,
  started_at   timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, course_slug)
);

-- ───────────────────────── Certificates ─────────────────────────
create table if not exists public.certificates (
  id             uuid primary key default gen_random_uuid(),
  certificate_no text not null unique,
  user_id        uuid references auth.users (id) on delete set null,
  org_id         uuid references public.organizations (id) on delete set null,
  full_name      text not null,
  organisation   text,
  course_slug    text not null default 'ai-literacy-article-4',
  course_title   text not null,
  score          integer not null,
  locale         text not null default 'en',
  valid          boolean not null default true,
  issued_at      timestamptz not null default now()
);

-- ───────────────────────── Waitlist (validation) ─────────────────────────
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  company    text,
  team_size  text,
  role       text,
  product    text not null default 'lms',                 -- lms|scanner
  locale     text not null default 'en',
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_org on public.profiles (org_id);
create index if not exists idx_enrollments_org on public.enrollments (org_id);
create index if not exists idx_certificates_org on public.certificates (org_id);

-- ───────────────────────── Row Level Security ─────────────────────────
alter table public.organizations enable row level security;
alter table public.profiles      enable row level security;
alter table public.enrollments   enable row level security;
alter table public.certificates  enable row level security;
alter table public.waitlist      enable row level security;

-- Helper: the caller's organisation id.
create or replace function public.current_org_id()
returns uuid language sql stable security definer set search_path = public as $$
  select org_id from public.profiles where id = auth.uid()
$$;

-- Profiles: a user can read/update their own row; admins can read their org.
drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
  for select using (id = auth.uid() or org_id = public.current_org_id());
drop policy if exists profiles_upsert_self on public.profiles;
create policy profiles_upsert_self on public.profiles
  for insert with check (id = auth.uid());
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update using (id = auth.uid());

-- Organisations: members can read; owner can update.
drop policy if exists orgs_read on public.organizations;
create policy orgs_read on public.organizations
  for select using (id = public.current_org_id() or owner_id = auth.uid());
drop policy if exists orgs_insert_owner on public.organizations;
create policy orgs_insert_owner on public.organizations
  for insert with check (owner_id = auth.uid());
drop policy if exists orgs_update_owner on public.organizations;
create policy orgs_update_owner on public.organizations
  for update using (owner_id = auth.uid());

-- Enrolments: a user sees their own; admins see the whole org.
drop policy if exists enroll_rw on public.enrollments;
create policy enroll_rw on public.enrollments
  for all using (user_id = auth.uid() or org_id = public.current_org_id())
  with check (user_id = auth.uid() or org_id = public.current_org_id());

-- Certificates: owner or org admin can read.
drop policy if exists cert_read on public.certificates;
create policy cert_read on public.certificates
  for select using (user_id = auth.uid() or org_id = public.current_org_id());

-- Waitlist: anyone may insert (public lead form); no read for clients.
drop policy if exists waitlist_insert on public.waitlist;
create policy waitlist_insert on public.waitlist
  for insert with check (true);

-- Public certificate verification is served via a SECURITY DEFINER function
-- so the /verify page can confirm a certificate without exposing the table.
create or replace function public.verify_certificate(cert_no text)
returns table (
  certificate_no text,
  full_name text,
  organisation text,
  course_title text,
  issued_at timestamptz,
  valid boolean
) language sql stable security definer set search_path = public as $$
  select certificate_no, full_name, organisation, course_title, issued_at, valid
  from public.certificates
  where certificate_no = cert_no and valid = true
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;
