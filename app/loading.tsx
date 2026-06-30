export default function Loading() {
  return (
    <div className="space-y-4 px-4 py-8 sm:px-6 lg:px-10">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-xl border border-surface-border bg-surface/40"
        />
      ))}
    </div>
  )
}
