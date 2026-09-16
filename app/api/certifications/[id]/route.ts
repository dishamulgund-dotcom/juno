import { NextRequest, NextResponse } from 'next/server';
import { getCertificationById, updateCertification, deleteCertification } from '@/lib/db';
import { requireAdminAuth } from '@/lib/authHelper';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cert = await getCertificationById(id);
    if (!cert) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: cert });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateCertification(id, body);
    if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const { id } = await params;
    const deleted = await deleteCertification(id);
    if (!deleted) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Certification archived' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
