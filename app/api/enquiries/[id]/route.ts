import { NextRequest, NextResponse } from 'next/server';
import { updateEnquiryStatus, deleteEnquiry } from '@/lib/db';
import { requireAdminAuth } from '@/lib/authHelper';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateEnquiryStatus(id, body.status, body.notes);
    if (!updated) return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update enquiry status' }, { status: 500 });
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
    const deleted = await deleteEnquiry(id);
    if (!deleted) return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Enquiry archived' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete enquiry' }, { status: 500 });
  }
}
