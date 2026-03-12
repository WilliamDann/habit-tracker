import { AuthForm } from "@/components/auth-form";

export const metadata = {
  title: "Sign In — Habit Tracker",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Habit Tracker</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Track your habits and build streaks
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
