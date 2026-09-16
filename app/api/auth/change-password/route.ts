import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/authHelper';
import { validatePasswordStrength } from '@/lib/auth';
import { verifyAdminPassword, setAdminPassword, getAdminCredentials } from '@/lib/db';

export async function POST(request: NextRequest) {
  // 1. Enforce admin authentication
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const currentPassword = (body.currentPassword || '').trim();
    const newPassword = (body.newPassword || '').trim();
    const confirmPassword = body.confirmPassword !== undefined ? body.confirmPassword.trim() : newPassword;

    if (!newPassword) {
      return NextResponse.json(
        { success: false, error: 'New password is required.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New password and confirmation do not match.' },
        { status: 400 }
      );
    }

    // Check current password if one is already set
    const existingCreds = await getAdminCredentials();
    const envPassword = process.env.ADMIN_PASSWORD;

    if (existingCreds || envPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password is required to change password.' },
          { status: 400 }
        );
      }

      const isCurrentValid = await verifyAdminPassword(currentPassword);
      if (!isCurrentValid) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect.' },
          { status: 401 }
        );
      }
    }

    // Validate new password strength
    const strength = validatePasswordStrength(newPassword);
    if (!strength.isValid) {
      return NextResponse.json(
        { success: false, error: strength.message || 'Password does not meet enterprise security requirements.' },
        { status: 400 }
      );
    }

    // Save new hashed password with new dynamic salt
    await setAdminPassword(newPassword);

    return NextResponse.json({
      success: true,
      message: 'Administrator password updated successfully.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update administrator password.' },
      { status: 500 }
    );
  }
}
