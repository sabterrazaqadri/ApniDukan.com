import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of admin emails or usernames
const ADMIN_USERS = ['admin@apnidukan.com']; // Add your admin email(s) here

export function middleware(request: NextRequest) {
  // Check if the request is for the admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip middleware for login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for admin token
    const token = request.cookies.get('adminToken')?.value;
    
    if (!token) {
      // Redirect to login if no token is present
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // In a real application, you would verify the token here
    // For now, we'll just check if it exists
  }

  return NextResponse.next();
}

function isValidAdmin(authHeader: string): boolean {
  // Implement your authentication logic here
  // This is a placeholder - you should implement proper authentication
  return false;
}

export const config = {
  matcher: ['/admin/:path*']
};
