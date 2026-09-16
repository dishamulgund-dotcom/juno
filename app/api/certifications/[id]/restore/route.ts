import { NextRequest, NextResponse } from 'next/server';
import { restoreCertification } from '@/lib/db';
import { requireAdminAuth } from '@/lib/authHelper';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const { id } = await params;
    const restored = await restoreCertification(id);
    if (!restored) {
      return NextResponse.json(
        { success: false, error: 'Certification not found or could not be restored.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: restored,
      message: 'Certification record restored successfully.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to restore certification.' },
      { status: 500 }
    );
  }
}

export const POST = PUT;

