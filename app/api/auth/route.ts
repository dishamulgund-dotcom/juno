import { NextRequest, NextResponse } from 'next/server';
import { generateSessionToken, validatePasswordStrength } from '@/lib/auth';
import { verifyAdminPassword, getAdminCredentials, setAdminPassword } from '@/lib/db';
import { checkLoginRateLimit, recordFailedLoginAttempt, resetLoginRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  // 1. Check Rate Limit
  const rateLimitStatus = checkLoginRateLimit(clientIp);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: rateLimitStatus.message || 'Too many failed login attempts. Please wait 15 minutes before retrying.'
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitStatus.retryAfterSeconds || 900)
        }
      }
    );
  }

  try {
    const body = await request.json();
    const password = (body.password || body.pin || '').trim();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Administrator password required' },
        { status: 400 }
      );
    }

    const existingCreds = await getAdminCredentials();
    const envPassword = process.env.ADMIN_PASSWORD;

    let isAuthenticated = false;

    if (existingCreds || envPassword) {
      // Normal authentication against stored Argon2id / hashed credentials
      isAuthenticated = await verifyAdminPassword(password);
    } else {
      // First-time initial setup when no credentials exist in database or environment
      const strength = validatePasswordStrength(password);
      if (strength.isValid) {
        await setAdminPassword(password);
        isAuthenticated = true;
      } else {
        return NextResponse.json(
          {
            success: false,
            error: `Initial administrator setup: ${strength.message || 'Password does not meet enterprise security requirements.'}`
          },
          { status: 400 }
        );
      }
    }

    if (isAuthenticated) {
      // Clear rate limiter upon successful authentication
      resetLoginRateLimit(clientIp);

      const token = generateSessionToken('super_admin');
      
      const response = NextResponse.json({
        success: true,
        token: token,
        role: 'super_admin',
        name: 'Administrator'
      });

      // Set secure HTTP-only cookie
      response.cookies.set('juno_admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    // Record failed attempt for rate limiting
    const failureRecord = recordFailedLoginAttempt(clientIp);
    const remainingWarning =
      failureRecord.remainingAttempts <= 2
        ? ` (${failureRecord.remainingAttempts} attempts remaining before temporary lockout)`
        : '';

    return NextResponse.json(
      { 
        success: false, 
        error: `Invalid administrator credentials.${remainingWarning}` 
      },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication service encountered an unexpected error.' },
      { status: 500 }
    );
  }
}
