export interface KV {
  k: string;
  v: string;
}
export interface TD {
  t: string;
  d: string;
}
export interface QA {
  q: string;
  a: string;
}
export interface Plan {
  name: string;
  price: string;
  unit: string;
  features: string[];
  popular?: boolean;
}

export interface Dictionary {
  meta: { title: string; description: string };
  nav: {
    product: string;
    pricing: string;
    how: string;
    faq: string;
    login: string;
    dashboard: string;
    cta: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust: string;
  };
  problem: { title: string; body: string; points: KV[] };
  how: { title: string; steps: TD[] };
  features: { title: string; items: TD[] };
  pricing: {
    title: string;
    subtitle: string;
    note: string;
    cta: string;
    plans: Plan[];
  };
  upsell: { title: string; body: string; cta: string };
  faq: { title: string; items: QA[] };
  waitlist: {
    title: string;
    subtitle: string;
    email: string;
    company: string;
    size: string;
    role: string;
    submit: string;
    success: string;
    error: string;
    sizes: string[];
  };
  footer: {
    tagline: string;
    disclaimer: string;
    rights: string;
    product: string;
    company: string;
    legal: string;
  };
  course: {
    start: string;
    next: string;
    prev: string;
    lesson: string;
    of: string;
    toQuiz: string;
    progress: string;
    estTime: string;
  };
  quiz: {
    title: string;
    intro: string;
    question: string;
    submit: string;
    passTitle: string;
    passBody: string;
    failTitle: string;
    failBody: string;
    retry: string;
    yourScore: string;
    fullName: string;
    company: string;
    getCertificate: string;
    generating: string;
  };
  certificate: {
    heading: string;
    subheading: string;
    awarded: string;
    completed: string;
    issued: string;
    id: string;
    verify: string;
    download: string;
    verified: string;
    notFound: string;
    verifyTitle: string;
    issuedTo: string;
    organisation: string;
    course: string;
    status: string;
    valid: string;
  };
  dashboard: {
    title: string;
    coverage: string;
    trained: string;
    pending: string;
    invite: string;
    inviteHint: string;
    copyLink: string;
    copied: string;
    export: string;
    name: string;
    email: string;
    statusCol: string;
    dateCol: string;
    certCol: string;
    notConfigured: string;
    emptyState: string;
  };
}
