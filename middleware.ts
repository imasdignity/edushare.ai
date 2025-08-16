import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect to login if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Role-based access control
    const isAdmin = token.role === 'admin';
    const isTeacher = token.role === 'teacher';
    const isStudent = token.role === 'student';
    const isParent = token.role === 'parent';

    // Admin routes
    if (pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Teacher routes
    if (pathname.startsWith('/teacher') && !isTeacher && !isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Student routes
    if (pathname.startsWith('/student') && !isStudent && !isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Parent routes
    if (pathname.startsWith('/parent') && !isParent && !isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|auth/.*|$).*)',
  ],
};
