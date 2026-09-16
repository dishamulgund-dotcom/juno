import { NextRequest, NextResponse } from 'next/server';
import { getCorporateProfile, updateCorporateProfile } from '@/lib/db';
import { requireAdminAuth } from '@/lib/authHelper';

export async function GET() {
  try {
    const profile = await getCorporateProfile();
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve corporate profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const updated = await updateCorporateProfile(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}
