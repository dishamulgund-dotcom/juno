export type DosageForm = 
  | 'Tablets'
  | 'Capsules'
  | 'Syrups'
  | 'Injections'
  | 'Ointments'
  | 'Suspensions'
  | 'Drops'
  | 'Other';

export interface Product {
  id: string;
  slug: string;
  name: string;
  genericName: string;
  composition: string;
  dosageForm: DosageForm;
  strength: string;
  therapeuticCategory: string;
  packSize: string;
  manufacturer?: string;
  description: string;
  indications?: string;
  storageInstructions?: string;
  image?: string;
  documentUrl?: string;
  isFeatured: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  count?: number;
}

export interface Manufacturer {
  id: string;
  name: string;
  location: string;
  state?: string;
  country: string;
  facilityImage?: string;
  capabilities: string[];
  dosageForms: DosageForm[];
  certifications: string[];
  qualitySystems: string[];
  website?: string;
  status: 'verified' | 'pending_audit' | 'partner';
  description: string;
  createdAt: string;
}

export interface Certification {
  id: string;
  name: string;
  type: 'ISO' | 'GMP' | 'WHO-GMP' | 'GLP' | 'MCA' | 'Other';
  issuingAuthority: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  scope: string;
  documentUrl?: string;
  status: 'active' | 'pending_renewal' | 'verification_in_progress';
  verified: boolean;
  createdAt: string;
}

export interface CompanyStat {
  id: string;
  key: string;
  label: string;
  value: string;
  numericValue?: number;
  suffix?: string;
  isVerified: boolean;
  notes?: string;
}

export interface CorporateProfile {
  companyName: string;
  cin: string;
  registrationNumber: string;
  roc: string;
  incorporationDate: string;
  companyCategory: string;
  companySubCategory: string;
  companyClass: string;
  officialPhone: string;
  officialEmail: string;
  domain: string;
  registeredOffice: string;
  aboutBrief: string;
  aboutFull: string;
  vision: string;
  mission: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  category: 'General' | 'Product Inquiry' | 'Distribution Partnership' | 'Manufacturing Alliance' | 'Institutional Supply';
  message: string;
  status: 'new' | 'read' | 'contacted' | 'closed';
  createdAt: string;
  notes?: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  primaryPhone: string;
  primaryEmail: string;
  address: string;
  cin: string;
  bannerNotice?: string;
  showBanner: boolean;
  maintenanceMode: boolean;
  enablePublicEnquiries: boolean;
}
