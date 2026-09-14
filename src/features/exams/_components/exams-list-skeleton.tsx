import { Skeleton } from "@/src/shared/components/ui/skeleton"

const ExamsListSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="relative flex w-full items-center gap-5 rounded-lg border border-border bg-card p-4"
        >
          <div className="flex size-24 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Skeleton className="size-19 bg-muted" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <Skeleton className="h-5 w-1/2 bg-muted" />
              <Skeleton className="h-4 w-24 bg-muted" />
            </div>
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-5/6 bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExamsListSkeleton