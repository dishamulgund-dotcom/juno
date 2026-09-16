import fs from 'fs';
import path from 'path';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/svg+xml',
  'application/pdf'
];

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

/**
 * Persists an uploaded file to Cloud Object Storage (Supabase Storage)
 * or local filesystem fallback with full validation.
 */
export async function uploadFile(
  file: File,
  folder: 'products' | 'documents' | 'general' = 'products'
): Promise<UploadResult> {
  try {
    if (!file) {
      return { success: false, error: 'No file provided for upload.' };
    }

    // Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Unsupported file format (${file.type}). Permitted formats: JPG, PNG, WEBP, SVG, PDF.`
      };
    }

    // Validate File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: 'File size exceeds maximum permitted limit of 15MB.'
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawExt = path.extname(file.name) || (file.type === 'application/pdf' ? '.pdf' : '.png');
    const ext = rawExt.toLowerCase();
    const cleanBase = path
      .basename(file.name, rawExt)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const uniqueFilename = `juno_${cleanBase}_${Date.now()}${ext}`;
    const storagePath = `${folder}/${uniqueFilename}`;

    // -------------------------------------------------------------------------
    // 1. SUPABASE CLOUD OBJECT STORAGE (PRODUCTION SINGLE SOURCE OF TRUTH)
    // -------------------------------------------------------------------------
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { error: uploadError } = await supabase.storage
          .from('juno-media')
          .upload(storagePath, buffer, {
            contentType: file.type,
            upsert: true
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('juno-media')
            .getPublicUrl(storagePath);

          if (publicUrlData?.publicUrl) {
            return {
              success: true,
              url: publicUrlData.publicUrl,
              filename: uniqueFilename
            };
          }
        } else {
          console.error('Supabase storage upload error:', uploadError.message);
          return {
            success: false,
            error: `Supabase Storage error: ${uploadError.message}`
          };
        }
      }
    }

    // -------------------------------------------------------------------------
    // 2. PRODUCTION ENVIRONMENT SAFETY (NO SILENT LOCAL DISK IN PRODUCTION)
    // -------------------------------------------------------------------------
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd) {
      return {
        success: false,
        error: 'Cloud Storage Error: Production requires Supabase Storage ("juno-media" bucket). Local filesystem storage is disabled in production.'
      };
    }

    // -------------------------------------------------------------------------
    // 3. ISOLATED DEVELOPMENT-ONLY MOCK UPLOAD
    // -------------------------------------------------------------------------
    const isDevMockEnabled = process.env.ENABLE_DEV_MOCK_MODE === 'true' || process.env.ENABLE_DEV_MOCK_MODE === '1';
    if (!isDevMockEnabled) {
      return {
        success: false,
        error: 'Storage Configuration Error: Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are missing. Set ENABLE_DEV_MOCK_MODE=true for transient local development.'
      };
    }

    console.warn('[DEV ONLY WARNING] Storing upload in local temporary folder. This is NOT persistent cloud storage and will NOT activate in production.');

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${uniqueFilename}`;

    return {
      success: true,
      url: publicUrl,
      filename: uniqueFilename
    };
  } catch (err: any) {
    console.error('File storage engine error:', err);
    return {
      success: false,
      error: err?.message || 'Server-side file storage failure.'
    };
  }
}
