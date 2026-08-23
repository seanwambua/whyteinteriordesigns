// proxy.ts (or middleware.ts)
import { clerkMiddleware } from '@clerk/nextjs/server';

// 1. Explicitly list public path prefixes using native string/regex checks
const PUBLIC_ROUTES = [
  '/',
  '/pricing',
  '/feedback',
  '/terms',
  '/services/interior-design',
  '/services/interior-decor',
];

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Helper check for exact matches, wildcards, and webhooks
  const isPublicRoute = 
    PUBLIC_ROUTES.includes(pathname) || 
    pathname.startsWith('/sign-in') || 
    pathname.startsWith('/sign-up') || 
    pathname.startsWith('/api/webhooks');

  const isAdminRoute = 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/api/admin');

  // A. Enforce Role-Based Access Control (RBAC) on admin paths first
  if (isAdminRoute) {
    await auth.protect((has) => has({ role: 'org:admin' }));
    return; // Stop execution here if it's an admin route
  }

  // B. Reject non-public routes early if they are not explicitly whitelisted
  if (!isPublicRoute) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. Static extensions (.png, .jpg, .ico, .svg, etc.)
     */
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API endpoints and tRPC procedures
    '/(api|trpc)(.*)',
  ],
};
