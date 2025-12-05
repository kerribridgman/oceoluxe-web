import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

// Admin routes - only accessible by owner/admin roles
const adminRoutes = '/dashboard';
// Studio routes - accessible by any authenticated user with subscription
const studioRoutes = '/studio';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  // Exclude login/join pages and public studio pages from protection
  const isLoginPage = pathname.startsWith('/studio-login') || pathname.startsWith('/studio-join');
  const isPublicStudioPage = pathname === '/studio/subscribe' || pathname.startsWith('/studio-systems');

  const isAdminRoute = pathname.startsWith(adminRoutes);
  // Protected studio routes: /studio or /studio/* but NOT /studio-systems, /studio-login, etc.
  const isStudioRoute = (pathname === '/studio' || pathname.startsWith('/studio/')) && !isPublicStudioPage;
  const isProtectedRoute = isAdminRoute || isStudioRoute;

  // Handle protected routes (both admin and studio)
  if (isProtectedRoute) {
    if (!sessionCookie) {
      // Redirect to appropriate login page
      const loginUrl = isStudioRoute ? '/studio-login' : '/sign-in';
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }

    try {
      const parsed = await verifyToken(sessionCookie.value);

      // Validate the parsed token structure
      if (!parsed || !parsed.user || typeof parsed.user.id !== 'number') {
        console.error('Invalid token structure');
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        response.cookies.delete('session');
        return response;
      }

      // Check if token is expired
      if (!parsed.expires || new Date(parsed.expires) < new Date()) {
        console.error('Token expired');
        const response = NextResponse.redirect(new URL('/sign-in', request.url));
        response.cookies.delete('session');
        return response;
      }

      // Role-based access control
      const userRole = parsed.user.role || 'member';

      // Admin routes: only allow owner/admin roles
      if (isAdminRoute && userRole !== 'owner' && userRole !== 'admin') {
        // Non-admin users trying to access dashboard get redirected to studio
        return NextResponse.redirect(new URL('/studio', request.url));
      }
    } catch (error) {
      console.error('Invalid session token:', error);
      const loginUrl = isStudioRoute ? '/studio-login' : '/sign-in';
      const response = NextResponse.redirect(new URL(loginUrl, request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  let res = NextResponse.next();

  if (sessionCookie && request.method === 'GET') {
    try {
      const parsed = await verifyToken(sessionCookie.value);

      // Validate token structure before refreshing
      if (!parsed || !parsed.user || typeof parsed.user.id !== 'number' || !parsed.expires) {
        console.error('Invalid token structure during refresh');
        res.cookies.delete('session');
        if (isProtectedRoute) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }
        return res;
      }

      // Don't refresh if expired
      if (new Date(parsed.expires) < new Date()) {
        console.error('Token expired during refresh');
        res.cookies.delete('session');
        if (isProtectedRoute) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }
        return res;
      }

      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      res.cookies.set({
        name: 'session',
        value: await signToken({
          ...parsed,
          expires: expiresInOneDay.toISOString()
        }),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresInOneDay
      });
    } catch (error) {
      console.error('Error updating session:', error);
      res.cookies.delete('session');
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs'
};
