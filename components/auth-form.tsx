"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const PROVIDERS = [
  { id: "github" as const, label: "GitHub" },
  { id: "google" as const, label: "Google" },
] as const;

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "sign_up") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage("Check your email for a confirmation link.");
      }
    } else {
      const { error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/dashboard");
      }
    }

    setLoading(false);
  }

  async function handleOAuth(provider: (typeof PROVIDERS)[number]["id"]) {
    setError(null);
    setMessage(null);
    setOauthLoading(provider);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setOauthLoading(null);
    }
  }

  const isLoading = loading || oauthLoading !== null;

  return (
    <div className="space-y-4">
      <form onSubmit={handleEmailAuth} className="space-y-3">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="you@example.com"
            className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-stone-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:placeholder:text-stone-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="••••••••"
            className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-stone-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:placeholder:text-stone-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-800 disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700"
        >
          {loading
            ? mode === "sign_up"
              ? "Signing up..."
              : "Signing in..."
            : mode === "sign_up"
              ? "Sign Up"
              : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-stone-500 dark:text-stone-400">
        {mode === "sign_in" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("sign_up");
                setError(null);
                setMessage(null);
              }}
              className="font-medium text-green-700 hover:underline dark:text-green-500"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("sign_in");
                setError(null);
                setMessage(null);
              }}
              className="font-medium text-green-700 hover:underline dark:text-green-500"
            >
              Sign in
            </button>
          </>
        )}
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-300 dark:border-stone-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-stone-500 dark:bg-stone-900 dark:text-stone-400">
            or
          </span>
        </div>
      </div>

      {PROVIDERS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => handleOAuth(id)}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
        >
          {oauthLoading === id
            ? "Redirecting..."
            : `Continue with ${label}`}
        </button>
      ))}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {message && (
        <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
      )}
    </div>
  );
}
