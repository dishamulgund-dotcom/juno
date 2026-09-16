import {
  Product,
  ProductCategory,
  Manufacturer,
  Certification,
  CompanyStat,
  CorporateProfile,
  Enquiry,
  SiteSettings
} from '@/types';
import {
  initialProducts,
  initialProductCategories,
  initialManufacturers,
  initialCertifications,
  initialCompanyStats,
  initialCorporateProfile,
  initialEnquiries,
  initialSiteSettings
} from './mockData';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase';
import { generateSalt, hashPasswordWithSalt, verifyPassword } from './auth';

// -----------------------------------------------------------------------------
// DATABASE CONFIGURATION & ISOLATION SAFETY
// -----------------------------------------------------------------------------
export class DatabaseConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseConfigurationError';
  }
}

export interface AdminCredentialsRecord {
  username: string;
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

interface DatabaseState {
  products: Product[];
  categories: ProductCategory[];
  manufacturers: Manufacturer[];
  certifications: Certification[];
  stats: CompanyStat[];
  corporateProfile: CorporateProfile;
  enquiries: Enquiry[];
  settings: SiteSettings;
  adminCredentials?: AdminCredentialsRecord;
}

const globalForDb = globalThis as unknown as {
  __junoDatabaseState?: DatabaseState;
};

/**
 * Validates database configuration according to environment safety rules.
 * - In PRODUCTION: Supabase/PostgreSQL is strictly required. Missing configuration throws a fatal error.
 * - In DEVELOPMENT: If Supabase is unconfigured, requires explicit ENABLE_DEV_MOCK_MODE=true.
 */
export function assertDatabaseConfigured(): void {
  const isProd = process.env.NODE_ENV === 'production';
  const configured = isSupabaseConfigured();

  if (isProd && !configured) {
    throw new DatabaseConfigurationError(
      'FATAL: PostgreSQL/Supabase database configuration missing in PRODUCTION. ' +
      'Production requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be configured. ' +
      'In-memory fallback is strictly forbidden in production.'
    );
  }

  if (!configured) {
    const isDevMockEnabled = process.env.ENABLE_DEV_MOCK_MODE === 'true' || process.env.ENABLE_DEV_MOCK_MODE === '1';
    if (!isDevMockEnabled) {
      throw new DatabaseConfigurationError(
        'Database Configuration Error: PostgreSQL/Supabase credentials are not configured in environment. ' +
        'To connect your production database, set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. ' +
        'For non-persistent isolated local development testing, set ENABLE_DEV_MOCK_MODE=true.'
      );
    }
  }
}

function getLocalDb(): DatabaseState {
  assertDatabaseConfigured();

  if (process.env.NODE_ENV === 'production') {
    throw new DatabaseConfigurationError(
      'FATAL: In-memory database access attempted in PRODUCTION. Production operations must strictly use PostgreSQL/Supabase.'
    );
  }

  if (!globalForDb.__junoDatabaseState) {
    console.warn(
      '[DEV ONLY WARNING] Using transient in-memory test fixtures (ENABLE_DEV_MOCK_MODE=true). ' +
      'Data will NOT survive server restart and is NOT permanent storage. This mode CANNOT activate in production.'
    );
    globalForDb.__junoDatabaseState = {
      products: [...initialProducts],
      categories: [...initialProductCategories],
      manufacturers: [...initialManufacturers],
      certifications: [...initialCertifications],
      stats: [...initialCompanyStats],
      corporateProfile: { ...initialCorporateProfile },
      enquiries: [...initialEnquiries],
      settings: { ...initialSiteSettings }
    };
  }
  return globalForDb.__junoDatabaseState;
}

// -----------------------------------------------------------------------------
// ROW MAPPERS (PostgreSQL snake_case <-> TypeScript camelCase)
// -----------------------------------------------------------------------------
function mapProductFromRow(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    genericName: row.generic_name || '',
    composition: row.composition || '',
    dosageForm: row.dosage_form || 'Tablets',
    strength: row.strength || '',
    therapeuticCategory: row.therapeutic_category || 'General Therapeutics',
    packSize: row.pack_size || '',
    manufacturer: row.manufacturer || 'Verified cGMP Manufacturing Partner',
    description: row.description || '',
    indications: row.indications || '',
    storageInstructions: row.storage_instructions || 'Store in a cool, dry place.',
    image: row.image || '',
    documentUrl: row.document_url || '',
    isFeatured: !!row.is_featured,
    status: row.status || 'published',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

function mapProductToRow(p: Partial<Product>): Record<string, any> {
  const row: Record<string, any> = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.name !== undefined) row.name = p.name;
  if (p.genericName !== undefined) row.generic_name = p.genericName;
  if (p.composition !== undefined) row.composition = p.composition;
  if (p.dosageForm !== undefined) row.dosage_form = p.dosageForm;
  if (p.strength !== undefined) row.strength = p.strength;
  if (p.therapeuticCategory !== undefined) row.therapeutic_category = p.therapeuticCategory;
  if (p.packSize !== undefined) row.pack_size = p.packSize;
  if (p.manufacturer !== undefined) row.manufacturer = p.manufacturer;
  if (p.description !== undefined) row.description = p.description;
  if (p.indications !== undefined) row.indications = p.indications;
  if (p.storageInstructions !== undefined) row.storage_instructions = p.storageInstructions;
  if (p.image !== undefined) row.image = p.image;
  if (p.documentUrl !== undefined) row.document_url = p.documentUrl;
  if (p.isFeatured !== undefined) row.is_featured = p.isFeatured;
  if (p.status !== undefined) row.status = p.status;
  row.updated_at = new Date().toISOString();
  return row;
}

function mapManufacturerFromRow(row: any): Manufacturer {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    state: row.state,
    country: row.country || 'India',
    facilityImage: row.facility_image,
    capabilities: Array.isArray(row.capabilities) ? row.capabilities : [],
    dosageForms: Array.isArray(row.dosage_forms) ? row.dosage_forms : [],
    certifications: Array.isArray(row.certifications) ? row.certifications : [],
    qualitySystems: Array.isArray(row.quality_systems) ? row.quality_systems : [],
    website: row.website,
    status: row.status || 'verified',
    description: row.description || '',
    createdAt: row.created_at || new Date().toISOString()
  };
}

function mapCertificationFromRow(row: any): Certification {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    issuingAuthority: row.issuing_authority,
    certificateNumber: row.certificate_number,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    scope: row.scope,
    documentUrl: row.document_url,
    status: row.status || 'active',
    verified: row.verified !== false,
    createdAt: row.created_at || new Date().toISOString()
  };
}

function mapEnquiryFromRow(row: any): Enquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company || '',
    subject: row.subject,
    category: row.category,
    message: row.message,
    status: row.status || 'new',
    notes: row.notes || '',
    createdAt: row.created_at || new Date().toISOString()
  };
}

// -----------------------------------------------------------------------------
// PRODUCTS (Scalable Pagination, Search & PostgreSQL Index Integration)
// -----------------------------------------------------------------------------
export interface GetProductsOptions {
  category?: string;
  search?: string;
  dosageForm?: string;
  featuredOnly?: boolean;
  includeDrafts?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'featured' | 'name-asc' | 'name-desc' | 'newest';
}

export interface PaginatedProductsResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export async function getProducts(options?: GetProductsOptions): Promise<Product[]> {
  const result = await getProductsPaginated(options);
  return result.products;
}

export async function getProductsPaginated(options?: GetProductsOptions): Promise<PaginatedProductsResult> {
  const page = Math.max(1, options?.page || 1);
  const limit = options?.limit ? Math.max(1, Math.min(100, options.limit)) : 100;
  const offset = (page - 1) * limit;

  // 1. SUPABASE / POSTGRESQL (PRIMARY PRODUCTION ENGINE)
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        let query = supabase
          .from('products')
          .select('*', { count: 'exact' })
          .eq('is_deleted', false);

        if (!options?.includeDrafts) {
          query = query.eq('status', 'published');
        }

        if (options?.featuredOnly) {
          query = query.eq('is_featured', true);
        }

        if (options?.dosageForm && options.dosageForm.toLowerCase() !== 'all') {
          query = query.ilike('dosage_form', options.dosageForm);
        }

        if (options?.category && options.category.toLowerCase() !== 'all') {
          query = query.ilike('dosage_form', options.category);
        }

        if (options?.search && options.search.trim()) {
          const q = options.search.trim();
          query = query.or(
            `name.ilike.%${q}%,generic_name.ilike.%${q}%,composition.ilike.%${q}%,therapeutic_category.ilike.%${q}%`
          );
        }

        // Sorting
        if (options?.sortBy === 'name-asc') {
          query = query.order('name', { ascending: true });
        } else if (options?.sortBy === 'name-desc') {
          query = query.order('name', { ascending: false });
        } else if (options?.sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else {
          // Default: featured first, then newest
          query = query
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false });
        }

        // Pagination range
        query = query.range(offset, offset + limit - 1);

        const { data, count, error } = await query;

        if (!error && data) {
          const total = count || 0;
          const totalPages = Math.ceil(total / limit) || 1;
          return {
            products: data.map(mapProductFromRow),
            total,
            page,
            limit,
            totalPages,
            hasMore: page < totalPages
          };
        }
      } catch (err) {
        console.error('Supabase getProducts error:', err);
      }
    }
  }

  // 2. LOCAL DEV FALLBACK
  const db = getLocalDb();
  let items = db.products.filter(p => (p as any).isDeleted !== true);

  if (!options?.includeDrafts) {
    items = items.filter(p => p.status === 'published');
  }

  if (options?.featuredOnly) {
    items = items.filter(p => p.isFeatured);
  }

  if (options?.dosageForm && options.dosageForm.toLowerCase() !== 'all') {
    items = items.filter(
      p => p.dosageForm.toLowerCase() === options.dosageForm?.toLowerCase()
    );
  }

  if (options?.category && options.category.toLowerCase() !== 'all') {
    items = items.filter(
      p => p.dosageForm.toLowerCase() === options.category?.toLowerCase()
    );
  }

  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    items = items.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.genericName.toLowerCase().includes(q) ||
        p.composition.toLowerCase().includes(q) ||
        p.therapeuticCategory.toLowerCase().includes(q)
    );
  }

  if (options?.sortBy === 'name-asc') {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (options?.sortBy === 'name-desc') {
    items.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  const total = items.length;
  const paginatedItems = items.slice(offset, offset + limit);
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    products: paginatedItems,
    total,
    page,
    limit,
    totalPages,
    hasMore: page < totalPages
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_deleted', false)
        .maybeSingle();

      if (!error && data) {
        return mapProductFromRow(data);
      }
    }
  }

  const db = getLocalDb();
  const found = db.products.find(p => p.slug === slug && (p as any).isDeleted !== true);
  return found || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return mapProductFromRow(data);
      }
    }
  }

  const db = getLocalDb();
  const found = db.products.find(p => p.id === id);
  return found || null;
}

export async function createProduct(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const row = mapProductToRow(newProduct);
      row.id = newProduct.id;
      row.created_at = newProduct.createdAt;
      row.is_deleted = false;

      const { data, error } = await supabase
        .from('products')
        .insert(row)
        .select()
        .single();

      if (!error && data) {
        return mapProductFromRow(data);
      }
    }
  }

  const db = getLocalDb();
  db.products.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const row = mapProductToRow(updates);
      const { data, error } = await supabase
        .from('products')
        .update(row)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return mapProductFromRow(data);
      }
    }
  }

  const db = getLocalDb();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return db.products[index];
}

export async function deleteProduct(id: string, permanent: boolean = false): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      if (permanent) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        return !error;
      } else {
        // Safe Archival / Soft-delete
        const { error } = await supabase
          .from('products')
          .update({ is_deleted: true, updated_at: new Date().toISOString() })
          .eq('id', id);
        return !error;
      }
    }
  }

  const db = getLocalDb();
  if (permanent) {
    const initialLen = db.products.length;
    db.products = db.products.filter(p => p.id !== id);
    return db.products.length < initialLen;
  } else {
    const p = db.products.find(item => item.id === id);
    if (!p) return false;
    (p as any).isDeleted = true;
    p.updatedAt = new Date().toISOString();
    return true;
  }
}

export async function restoreProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from('products')
        .update({ is_deleted: false, updated_at: new Date().toISOString() })
        .eq('id', id);
      return !error;
    }
  }

  const db = getLocalDb();
  const p = db.products.find(item => item.id === id);
  if (!p) return false;
  (p as any).isDeleted = false;
  p.updatedAt = new Date().toISOString();
  return true;
}

export async function getArchivedProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_deleted', true)
        .order('updated_at', { ascending: false });
      if (!error && data) {
        return data.map(mapProductFromRow);
      }
    }
  }

  const db = getLocalDb();
  return db.products.filter(p => (p as any).isDeleted === true);
}

// -----------------------------------------------------------------------------
// CATEGORIES
// -----------------------------------------------------------------------------
export async function getCategories(): Promise<ProductCategory[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: cats } = await supabase
        .from('product_categories')
        .select('*')
        .order('display_order', { ascending: true });

      const { data: prods } = await supabase
        .from('products')
        .select('dosage_form')
        .eq('status', 'published')
        .eq('is_deleted', false);

      if (cats) {
        const productList = prods || [];
        return cats.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          count:
            cat.slug === 'all'
              ? productList.length
              : productList.filter(
                  p => (p.dosage_form || '').toLowerCase() === cat.slug.toLowerCase()
                ).length
        }));
      }
    }
  }

  const db = getLocalDb();
  return db.categories.map(cat => ({
    ...cat,
    count:
      cat.slug === 'all'
        ? db.products.filter(p => p.status === 'published').length
        : db.products.filter(
            p =>
              p.status === 'published' &&
              p.dosageForm.toLowerCase() === cat.slug.toLowerCase()
          ).length
  }));
}

// -----------------------------------------------------------------------------
// MANUFACTURERS
// -----------------------------------------------------------------------------
export async function getManufacturers(): Promise<Manufacturer[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(mapManufacturerFromRow);
      }
    }
  }

  const db = getLocalDb();
  return [...db.manufacturers];
}

export async function getManufacturerById(id: string): Promise<Manufacturer | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return mapManufacturerFromRow(data);
      }
    }
  }

  const db = getLocalDb();
  const found = db.manufacturers.find(m => m.id === id);
  return found || null;
}

export async function createManufacturer(
  data: Omit<Manufacturer, 'id' | 'createdAt'>
): Promise<Manufacturer> {
  const newM: Manufacturer = {
    ...data,
    id: `mfg-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: inserted, error } = await supabase
        .from('manufacturers')
        .insert({
          id: newM.id,
          name: newM.name,
          location: newM.location,
          state: newM.state,
          country: newM.country || 'India',
          facility_image: newM.facilityImage,
          capabilities: newM.capabilities,
          dosage_forms: newM.dosageForms,
          certifications: newM.certifications,
          quality_systems: newM.qualitySystems,
          website: newM.website,
          status: newM.status,
          description: newM.description,
          is_deleted: false,
          created_at: newM.createdAt
        })
        .select()
        .single();

      if (!error && inserted) {
        return mapManufacturerFromRow(inserted);
      }
    }
  }

  const db = getLocalDb();
  db.manufacturers.unshift(newM);
  return newM;
}

export async function updateManufacturer(
  id: string,
  updates: Partial<Manufacturer>
): Promise<Manufacturer | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const row: Record<string, any> = {};
      if (updates.name !== undefined) row.name = updates.name;
      if (updates.location !== undefined) row.location = updates.location;
      if (updates.state !== undefined) row.state = updates.state;
      if (updates.country !== undefined) row.country = updates.country;
      if (updates.facilityImage !== undefined) row.facility_image = updates.facilityImage;
      if (updates.capabilities !== undefined) row.capabilities = updates.capabilities;
      if (updates.dosageForms !== undefined) row.dosage_forms = updates.dosageForms;
      if (updates.certifications !== undefined) row.certifications = updates.certifications;
      if (updates.qualitySystems !== undefined) row.quality_systems = updates.qualitySystems;
      if (updates.website !== undefined) row.website = updates.website;
      if (updates.status !== undefined) row.status = updates.status;
      if (updates.description !== undefined) row.description = updates.description;
      row.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('manufacturers')
        .update(row)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return mapManufacturerFromRow(data);
      }
    }
  }

  const db = getLocalDb();
  const idx = db.manufacturers.findIndex(m => m.id === id);
  if (idx === -1) return null;
  db.manufacturers[idx] = { ...db.manufacturers[idx], ...updates };
  return db.manufacturers[idx];
}

export async function deleteManufacturer(id: string, permanent: boolean = false): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      if (permanent) {
        const { error } = await supabase.from('manufacturers').delete().eq('id', id);
        return !error;
      } else {
        const { error } = await supabase
          .from('manufacturers')
          .update({ is_deleted: true, updated_at: new Date().toISOString() })
          .eq('id', id);
        return !error;
      }
    }
  }

  const db = getLocalDb();
  if (permanent) {
    const len = db.manufacturers.length;
    db.manufacturers = db.manufacturers.filter(m => m.id !== id);
    return db.manufacturers.length < len;
  } else {
    const m = db.manufacturers.find(item => item.id === id);
    if (!m) return false;
    (m as any).isDeleted = true;
    return true;
  }
}

export async function restoreManufacturer(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from('manufacturers')
        .update({ is_deleted: false, updated_at: new Date().toISOString() })
        .eq('id', id);
      return !error;
    }
  }

  const db = getLocalDb();
  const m = db.manufacturers.find(item => item.id === id);
  if (!m) return false;
  (m as any).isDeleted = false;
  return true;
}

export async function getArchivedManufacturers(): Promise<Manufacturer[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('*')
        .eq('is_deleted', true)
        .order('updated_at', { ascending: false });
      if (!error && data) {
        return data.map(mapManufacturerFromRow);
      }
    }
  }

  const db = getLocalDb();
  return db.manufacturers.filter(m => (m as any).isDeleted === true);
}

// -----------------------------------------------------------------------------
// CERTIFICATIONS
// -----------------------------------------------------------------------------
export async function getCertifications(): Promise<Certification[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(mapCertificationFromRow);
      }
    }
  }

  const db = getLocalDb();
  return [...db.certifications];
}

export async function getCertificationById(id: string): Promise<Certification | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return mapCertificationFromRow(data);
      }
    }
  }

  const db = getLocalDb();
  const found = db.certifications.find(c => c.id === id);
  return found || null;
}

export async function createCertification(
  data: Omit<Certification, 'id' | 'createdAt'>
): Promise<Certification> {
  const newCert: Certification = {
    ...data,
    id: `cert-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: inserted, error } = await supabase
        .from('certifications')
        .insert({
          id: newCert.id,
          name: newCert.name,
          type: newCert.type,
          issuing_authority: newCert.issuingAuthority,
          certificate_number: newCert.certificateNumber,
          issue_date: newCert.issueDate,
          expiry_date: newCert.expiryDate,
          scope: newCert.scope,
          document_url: newCert.documentUrl,
          status: newCert.status,
          verified: newCert.verified,
          is_deleted: false,
          created_at: newCert.createdAt
        })
        .select()
        .single();

      if (!error && inserted) {
        return mapCertificationFromRow(inserted);
      }
    }
  }

  const db = getLocalDb();
  db.certifications.unshift(newCert);
  return newCert;
}

export async function updateCertification(
  id: string,
  updates: Partial<Certification>
): Promise<Certification | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const row: Record<string, any> = {};
      if (updates.name !== undefined) row.name = updates.name;
      if (updates.type !== undefined) row.type = updates.type;
      if (updates.issuingAuthority !== undefined) row.issuing_authority = updates.issuingAuthority;
      if (updates.certificateNumber !== undefined) row.certificate_number = updates.certificateNumber;
      if (updates.issueDate !== undefined) row.issue_date = updates.issueDate;
      if (updates.expiryDate !== undefined) row.expiry_date = updates.expiryDate;
      if (updates.scope !== undefined) row.scope = updates.scope;
      if (updates.documentUrl !== undefined) row.document_url = updates.documentUrl;
      if (updates.status !== undefined) row.status = updates.status;
      if (updates.verified !== undefined) row.verified = updates.verified;
      row.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('certifications')
        .update(row)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return mapCertificationFromRow(data);
      }
    }
  }

  const db = getLocalDb();
  const idx = db.certifications.findIndex(c => c.id === id);
  if (idx === -1) return null;
  db.certifications[idx] = { ...db.certifications[idx], ...updates };
  return db.certifications[idx];
}

export async function deleteCertification(id: string, permanent: boolean = false): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      if (permanent) {
        const { error } = await supabase.from('certifications').delete().eq('id', id);
        return !error;
      } else {
        const { error } = await supabase
          .from('certifications')
          .update({ is_deleted: true, updated_at: new Date().toISOString() })
          .eq('id', id);
        return !error;
      }
    }
  }

  const db = getLocalDb();
  if (permanent) {
    const len = db.certifications.length;
    db.certifications = db.certifications.filter(c => c.id !== id);
    return db.certifications.length < len;
  } else {
    const c = db.certifications.find(item => item.id === id);
    if (!c) return false;
    (c as any).isDeleted = true;
    return true;
  }
}

export async function restoreCertification(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from('certifications')
        .update({ is_deleted: false, updated_at: new Date().toISOString() })
        .eq('id', id);
      return !error;
    }
  }

  const db = getLocalDb();
  const c = db.certifications.find(item => item.id === id);
  if (!c) return false;
  (c as any).isDeleted = false;
  return true;
}

export async function getArchivedCertifications(): Promise<Certification[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('is_deleted', true)
        .order('updated_at', { ascending: false });
      if (!error && data) {
        return data.map(mapCertificationFromRow);
      }
    }
  }

  const db = getLocalDb();
  return db.certifications.filter(c => (c as any).isDeleted === true);
}

// -----------------------------------------------------------------------------
// STATS
// -----------------------------------------------------------------------------
export async function getCompanyStats(): Promise<CompanyStat[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('company_stats')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        return data.map(row => ({
          id: row.id,
          key: row.key,
          label: row.label,
          value: row.value,
          numericValue: row.numeric_value ? Number(row.numeric_value) : undefined,
          suffix: row.suffix || '',
          isVerified: row.is_verified,
          notes: row.notes
        }));
      }
    }
  }

  const db = getLocalDb();
  return [...db.stats];
}

export async function updateCompanyStat(
  id: string,
  updates: Partial<CompanyStat>
): Promise<CompanyStat | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const row: Record<string, any> = {};
      if (updates.value !== undefined) row.value = updates.value;
      if (updates.numericValue !== undefined) row.numeric_value = updates.numericValue;
      if (updates.label !== undefined) row.label = updates.label;
      if (updates.suffix !== undefined) row.suffix = updates.suffix;
      if (updates.isVerified !== undefined) row.is_verified = updates.isVerified;
      if (updates.notes !== undefined) row.notes = updates.notes;
      row.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('company_stats')
        .update(row)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          key: data.key,
          label: data.label,
          value: data.value,
          numericValue: data.numeric_value ? Number(data.numeric_value) : undefined,
          suffix: data.suffix,
          isVerified: data.is_verified,
          notes: data.notes
        };
      }
    }
  }

  const db = getLocalDb();
  const idx = db.stats.findIndex(s => s.id === id);
  if (idx === -1) return null;
  db.stats[idx] = { ...db.stats[idx], ...updates };
  return db.stats[idx];
}

// -----------------------------------------------------------------------------
// CORPORATE PROFILE
// -----------------------------------------------------------------------------
export async function getCorporateProfile(): Promise<CorporateProfile> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('corporate_profile')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data) {
        return {
          companyName: data.company_name,
          cin: data.cin,
          registrationNumber: data.registration_number,
          roc: data.roc,
          incorporationDate: data.incorporation_date,
          companyCategory: data.company_category,
          companySubCategory: data.company_sub_category,
          companyClass: data.company_class,
          officialPhone: data.official_phone,
          officialEmail: data.official_email,
          domain: data.domain,
          registeredOffice: data.registered_office,
          aboutBrief: data.about_brief,
          aboutFull: data.about_full,
          vision: data.vision,
          mission: data.mission
        };
      }
    }
  }

  const db = getLocalDb();
  return { ...db.corporateProfile };
}

export async function updateCorporateProfile(
  updates: Partial<CorporateProfile>
): Promise<CorporateProfile> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const row: Record<string, any> = {};
      if (updates.companyName !== undefined) row.company_name = updates.companyName;
      if (updates.cin !== undefined) row.cin = updates.cin;
      if (updates.registrationNumber !== undefined) row.registration_number = updates.registrationNumber;
      if (updates.roc !== undefined) row.roc = updates.roc;
      if (updates.incorporationDate !== undefined) row.incorporation_date = updates.incorporationDate;
      if (updates.officialPhone !== undefined) row.official_phone = updates.officialPhone;
      if (updates.officialEmail !== undefined) row.official_email = updates.officialEmail;
      if (updates.domain !== undefined) row.domain = updates.domain;
      if (updates.registeredOffice !== undefined) row.registered_office = updates.registeredOffice;
      if (updates.aboutBrief !== undefined) row.about_brief = updates.aboutBrief;
      if (updates.aboutFull !== undefined) row.about_full = updates.aboutFull;
      if (updates.vision !== undefined) row.vision = updates.vision;
      if (updates.mission !== undefined) row.mission = updates.mission;
      row.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('corporate_profile')
        .upsert({ id: 1, ...row })
        .select()
        .maybeSingle();

      if (!error && data) {
        return getCorporateProfile();
      }
    }
  }

  const db = getLocalDb();
  db.corporateProfile = { ...db.corporateProfile, ...updates };
  return db.corporateProfile;
}

// -----------------------------------------------------------------------------
// ENQUIRIES (Commercial & Inbound Leads)
// -----------------------------------------------------------------------------
export async function getEnquiries(): Promise<Enquiry[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(mapEnquiryFromRow);
      }
    }
  }

  const db = getLocalDb();
  return [...db.enquiries];
}

export async function createEnquiry(
  data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>
): Promise<Enquiry> {
  const newEnq: Enquiry = {
    ...data,
    id: `enq-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: inserted, error } = await supabase
        .from('enquiries')
        .insert({
          id: newEnq.id,
          name: newEnq.name,
          email: newEnq.email,
          phone: newEnq.phone,
          company: newEnq.company || '',
          subject: newEnq.subject,
          category: newEnq.category,
          message: newEnq.message,
          status: 'new',
          is_deleted: false,
          created_at: newEnq.createdAt
        })
        .select()
        .single();

      if (!error && inserted) {
        return mapEnquiryFromRow(inserted);
      }
    }
  }

  const db = getLocalDb();
  db.enquiries.unshift(newEnq);
  return newEnq;
}

export async function updateEnquiryStatus(
  id: string,
  status: Enquiry['status'],
  notes?: string
): Promise<Enquiry | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const row: Record<string, any> = { status, updated_at: new Date().toISOString() };
      if (notes !== undefined) row.notes = notes;

      const { data, error } = await supabase
        .from('enquiries')
        .update(row)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return mapEnquiryFromRow(data);
      }
    }
  }

  const db = getLocalDb();
  const idx = db.enquiries.findIndex(e => e.id === id);
  if (idx === -1) return null;
  db.enquiries[idx].status = status;
  if (notes !== undefined) {
    db.enquiries[idx].notes = notes;
  }
  return db.enquiries[idx];
}

export async function deleteEnquiry(id: string, permanent: boolean = false): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      if (permanent) {
        const { error } = await supabase.from('enquiries').delete().eq('id', id);
        return !error;
      } else {
        const { error } = await supabase
          .from('enquiries')
          .update({ is_deleted: true, updated_at: new Date().toISOString() })
          .eq('id', id);
        return !error;
      }
    }
  }

  const db = getLocalDb();
  if (permanent) {
    const len = db.enquiries.length;
    db.enquiries = db.enquiries.filter(e => e.id !== id);
    return db.enquiries.length < len;
  } else {
    const e = db.enquiries.find(item => item.id === id);
    if (!e) return false;
    (e as any).isDeleted = true;
    return true;
  }
}

export async function restoreEnquiry(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from('enquiries')
        .update({ is_deleted: false, updated_at: new Date().toISOString() })
        .eq('id', id);
      return !error;
    }
  }

  const db = getLocalDb();
  const e = db.enquiries.find(item => item.id === id);
  if (!e) return false;
  (e as any).isDeleted = false;
  return true;
}

export async function getArchivedEnquiries(): Promise<Enquiry[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .eq('is_deleted', true)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(mapEnquiryFromRow);
      }
    }
  }

  const db = getLocalDb();
  return db.enquiries.filter(e => (e as any).isDeleted === true);
}

// -----------------------------------------------------------------------------
// SITE SETTINGS
// -----------------------------------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data) {
        return {
          siteName: data.site_name,
          siteTagline: data.site_tagline,
          primaryPhone: data.primary_phone,
          primaryEmail: data.primary_email,
          address: data.address,
          cin: data.cin,
          bannerNotice: data.banner_notice,
          showBanner: data.show_banner,
          maintenanceMode: data.maintenance_mode,
          enablePublicEnquiries: data.enable_public_enquiries
        };
      }
    }
  }

  const db = getLocalDb();
  return { ...db.settings };
}

export async function updateSiteSettings(
  updates: Partial<SiteSettings>
): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const row: Record<string, any> = {};
      if (updates.siteName !== undefined) row.site_name = updates.siteName;
      if (updates.siteTagline !== undefined) row.site_tagline = updates.siteTagline;
      if (updates.primaryPhone !== undefined) row.primary_phone = updates.primaryPhone;
      if (updates.primaryEmail !== undefined) row.primary_email = updates.primaryEmail;
      if (updates.address !== undefined) row.address = updates.address;
      if (updates.cin !== undefined) row.cin = updates.cin;
      if (updates.bannerNotice !== undefined) row.banner_notice = updates.bannerNotice;
      if (updates.showBanner !== undefined) row.show_banner = updates.showBanner;
      if (updates.maintenanceMode !== undefined) row.maintenance_mode = updates.maintenanceMode;
      if (updates.enablePublicEnquiries !== undefined) row.enable_public_enquiries = updates.enablePublicEnquiries;
      row.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ id: 1, ...row })
        .select()
        .maybeSingle();

      if (!error && data) {
        return getSiteSettings();
      }
    }
  }

  const db = getLocalDb();
  db.settings = { ...db.settings, ...updates };
  return db.settings;
}

// -----------------------------------------------------------------------------
// ADMIN CREDENTIALS & OWNER SECURITY CONTROL
// -----------------------------------------------------------------------------
export async function getAdminCredentials(): Promise<AdminCredentialsRecord | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('admin_credentials')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data && data.password_hash && data.salt) {
        return {
          username: data.username || 'admin',
          passwordHash: data.password_hash,
          salt: data.salt,
          updatedAt: data.updated_at
        };
      }
    }
  }

  const db = getLocalDb();
  if (db.adminCredentials) {
    return db.adminCredentials;
  }
  return null;
}

export async function verifyAdminPassword(candidatePassword: string): Promise<boolean> {
  if (!candidatePassword) return false;
  
  const creds = await getAdminCredentials();
  if (creds && creds.passwordHash) {
    return await verifyPassword(candidatePassword, creds.passwordHash, creds.salt);
  }

  // If no credentials in database yet, check process.env.ADMIN_PASSWORD
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envPassword) {
    return candidatePassword === envPassword;
  }

  return false;
}

export async function setAdminPassword(newPassword: string): Promise<boolean> {
  const { hash: passwordHash, salt } = await hashPasswordWithSalt(newPassword);
  const updatedAt = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from('admin_credentials')
        .upsert({
          id: 1,
          username: 'admin',
          password_hash: passwordHash,
          salt: salt,
          updated_at: updatedAt
        });
      if (error) {
        console.error('Supabase setAdminPassword error:', error);
      }
    }
  }

  const db = getLocalDb();
  db.adminCredentials = {
    username: 'admin',
    passwordHash,
    salt,
    updatedAt
  };
  return true;
}


