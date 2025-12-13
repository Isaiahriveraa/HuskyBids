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

    // If a signed-in user hits an auth page, redirect them away immediately.
    // This prevents Clerk from internally redirecting to the Home URL and
    // avoids navigation-throttling loops in the browser.
    if (userId && (pathname.startsWith('/login') || pathname.startsWith('/sign-up'))) {
      const requestedRedirect = req.nextUrl.searchParams.get('redirect');
      const safeRedirect =
        requestedRedirect && requestedRedirect.startsWith('/')
          ? requestedRedirect
          : '/dashboard';

      // Avoid redirecting to another auth route.
      const destination =
        safeRedirect.startsWith('/login') || safeRedirect.startsWith('/sign-up')
          ? '/dashboard'
          : safeRedirect;

      return NextResponse.redirect(new URL(destination, req.url));
    }

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

    // Redirect unauthenticated users from protected routes to sign-up
    if (!userId && isProtectedRoute) {
      const signUpUrl = new URL('/sign-up', req.url);
      signUpUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signUpUrl);
    }

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