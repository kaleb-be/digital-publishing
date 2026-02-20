import { clerkMiddleware } from "@clerk/nextjs/server";

// Apply Clerk's middleware to (almost) all routes so that
// `auth()` and other server helpers work reliably across the app.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static assets.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

