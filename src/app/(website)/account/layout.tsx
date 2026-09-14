import { BookOpenCheck, ChevronLeft } from "lucide-react"
import Link from "next/link"
import React from "react"
import { AccountNav } from "./_components/account-nav"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="space-y-6">
      <header className="flex items-center gap-3">
        <Link
          href="/"
          aria-label="Back to dashboard"
          className="grid size-10 place-items-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="flex items-center gap-2.5">
          <BookOpenCheck className="size-5 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Account Settings
          </h1>
        </div>
      </header>

      <div className="grid flex-1 gap-6 lg:grid-cols-[240px_1fr]">
        <AccountNav />
        <div className="rounded-lg border border-border bg-card p-6">
          {children}
        </div>
      </div>
    </section>
  )
}

export default layout