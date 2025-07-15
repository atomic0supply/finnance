import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/jwt'
import { canAccessRoute } from './config/roles'

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
  '/about',
  '/contact'
];

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/transactions',
  '/properties',
  '/vehicles',
  '/services',
  '/reports',
  '/calendar',
  '/api/transactions',
  '/api/properties',
  '/api/vehicles',
  '/api/services',
  '/api/reports'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, images, and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('auth-token')?.value;

    if (!token) {
      // Redirect to login for web routes
      if (!pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      // Return 401 for API routes
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      // Redirect to login for web routes
      if (!pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      // Return 401 for API routes
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check route permissions for web routes
    if (!pathname.startsWith('/api/')) {
      const hasAccess = canAccessRoute(payload.role, pathname);
      if (!hasAccess) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // Add user info to request headers for API routes
    if (pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-role', payload.role);
      requestHeaders.set('x-user-email', payload.email);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
