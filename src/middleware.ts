import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/jwt';

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['ADMIN', 'EMPLOYEE'],
  '/admin/user-manager': ['ADMIN', 'EMPLOYEE'],
  '/admin/job-posts': ['ADMIN', 'EMPLOYEE'],
  '/admin/applications': ['ADMIN', 'EMPLOYEE'],
  '/admin/interviews': ['ADMIN', 'EMPLOYEE'],
  '/profile': ['ADMIN', 'EMPLOYEE', 'CANDIDATE'],
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Check if the path is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    path.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      console.log('Token is invalid');
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify token and get user data
      const decoded = await verifyToken(token);
      
      if (!decoded) {
        throw new Error('Invalid token');
      }

      // Check if user has required role for the route
      const requiredRoles = Object.entries(protectedRoutes).find(([route]) => 
        path.startsWith(route)
      )?.[1];

      if (requiredRoles && !requiredRoles.includes(decoded.role)) {
        // Redirect to unauthorized page if user doesn't have required role
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Add user info to headers for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.id);
      requestHeaders.set('x-user-role', decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch {
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/api/:path*'
  ]
}; 