"use client"
import { MoveRight } from "lucide-react"
import Image from "next/image"
import { useExamsInfinite } from "../hooks/hooks"
import InfiniteScroll from "react-infinite-scroll-component"
import { useMemo } from "react"
import ExamsListSkeleton from "./exams-list-skeleton"
import Link from "next/link"
import { usePathname } from "next/navigation"
import slugify from "slugify"

const ExamsList = ({ id }: { id: string }) => {
  const pathName = usePathname()

  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useExamsInfinite(id)
  const allExamsData = useMemo(
    () => data?.pages.flatMap((page) => page.data ?? []) ?? [],
    [data]
  )

  if (isLoading) return <ExamsListSkeleton />

  if (isError) {
    return (
      <div className="rounded-lg border border-border bg-card p-10 text-center">
        <p className="text-destructive">Something went wrong. Please try again.</p>
      </div>
    )
  }

  return (
    <InfiniteScroll
      dataLength={allExamsData.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<ExamsListSkeleton />}
      endMessage={
        allExamsData.length > 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            You have seen all exams.
          </p>
        )
      }
    >
      <div className="space-y-4">
        {allExamsData.map((exam) => (
          <div
            key={exam.id}
            className="group relative flex items-center gap-5 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
          >
            <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
              <Image
                src={exam.image}
                width={75}
                height={75}
                className="object-cover"
                alt={exam.title}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <h2 className="truncate text-lg font-semibold text-foreground">
                  {exam.title}
                </h2>
                <div className="flex shrink-0 items-center gap-3 text-sm tabular-nums text-muted-foreground">
                  <span>{exam.duration} min</span>
                </div>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {exam.description}
              </p>
            </div>

            <div className="absolute right-4 bottom-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              <Link
                href={`${pathName}/${exam.id}/${slugify(exam.title, { lower: true })}`}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <span>START</span>
                <MoveRight className="size-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  )
}

export default ExamsList