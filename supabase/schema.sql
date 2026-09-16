-- =============================================================================
-- JUNO HEALTHCARE PRIVATE LIMITED (CIN: U46497MR2026PTC474137)
-- ENTERPRISE POSTGRESQL & SUPABASE PRODUCTION DATABASE SCHEMA
-- Designed for 100,000+ Record Scalability, B-Tree & Full-Text Search Indexing
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- -----------------------------------------------------------------------------
-- 1. PRODUCTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    composition TEXT NOT NULL,
    dosage_form TEXT NOT NULL,
    strength TEXT NOT NULL,
    therapeutic_category TEXT NOT NULL DEFAULT 'General Therapeutics',
    pack_size TEXT NOT NULL DEFAULT 'Standard Packaging',
    manufacturer TEXT DEFAULT 'Verified cGMP Manufacturing Partner',
    description TEXT DEFAULT '',
    indications TEXT DEFAULT '',
    storage_instructions TEXT DEFAULT 'Store in a cool, dry place protected from light.',
    image TEXT DEFAULT '',
    document_url TEXT DEFAULT '',
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'published', -- 'published' | 'draft'
    is_deleted BOOLEAN DEFAULT FALSE,         -- Safe Archival / Soft-Delete
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B-Tree Performance Indexes for Filtering & Pagination
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_products_status_featured ON products(status, is_featured, is_deleted);
CREATE INDEX IF NOT EXISTS idx_products_dosage ON products(dosage_form, is_deleted);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC) WHERE is_deleted = FALSE;

-- GIN Trigram Index for Sub-Millisecond Search across 100,000+ Formulations
CREATE INDEX IF NOT EXISTS idx_products_search_trgm ON products USING GIN (
    (name || ' ' || generic_name || ' ' || composition || ' ' || therapeutic_category) gin_trgm_ops
);

-- -----------------------------------------------------------------------------
-- 2. PRODUCT CATEGORIES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. MANUFACTURERS TABLE (cGMP Partner Network)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS manufacturers (
    id TEXT PRIMARY KEY DEFAULT ('mfg-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    state TEXT,
    country TEXT DEFAULT 'India',
    facility_image TEXT,
    capabilities JSONB DEFAULT '[]'::jsonb,
    dosage_forms JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    quality_systems JSONB DEFAULT '[]'::jsonb,
    website TEXT,
    status TEXT NOT NULL DEFAULT 'verified', -- 'verified' | 'pending_audit' | 'partner'
    description TEXT DEFAULT '',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manufacturers_status ON manufacturers(status, is_deleted);

-- -----------------------------------------------------------------------------
-- 4. CERTIFICATIONS & REGULATORY AUDIT RECORDS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certifications (
    id TEXT PRIMARY KEY DEFAULT ('cert-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'ISO' | 'GMP' | 'WHO-GMP' | 'GLP' | 'MCA' | 'Other'
    issuing_authority TEXT NOT NULL,
    certificate_number TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    scope TEXT NOT NULL,
    document_url TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'pending_renewal' | 'verification_in_progress'
    verified BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certifications_type ON certifications(type, is_deleted);

-- -----------------------------------------------------------------------------
-- 5. COMPANY STATS (Dynamic Platform Metrics)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_stats (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    numeric_value NUMERIC,
    suffix TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    notes TEXT,
    display_order INT DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. CORPORATE PROFILE (MCA Filing Details)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS corporate_profile (
    id INT PRIMARY KEY DEFAULT 1,
    company_name TEXT NOT NULL,
    cin TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    roc TEXT NOT NULL,
    incorporation_date TEXT NOT NULL,
    company_category TEXT NOT NULL,
    company_sub_category TEXT NOT NULL,
    company_class TEXT NOT NULL,
    official_phone TEXT NOT NULL,
    official_email TEXT NOT NULL,
    domain TEXT NOT NULL,
    registered_office TEXT NOT NULL,
    about_brief TEXT NOT NULL,
    about_full TEXT NOT NULL,
    vision TEXT NOT NULL,
    mission TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT single_profile_row CHECK (id = 1)
);

-- -----------------------------------------------------------------------------
-- 7. INBOUND ENQUIRIES & COMMERCIAL LEADS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY DEFAULT ('enq-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT DEFAULT '',
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new', -- 'new' | 'read' | 'contacted' | 'closed'
    notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC) WHERE is_deleted = FALSE;

-- -----------------------------------------------------------------------------
-- 8. SITE SETTINGS & CONFIGURATION
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_name TEXT NOT NULL,
    site_tagline TEXT NOT NULL,
    primary_phone TEXT NOT NULL,
    primary_email TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL,
    cin TEXT NOT NULL,
    banner_notice TEXT,
    show_banner BOOLEAN DEFAULT FALSE,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    enable_public_enquiries BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT single_settings_row CHECK (id = 1)
);

-- -----------------------------------------------------------------------------
-- 9. ADMIN CREDENTIALS (Hashed Password & Dynamic Salt)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_credentials (
    id INT PRIMARY KEY DEFAULT 1,
    username TEXT NOT NULL DEFAULT 'admin',
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT single_admin_row CHECK (id = 1)
);

-- -----------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Public can read published products and public meta
DROP POLICY IF EXISTS "Public can view published products" ON products;
CREATE POLICY "Public can view published products" ON products
    FOR SELECT USING (status = 'published' AND is_deleted = FALSE);

DROP POLICY IF EXISTS "Public can view categories" ON product_categories;
CREATE POLICY "Public can view categories" ON product_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view manufacturers" ON manufacturers;
CREATE POLICY "Public can view manufacturers" ON manufacturers FOR SELECT USING (is_deleted = FALSE);

DROP POLICY IF EXISTS "Public can view certifications" ON certifications;
CREATE POLICY "Public can view certifications" ON certifications FOR SELECT USING (is_deleted = FALSE);

DROP POLICY IF EXISTS "Public can view stats" ON company_stats;
CREATE POLICY "Public can view stats" ON company_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view profile" ON corporate_profile;
CREATE POLICY "Public can view profile" ON corporate_profile FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view settings" ON site_settings;
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);

-- Public can submit new enquiries (INSERT only)
DROP POLICY IF EXISTS "Public can submit enquiries" ON enquiries;
CREATE POLICY "Public can submit enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Admin credentials strictly blocked from public selection
DROP POLICY IF EXISTS "Public cannot view admin credentials" ON admin_credentials;

-- Service Role (Next.js Backend) has Full Administrative Control over all tables
DROP POLICY IF EXISTS "Service role admin on products" ON products;
CREATE POLICY "Service role admin on products" ON products FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role admin on categories" ON product_categories;
CREATE POLICY "Service role admin on categories" ON product_categories FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role admin on manufacturers" ON manufacturers;
CREATE POLICY "Service role admin on manufacturers" ON manufacturers FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role admin on certifications" ON certifications;
CREATE POLICY "Service role admin on certifications" ON certifications FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role admin on company_stats" ON company_stats;
CREATE POLICY "Service role admin on company_stats" ON company_stats FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role admin on corporate_profile" ON corporate_profile;
CREATE POLICY "Service role admin on corporate_profile" ON corporate_profile FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role admin on enquiries" ON enquiries;
CREATE POLICY "Service role admin on enquiries" ON enquiries FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role admin on site_settings" ON site_settings;
CREATE POLICY "Service role admin on site_settings" ON site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role admin on admin_credentials" ON admin_credentials;
CREATE POLICY "Service role admin on admin_credentials" ON admin_credentials FOR ALL TO service_role USING (true) WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 11. SUPABASE STORAGE BUCKET (juno-media)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'juno-media',
    'juno-media',
    true,
    15728640, -- 15MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 15728640,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml', 'application/pdf'];

-- Storage bucket access policies
DROP POLICY IF EXISTS "Public Access to juno-media" ON storage.objects;
CREATE POLICY "Public Access to juno-media" ON storage.objects
    FOR SELECT USING (bucket_id = 'juno-media');

DROP POLICY IF EXISTS "Service Role Upload to juno-media" ON storage.objects;
CREATE POLICY "Service Role Upload to juno-media" ON storage.objects
    FOR ALL TO service_role USING (bucket_id = 'juno-media') WITH CHECK (bucket_id = 'juno-media');

-- -----------------------------------------------------------------------------
-- 12. INITIAL SEED DATA INSERTION (Verified JUNO Master Dataset)
-- -----------------------------------------------------------------------------
INSERT INTO corporate_profile (
    id, company_name, cin, registration_number, roc, incorporation_date,
    company_category, company_sub_category, company_class, official_phone,
    official_email, domain, registered_office, about_brief, about_full, vision, mission
) VALUES (
    1,
    'JUNO HEALTHCARE PRIVATE LIMITED',
    'U46497MR2026PTC474137',
    '474137',
    'ROC Mumbai II',
    '06/03/2026',
    'Company limited by shares',
    'Non-government company',
    'Private',
    '+91 9743094555',
    '',
    'junohealthcare.in',
    'Mumbai, Maharashtra, India',
    'Juno Healthcare Private Limited is a specialized pharmaceutical marketing company dedicated to delivering quality healthcare formulations through responsible, ethical, and high-standard partnerships.',
    'Incorporated under the Ministry of Corporate Affairs, Government of India, Juno Healthcare Private Limited (CIN: U46497MR2026PTC474137) is committed to advancing modern healthcare accessibility. Our core operational focus spans the systematic marketing, distribution, and clinical representation of high-precision pharmaceutical preparations. By collaborating with verified, compliant third-party manufacturing facilities, we ensure that every formulation adheres to exacting quality and safety benchmarks.',
    'To emerge as a trusted hallmark in pharmaceutical marketing and distribution, celebrated for unwavering quality consistency, clinical responsibility, and ethical healthcare leadership.',
    'To bridge healthcare demand with scientifically verified, responsibly marketed pharmaceutical solutions that empower healthcare providers, patients, and distribution partners across India.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO site_settings (
    id, site_name, site_tagline, primary_phone, primary_email, address, cin, show_banner, banner_notice, maintenance_mode, enable_public_enquiries
) VALUES (
    1,
    'JUNO HEALTHCARE PRIVATE LIMITED',
    'Advancing Healthcare Through Quality & Trust',
    '+91 9743094555',
    '',
    'Mumbai, Maharashtra, India',
    'U46497MR2026PTC474137',
    false,
    '',
    false,
    true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_categories (id, name, slug, description, icon, display_order) VALUES
('cat-all', 'All Formulations', 'all', 'Complete portfolio of verified therapeutic medicines', 'Sparkles', 0),
('cat-tablets', 'Tablets', 'tablets', 'Solid oral dosage forms with precision release profiles', 'Pill', 1),
('cat-capsules', 'Capsules', 'capsules', 'Gelatin & HPMC encapsulated formulations', 'Pill', 2),
('cat-injections', 'Injections', 'injections', 'Sterile liquid & lyophilized parenteral solutions', 'Droplet', 3),
('cat-syrups', 'Syrups', 'syrups', 'Pediatric & adult oral liquid suspensions and syrups', 'Droplet', 4),
('cat-ointments', 'Ointments', 'ointments', 'Topical dermal creams, gels, and ointments', 'Box', 5),
('cat-suspensions', 'Suspensions', 'suspensions', 'Precision-buffered oral suspensions', 'Box', 6),
('cat-drops', 'Drops', 'drops', 'Ophthalmic, otic, and pediatric oral drops', 'Droplet', 7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO company_stats (id, key, label, value, numeric_value, suffix, is_verified, notes, display_order) VALUES
('stat-1', 'incorporation', 'Incorporation Year', '2026', 2026, '', true, 'Incorporated on 06 March 2026 under ROC Mumbai II', 1),
('stat-2', 'portfolio', 'Core Portfolio', 'Active Line', null, '', true, 'Dynamic pharmaceutical product pipeline', 2),
('stat-3', 'mfg_network', 'Manufacturing Network', 'Audit-Verified', null, '', true, 'Partnering exclusively with verified third-party cGMP compliant facilities', 3),
('stat-4', 'compliance', 'Corporate Compliance', '100% MCA Verified', 100, '%', true, 'CIN: U46497MR2026PTC474137', 4)
ON CONFLICT (id) DO NOTHING;

