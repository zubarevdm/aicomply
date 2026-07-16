"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function JoinClient({ token, locale }: { token: string; locale: string }) {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (!res.ok) throw new Error();
        router.push(`/${locale}/learn`);
      } catch {
        setError(true);
      }
    })();
  }, [token, locale, router]);

  return (
    <div className="text-center text-sm text-slate-500">
      {error ? "Could not join. Check your invite link." : "Joining…"}
    </div>
  );
}
