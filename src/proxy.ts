import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

const authRoutes: readonly string[] = ["/auth/login", "/auth/register"]

// Admin-only areas. Access is refused here on the server — never rely on
// hiding the UI alone.
const adminRoutePrefixes: readonly string[] = [
  "/dashboard/exams",
  "/dashboard/audit-log",
  "/dashboard/create-new-diploma",
]

const isPublicPath = (pathname: string) =>
  pathname === "/" || authRoutes.includes(pathname)

const isAuthPath = (pathname: string) => authRoutes.includes(pathname)

const isAdminPath = (pathname: string) =>
  adminRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const token = await getToken({ req })
  const isLoggedIn = !!token?.token

  // Public pages stay reachable by everyone. Logged-in users hitting an auth
  // page are sent straight to the dashboard instead.
  if (isPublicPath(pathname)) {
    if (isLoggedIn && isAuthPath(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin))
    }
    return NextResponse.next()
  }

  // Everything else (the dashboard) requires login.
  if (!isLoggedIn) {
    const redirectUrl = new URL("/auth/login", req.nextUrl.origin)
    redirectUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  const role = (token?.user as { role?: string } | undefined)?.role
  if (isAdminPath(pathname) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin))
  }

  return NextResponse.next()
}