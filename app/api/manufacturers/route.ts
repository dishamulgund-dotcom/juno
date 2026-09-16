import { NextRequest, NextResponse } from 'next/server';
import { getManufacturers, createManufacturer } from '@/lib/db';
import { requireAdminAuth } from '@/lib/authHelper';

export async function GET() {
  try {
    const manufacturers = await getManufacturers();
    return NextResponse.json({ success: true, count: manufacturers.length, data: manufacturers });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve manufacturers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();

    if (!body.name || !body.location || !body.country) {
      return NextResponse.json({ success: false, error: 'Missing required partner fields' }, { status: 400 });
    }

    const newM = await createManufacturer({
      name: body.name.trim(),
      location: body.location.trim(),
      state: body.state || '',
      country: body.country,
      capabilities: Array.isArray(body.capabilities) ? body.capabilities : [],
      dosageForms: Array.isArray(body.dosageForms) ? body.dosageForms : [],
      certifications: Array.isArray(body.certifications) ? body.certifications : ['cGMP Compliant'],
      qualitySystems: Array.isArray(body.qualitySystems) ? body.qualitySystems : [],
      website: body.website || '',
      status: body.status || 'verified',
      description: body.description || ''
    });

    return NextResponse.json({ success: true, data: newM }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create manufacturer' }, { status: 500 });
  }
}
