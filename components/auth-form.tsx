"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const PROVIDERS = [
  { id: "github" as const, label: "GitHub" },
  { id: "google" as const, label: "Google" },
] as const;

export function AuthForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleOAuth(provider: (typeof PROVIDERS)[number]["id"]) {
    setError(null);
    setLoading(provider);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      {PROVIDERS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => handleOAuth(id)}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
        >
          {loading === id ? "Redirecting..." : `Continue with ${label}`}
        </button>
      ))}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
