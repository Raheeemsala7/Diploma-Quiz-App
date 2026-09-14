import { authOptions } from "@/src/auth"
import Breadcrumb from "@/src/shared/components/breadcrumb"
import LogoApp from "@/src/shared/components/icons/Logo"
import { Button } from "@/src/shared/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/src/shared/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"
import { SidebarNav } from "../_components/sidebar-nav"
import { ThemeToggle } from "@/src/shared/components/ui/theme-toggle"

interface IProps {
  children: React.ReactNode
  admin: React.ReactNode
  user: React.ReactNode
}

const layoutDashboard = async ({ children, admin, user }: IProps) => {
  const userData = await getServerSession(authOptions)
  const isAdmin = userData?.user.role === "ADMIN"

  // Defense in depth — the middleware already guards this layout, but the
  // page must never render without a session.
  if (!userData) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-sidebar-border bg-sidebar lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" aria-label="Exam App home">
            <LogoApp onDark />
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
            <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              showCloseButton={false}
              className="w-80 gap-0 bg-sidebar p-0 text-sidebar-foreground"
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between px-4 py-4">
                  <Link href="/dashboard" aria-label="Exam App home">
                    <LogoApp onDark />
                  </Link>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Close navigation menu"
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    >
                      <X />
                    </Button>
                  </SheetClose>
                </div>
                <div className="min-h-0 flex-1 px-3 pb-4">
                  <SidebarNav user={userData?.user} isAdmin={isAdmin} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
          <div className="flex h-full flex-col px-4 pt-6 pb-4">
            <div className="flex items-center justify-between px-2">
              <Link href="/dashboard" aria-label="Exam App home">
                <LogoApp onDark />
              </Link>
              <ThemeToggle className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
            </div>
            <div className="mt-6 min-h-0 flex-1">
              <SidebarNav user={userData?.user} isAdmin={isAdmin} />
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">
          <Breadcrumb />
          <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8">
            <div className="space-y-6">
              {children}
              {isAdmin ? admin : user}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default layoutDashboard