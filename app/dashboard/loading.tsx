export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-10 w-28 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-900"
          />
        ))}
      </div>
    </div>
  );
}
