import { NextRequest, NextResponse } from 'next/server';
import { getCompanyStats, updateCompanyStat } from '@/lib/db';
import { requireAdminAuth } from '@/lib/authHelper';

export async function GET() {
  try {
    const stats = await getCompanyStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve stats' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Stat ID required' }, { status: 400 });
    }
    const updated = await updateCompanyStat(body.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}
