import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    '/',
    '/login(.*)',
    '/sign-up(.*)',
    '/api/games/upcoming(.*)',
    '/api/games/fetch-espn(.*)',
    '/api/games/sync(.*)',
    '/api/games/completed(.*)',
  ],

  afterAuth(auth, req) {
    const { userId } = auth;
    const { pathname } = req.nextUrl;

    // Protected routes that require authentication
    const protectedRoutes = [
      '/dashboard',
      '/betting-history',
      '/games',
      '/leaderboard',
      '/tasks',
      '/change-password',
      '/change-username',
    ];

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Redirect unauthenticated users from protected routes to login
    if (!userId && isProtectedRoute) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // NOTE: Do NOT redirect authenticated users from /login here.
    // Let AuthPageWrapper handle that client-side to avoid race conditions
    // with Clerk's session initialization after sign-in.

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};