import { NextRequest, NextResponse } from 'next/server';
import { getEnquiries, createEnquiry } from '@/lib/db';
import { requireAdminAuth } from '@/lib/authHelper';

// GET /api/enquiries - Strictly protected for authorized administrators
export async function GET(request: NextRequest) {
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const enquiries = await getEnquiries();
    return NextResponse.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve enquiries' }, { status: 500 });
  }
}

// POST /api/enquiries - Publicly accessible for customer/distributor submissions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic anti-spam honeypot check
    if (body.honeypot) {
      return NextResponse.json({ success: true, message: 'Enquiry received' }, { status: 200 });
    }

    if (!body.name || !body.email || !body.phone || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Missing required enquiry fields (name, email, phone, message)' },
        { status: 400 }
      );
    }

    // Basic sanitization
    const sanitizedName = String(body.name).trim().slice(0, 150);
    const sanitizedEmail = String(body.email).trim().toLowerCase().slice(0, 150);
    const sanitizedPhone = String(body.phone).trim().slice(0, 50);
    const sanitizedCompany = body.company ? String(body.company).trim().slice(0, 150) : '';
    const sanitizedSubject = body.subject ? String(body.subject).trim().slice(0, 200) : `Inquiry from ${sanitizedName}`;
    const sanitizedCategory = body.category || 'Product Inquiry';
    const sanitizedMessage = String(body.message).trim().slice(0, 5000);

    const newEnq = await createEnquiry({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      company: sanitizedCompany,
      category: sanitizedCategory,
      subject: sanitizedSubject,
      message: sanitizedMessage
    });

    return NextResponse.json({ success: true, data: newEnq }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to log enquiry' }, { status: 500 });
  }
}
