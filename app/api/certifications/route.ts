import { NextRequest, NextResponse } from 'next/server';
import { getCertifications, createCertification } from '@/lib/db';
import { requireAdminAuth } from '@/lib/authHelper';

export async function GET() {
  try {
    const data = await getCertifications();
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve certifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();

    if (!body.name || !body.type || !body.issuingAuthority || !body.certificateNumber) {
      return NextResponse.json({ success: false, error: 'Missing required certificate fields' }, { status: 400 });
    }

    const newCert = await createCertification({
      name: body.name.trim(),
      type: body.type,
      issuingAuthority: body.issuingAuthority.trim(),
      certificateNumber: body.certificateNumber.trim(),
      issueDate: body.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: body.expiryDate || 'Permanent',
      scope: body.scope || '',
      documentUrl: body.documentUrl || '',
      status: body.status || 'active',
      verified: body.verified !== undefined ? !!body.verified : true
    });

    return NextResponse.json({ success: true, data: newCert }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create certificate' }, { status: 500 });
  }
}
