"use client"

import { useMemo } from "react"
import DiplomaCard from "./diploma-card"
import { useDiplomasInfinite } from "../hooks/hooks"
import InfiniteScroll from "react-infinite-scroll-component"
import { DiplomaListSkeleton } from "./diploma-list-infinite-skeleton"

export default function DiplomasList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useDiplomasInfinite()

  const allDiplomas = useMemo(
    () => data?.pages.flatMap((page) => page.data ?? []) ?? [],
    [data]
  )

  if (isLoading) return <DiplomaListSkeleton />

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-destructive">Something went wrong. Please try again.</p>
      </div>
    )
  }

  return (
    <InfiniteScroll
      dataLength={allDiplomas.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<DiplomaListSkeleton />}
      endMessage={
        allDiplomas.length > 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            You have seen all diplomas.
          </p>
        )
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allDiplomas.map((diploma, index) => (
          <DiplomaCard key={diploma.id} diploma={diploma} index={index} />
        ))}
      </div>
    </InfiniteScroll>
  )
}