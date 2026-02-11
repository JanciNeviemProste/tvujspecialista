import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Content Security Policy
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' js.stripe.com www.googletagmanager.com www.google-analytics.com *.sentry.io",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: res.cloudinary.com *.cloudinary.com www.google-analytics.com",
    "font-src 'self' data:",
    `connect-src 'self' ${apiUrl} api.stripe.com *.sentry.io *.ingest.sentry.io www.google-analytics.com`,
    "frame-src 'self' js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ')
  response.headers.set('Content-Security-Policy-Report-Only', cspDirectives)

  // HSTS only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files and api
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
