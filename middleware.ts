import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isEdgeSessionValid(token: string): boolean {
  if (!token || !token.startsWith('juno.')) return false;
  const parts = token.split('.');
  if (parts.length < 5) return false;
  const timestampStr = parts[2];
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp) || Date.now() - timestamp > 24 * 60 * 60 * 1000) return false;
  const signature = parts[4];
  return typeof signature === 'string' && signature.length >= 6;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow login page and static assets
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/uploads') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Protect all /admin/* routes
  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get('juno_admin_session')?.value;

    if (!sessionToken || !isEdgeSessionValid(sessionToken)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
