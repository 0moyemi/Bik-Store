import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('adminToken')
    const { pathname } = request.nextUrl

    const hasToken = !!token?.value

    // Protect all /admin routes except /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        if (!hasToken) {
            // SECURITY: No token, redirect to login
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // If has token and trying to access login page, redirect to dashboard
    if (pathname === '/admin/login' && hasToken) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    const response = NextResponse.next()

    // SECURITY: Add security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    return response
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ]
}
