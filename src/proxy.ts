import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes are completely public and don't require auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/faq',
  '/contact',
  '/blueprints',
  '/blogs',
  '/calc(.*)',
  '/legal(.*)',
  '/sandbox(.*)',
  '/api/webhooks/stripe',
])

export default clerkMiddleware(async (auth, request) => {
  // If the user tries to access a protected route (e.g. /portal, /admin), enforce login
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
