export default function Loading() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-4">
        <div className="h-8 w-64 animate-pulse rounded bg-surface" />
        <div className="h-10 w-full max-w-md animate-pulse rounded-md bg-surface" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="h-6 w-48 animate-pulse rounded bg-surface" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[2/3] w-full animate-pulse rounded-lg bg-surface"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
