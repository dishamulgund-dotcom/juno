import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/authHelper';
import { uploadFile } from '@/lib/fileStorage';

export async function POST(request: NextRequest) {
  // 1. Verify Admin Authentication
  const authResponse = requireAdminAuth(request);
  if (authResponse) return authResponse;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folderParam = (formData.get('folder') as string) || 'products';
    const folder = folderParam === 'documents' ? 'documents' : 'products';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file was provided in the upload request.' },
        { status: 400 }
      );
    }

    // 2. Upload to Cloud Storage (Supabase Storage / CDN)
    const result = await uploadFile(file, folder);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Upload failed validation.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename
    });
  } catch (error: any) {
    console.error('Secure image/document upload failed:', error);
    return NextResponse.json(
      { success: false, error: 'File upload processing failed on server.' },
      { status: 500 }
    );
  }
}
