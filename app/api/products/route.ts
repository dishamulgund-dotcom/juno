import { NextRequest, NextResponse } from 'next/server';
import { getProductsPaginated, createProduct } from '@/lib/db';
import { slugify } from '@/lib/utils';
import { requireAdminAuth } from '@/lib/authHelper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const dosageForm = searchParams.get('dosage') || undefined;
    const featuredOnly = searchParams.get('featured') === 'true';
    const includeDrafts = searchParams.get('includeDrafts') === 'true';
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 100;
    const sortBy = (searchParams.get('sortBy') as any) || undefined;

    const result = await getProductsPaginated({
      category,
      search,
      dosageForm,
      featuredOnly,
      includeDrafts,
      page,
      limit,
      sortBy
    });

    return NextResponse.json({
      success: true,
      count: result.products.length,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasMore: result.hasMore,
      data: result.products
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // 1. Enforce Admin Authentication
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const body = await request.json();

    if (!body.name || !body.genericName || !body.composition || !body.dosageForm || !body.strength) {
      return NextResponse.json(
        { success: false, error: 'Missing required product fields (name, genericName, composition, dosageForm, strength)' },
        { status: 400 }
      );
    }

    const slug = body.slug ? slugify(body.slug) : slugify(body.name);

    const newProduct = await createProduct({
      name: body.name.trim(),
      slug,
      genericName: body.genericName.trim(),
      composition: body.composition.trim(),
      dosageForm: body.dosageForm,
      strength: body.strength.trim(),
      therapeuticCategory: body.therapeuticCategory || 'General Therapeutics',
      packSize: body.packSize || 'Standard Packaging',
      manufacturer: body.manufacturer || 'Verified cGMP Manufacturing Partner',
      description: body.description || '',
      indications: body.indications || '',
      storageInstructions: body.storageInstructions || 'Store in a cool, dry place protected from light.',
      image: body.image || '',
      documentUrl: body.documentUrl || '',
      isFeatured: !!body.isFeatured,
      status: body.status || 'published'
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
