import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


const privateRoutes = new Set([
    '/dashboard',
    "/account",
    "/account/change-password",
    

]);
const authRoutes = new Set([
    '/auth/login',
    '/auth/register',
]);
export default async function proxy(req: NextRequest) {

    let pathname = req.nextUrl.pathname



    const token = await getToken({ req });

    // if (privateRoutes.has(pathname)) {
    //     if (!token?.token) {
    //         const redirectUrl = new URL('/auth/login', req.nextUrl.origin);
    //         redirectUrl.searchParams.set('callbackUrl', pathname)
    //         return NextResponse.redirect(redirectUrl)
    //     }
    //     return NextResponse.next()
    // }

    // if (authRoutes.has(pathname)) {
    //     if (token?.token) {
    //         return NextResponse.redirect(new URL("/", req.nextUrl))
    //     }

    //     return NextResponse.next();

    // }


    const isLoggedIn = !!token?.token

  const isAuthRoute = authRoutes.has(pathname)

  // ✅ حماية كل حاجة ماعدا auth routes
  const isProtected =
    !isAuthRoute &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/favicon.ico")

  // 🔐 لو route محمي ومش عامل login
  if (isProtected && !isLoggedIn) {
    const redirectUrl = new URL("/auth/login", req.nextUrl.origin)
    redirectUrl.searchParams.set("callbackUrl", pathname)

    return NextResponse.redirect(redirectUrl)
  }

  // 🔁 لو عامل login وداخل auth routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

}


export const config = {
    /*
      * Match all request paths except for the ones starting with:
      * - api (API routes)
      * - _next/static (static files)
      * - _next/image (image optimization files)
      * - favicon.ico, sitemap.xml, robots.txt (metadata files)
   */
    matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
}