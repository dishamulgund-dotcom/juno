import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db';
import { slugify } from '@/lib/utils';
import { requireAdminAuth } from '@/lib/authHelper';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
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
    
    if (body.name && !body.slug) {
      body.slug = slugify(body.name);
    }

    const updated = await updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product formulation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update formulation' }, { status: 500 });
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
    const deleted = await deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Product formulation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product archived successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to archive product' }, { status: 500 });
  }
}
