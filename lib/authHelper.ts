import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from './auth';

export interface AuthResult {
  authorized: boolean;
  role?: string;
  error?: string;
}

/**
 * Validates admin credentials from request cookies or Authorization headers.
 */
export function checkAdminAuth(request: NextRequest): AuthResult {
  // 1. Check HTTP-only cookie
  const sessionCookie = request.cookies.get('juno_admin_session')?.value;
  if (sessionCookie && verifySessionToken(sessionCookie)) {
    return { authorized: true, role: 'super_admin' };
  }

  // 2. Check Authorization Bearer header
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token && verifySessionToken(token)) {
      return { authorized: true, role: 'super_admin' };
    }
  }

  // 3. Check custom header
  const customHeader = request.headers.get('x-juno-token');
  if (customHeader && verifySessionToken(customHeader)) {
    return { authorized: true, role: 'super_admin' };
  }

  return {
    authorized: false,
    error: 'Access denied. Valid administrator credentials or active session required.'
  };
}

/**
 * Returns an unauthorized JSON NextResponse if authentication fails.
 */
export function requireAdminAuth(request: NextRequest): NextResponse | null {
  const auth = checkAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        error: auth.error || 'Unauthorized administrative access.'
      },
      { status: 401 }
    );
  }
  return null;
}
