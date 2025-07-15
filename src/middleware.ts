import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from './lib/auth'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const res = requireAuth(request, ['admin', 'user'])
    if (res) return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
