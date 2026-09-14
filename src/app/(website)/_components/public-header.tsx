import { getServerSession } from "next-auth"
import Link from "next/link"
import { LayoutDashboard } from "lucide-react"
import { authOptions } from "@/src/auth"
import LogoApp from "@/src/shared/components/icons/Logo"
import { buttonVariants } from "@/src/shared/components/ui/button"
import { ThemeToggle } from "@/src/shared/components/ui/theme-toggle"
import { cn } from "@/src/shared/lib/utils"
import { HeaderUserMenu } from "./header-user-menu"

/**
 * Public site header. Authentication state is resolved on the server so the
 * login flow stays consistent without any browser-side session fetching.
 */
export async function PublicHeader() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 lg:h-20 lg:px-8">
        <Link href="/" aria-label="Exam App home" className="shrink-0">
          <LogoApp />
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="Account">
          {user ? (
            <>
              <Link
                href="/dashboard"
                aria-label="Go to your dashboard"
                className={cn(buttonVariants({ variant: "ghost" }), "h-9 px-3")}
              >
                <LayoutDashboard className="size-4 sm:hidden" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <HeaderUserMenu user={user} />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-9 px-3 sm:px-4"
                )}
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className={cn(buttonVariants(), "h-9 px-3 sm:px-4")}
              >
                Sign up
              </Link>
            </>
          )}
          <ThemeToggle className="ml-1 sm:ml-2" />
        </nav>
      </div>
    </header>
  )
}

export default PublicHeader