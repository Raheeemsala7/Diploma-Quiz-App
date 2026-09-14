"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/src/shared/lib/utils"

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str) ||
  /^[0-9a-f]+-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)

const formatSegment = (seg: string) =>
  seg
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ")

export default function Breadcrumb() {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)
  const filtered = segments.filter((seg) => !isUUID(seg))
  const labels = ["Diploma", ...filtered.map(formatSegment)]

  return (
    <div className="border-b border-border bg-background px-4 py-3 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-1.5 overflow-hidden text-sm">
        {labels.map((label, index) => {
          const isLast = index === labels.length - 1
          return (
            <span
              key={`${label}-${index}`}
              className={cn(
                "truncate",
                isLast ? "font-semibold text-foreground" : "font-normal text-muted-foreground"
              )}
            >
              {index > 0 && <span className="px-1.5 text-muted-foreground/50">/</span>}
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}