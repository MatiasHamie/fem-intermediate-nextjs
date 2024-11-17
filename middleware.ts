import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { COOKIE_NAME } from './utils/constants'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/dashboard') {
    if (!request.cookies.has(COOKIE_NAME)) {
      return NextResponse.redirect(new URL('/signin', request.nextUrl))
    }
  }
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/'],
}
