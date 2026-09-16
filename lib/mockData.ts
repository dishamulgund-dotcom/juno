import { 
  CorporateProfile, 
  Product, 
  ProductCategory, 
  Manufacturer, 
  Certification, 
  CompanyStat, 
  SiteSettings,
  Enquiry 
} from '@/types';

export const initialCorporateProfile: CorporateProfile = {
  companyName: 'JUNO HEALTHCARE PRIVATE LIMITED',
  cin: 'U46497MR2026PTC474137',
  registrationNumber: '474137',
  roc: 'ROC Mumbai II',
  incorporationDate: '06/03/2026',
  companyCategory: 'Company limited by shares',
  companySubCategory: 'Non-government company',
  companyClass: 'Private',
  officialPhone: '+91 9743094555',
  officialEmail: '',
  domain: 'junohealthcare.in',
  registeredOffice: 'Mumbai, Maharashtra, India',
  aboutBrief: 'Juno Healthcare Private Limited is a specialized pharmaceutical marketing company dedicated to delivering quality healthcare formulations through responsible, ethical, and high-standard partnerships.',
  aboutFull: 'Incorporated under the Ministry of Corporate Affairs, Government of India, Juno Healthcare Private Limited (CIN: U46497MR2026PTC474137) is committed to advancing modern healthcare accessibility. Our core operational focus spans the systematic marketing, distribution, and clinical representation of high-precision pharmaceutical preparations. By collaborating with verified, compliant third-party manufacturing facilities, we ensure that every formulation adheres to exacting quality and safety benchmarks.',
  vision: 'To emerge as a trusted hallmark in pharmaceutical marketing and distribution, celebrated for unwavering quality consistency, clinical responsibility, and ethical healthcare leadership.',
  mission: 'To bridge healthcare demand with scientifically verified, responsibly marketed pharmaceutical solutions that empower healthcare providers, patients, and distribution partners across India.'
};

export const initialProductCategories: ProductCategory[] = [
  { id: 'cat-1', name: 'All Formulations', slug: 'all', count: 0 },
  { id: 'cat-2', name: 'Tablets', slug: 'tablets', description: 'Solid oral dosage forms formulated for controlled dissolution and bioavailability.', count: 0 },
  { id: 'cat-3', name: 'Capsules', slug: 'capsules', description: 'Hard and soft gelatin encapsulated formulations for optimal ingredient stability.', count: 0 },
  { id: 'cat-4', name: 'Syrups & Liquids', slug: 'syrups', description: 'Palatable, precisely measured pediatric and adult liquid oral solutions.', count: 0 },
  { id: 'cat-5', name: 'Injections', slug: 'injections', description: 'Sterile parenteral solutions manufactured under strict aseptic conditions.', count: 0 },
  { id: 'cat-6', name: 'Ointments & Topicals', slug: 'ointments', description: 'Dermatological and topical preparations with enhanced skin absorption kinetics.', count: 0 }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-001',
    slug: 'junoclav-625',
    name: 'JUNOCLAV 625',
    genericName: 'Amoxicillin and Potassium Clavulanate Tablets IP',
    composition: 'Amoxicillin Trihydrate IP eq. to Amoxicillin 500mg + Potassium Clavulanate Diluted IP eq. to Clavulanic Acid 125mg',
    dosageForm: 'Tablets',
    strength: '500mg + 125mg',
    therapeuticCategory: 'Antibiotics / Anti-Infective',
    packSize: '1 x 10 Alu-Alu Strip',
    manufacturer: 'Verified cGMP Manufacturing Partner',
    description: 'High-quality broad-spectrum antibacterial formulation indicated for respiratory tract, urinary tract, and soft tissue infections.',
    indications: 'Bacterial sinusitis, lower respiratory tract infections, skin and skin structure infections.',
    storageInstructions: 'Store protected from moisture at a temperature not exceeding 25°C. Do not freeze.',
    image: '/products/junoclav-625.png',
    isFeatured: true,
    status: 'published',
    createdAt: '2026-03-08T10:00:00Z',
    updatedAt: '2026-03-08T10:00:00Z'
  },
  {
    id: 'prod-002',
    slug: 'junopan-dsr',
    name: 'JUNOPAN-DSR',
    genericName: 'Pantoprazole Gastro-resistant & Domperidone Prolonged-release Capsules IP',
    composition: 'Pantoprazole Sodium IP eq. to Pantoprazole 40mg (as Enteric Coated Pellets) + Domperidone IP 30mg (as Sustained Release Pellets)',
    dosageForm: 'Capsules',
    strength: '40mg + 30mg',
    therapeuticCategory: 'Gastroenterology / Proton Pump Inhibitor',
    packSize: '10 x 10 Alu-Alu Blister',
    manufacturer: 'Verified cGMP Manufacturing Partner',
    description: 'Dual-action formulation for the management of gastroesophageal reflux disease (GERD), dyspepsia, and peptic ulcer disorders.',
    indications: 'GERD, erosive esophagitis, non-ulcer dyspepsia, hyperacidity with nausea.',
    storageInstructions: 'Store in a cool, dry place protected from light and moisture.',
    image: '/products/junopan-dsr.png',
    isFeatured: true,
    status: 'published',
    createdAt: '2026-03-08T10:30:00Z',
    updatedAt: '2026-03-08T10:30:00Z'
  },
  {
    id: 'prod-003',
    slug: 'junoceft-sb-1-5g',
    name: 'JUNOCEFT-SB 1.5g',
    genericName: 'Ceftriaxone and Sulbactam for Injection IP',
    composition: 'Sterile Ceftriaxone Sodium IP eq. to anhydrous Ceftriaxone 1000mg + Sterile Sulbactam Sodium IP eq. to anhydrous Sulbactam 500mg',
    dosageForm: 'Injections',
    strength: '1.5g (1000mg + 500mg)',
    therapeuticCategory: 'Critical Care / Cephalosporin Antibiotic',
    packSize: 'Vial with Sterile Water for Injection (SWFI)',
    manufacturer: 'Verified Sterile Injectable Partner Facility',
    description: 'Third-generation cephalosporin combined with a beta-lactamase inhibitor for parenteral administration in severe bacterial infections.',
    indications: 'Intra-abdominal infections, meningitis, surgical prophylaxis, bone and joint infections.',
    storageInstructions: 'Store below 25°C. Protect from direct light. Reconstituted solution should be used immediately.',
    image: '/products/junoceft-sb.png',
    isFeatured: true,
    status: 'published',
    createdAt: '2026-03-08T11:00:00Z',
    updatedAt: '2026-03-08T11:00:00Z'
  },
  {
    id: 'prod-004',
    slug: 'junocough-dx',
    name: 'JUNOCOUGH-DX',
    genericName: 'Dextromethorphan HBr, Phenylephrine HCl & Chlorpheniramine Maleate Syrup',
    composition: 'Each 5ml contains: Dextromethorphan Hydrobromide IP 10mg, Phenylephrine Hydrochloride IP 5mg, Chlorpheniramine Maleate IP 2mg in a flavored syrupy base',
    dosageForm: 'Syrups',
    strength: '10mg + 5mg + 2mg / 5ml',
    therapeuticCategory: 'Respiratory / Antitussive',
    packSize: '100ml PET Bottle with measuring cup',
    manufacturer: 'Verified Liquid Oral Formulation Partner',
    description: 'Comprehensive cough relief formulation targeting dry cough, nasal congestion, and allergic upper respiratory symptoms.',
    indications: 'Dry non-productive cough, allergic rhinitis, upper respiratory tract congestion.',
    storageInstructions: 'Keep bottle tightly closed. Store below 30°C in a dry place.',
    image: '/products/junocough-dx.png',
    isFeatured: false,
    status: 'published',
    createdAt: '2026-03-08T11:30:00Z',
    updatedAt: '2026-03-08T11:30:00Z'
  },
  {
    id: 'prod-005',
    slug: 'junocal-d3-max',
    name: 'JUNOCAL-D3 MAX',
    genericName: 'Calcium Carbonate, Calcitriol, Zinc & Vitamin K2-7 Softgel Capsules',
    composition: 'Calcium Carbonate 1250mg eq. to elemental Calcium 500mg, Calcitriol IP 0.25mcg, Vitamin K2-7 45mcg, Zinc Sulphate Monohydrate eq. to elemental Zinc 7.5mg',
    dosageForm: 'Capsules',
    strength: '500mg + 0.25mcg + 45mcg',
    therapeuticCategory: 'Nutraceutical / Bone Health',
    packSize: '3 x 10 Blister Pack',
    manufacturer: 'Verified Softgel Manufacturing Partner',
    description: 'Advanced bone mineral density formulation designed for optimal calcium absorption and cardiovascular arterial safety.',
    indications: 'Osteoporosis, osteopenia, post-menopausal bone loss, calcium deficiency states.',
    storageInstructions: 'Store in a cool, dry place. Protect from heat, light, and moisture.',
    image: '/products/junocal-d3.png',
    isFeatured: true,
    status: 'published',
    createdAt: '2026-03-08T12:00:00Z',
    updatedAt: '2026-03-08T12:00:00Z'
  },
  {
    id: 'prod-006',
    slug: 'juno-gel-pain-relief',
    name: 'JUNO-GEL Pain Relief',
    genericName: 'Diclofenac Diethylamine, Linseed Oil, Methyl Salicylate & Menthol Gel',
    composition: 'Diclofenac Diethylamine BP 1.16% w/w (eq. to Diclofenac Sodium 1.0% w/w), Linseed Oil BP 3.0% w/w, Methyl Salicylate IP 10.0% w/w, Menthol IP 5.0% w/w',
    dosageForm: 'Ointments',
    strength: '1.16% + 3.0% + 10.0% + 5.0%',
    therapeuticCategory: 'Analgesic / Anti-inflammatory Topical',
    packSize: '30g Laminated Tube',
    manufacturer: 'Verified Topical Formulation Partner',
    description: 'Fast-penetrating topical analgesic gel for targeted musculoskeletal pain, joint stiffness, and sports injuries.',
    indications: 'Muscular sprains, strains, low back pain, osteoarthritis pain.',
    storageInstructions: 'Replace cap tightly after use. Store below 25°C. Do not freeze.',
    image: '/products/juno-gel.png',
    isFeatured: false,
    status: 'published',
    createdAt: '2026-03-08T12:30:00Z',
    updatedAt: '2026-03-08T12:30:00Z'
  }
];

export const initialManufacturers: Manufacturer[] = [
  {
    id: 'mfg-001',
    name: 'State-of-the-Art Solid Orals Partner',
    location: 'Baddi, Himachal Pradesh',
    state: 'Himachal Pradesh',
    country: 'India',
    capabilities: [
      'High-speed rotary tablet compression',
      'Fluid bed granulators (FBD)',
      'Automated blister & Alu-Alu packing',
      'Class 100,000 cleanroom HVAC systems'
    ],
    dosageForms: ['Tablets', 'Capsules'],
    certifications: ['c-GMP Compliant', 'ISO 9001:2015 Standards'],
    qualitySystems: ['Total Quality Management', 'HPLC & Dissolution Profiling', 'Real-Time Stability Chambers'],
    website: '',
    status: 'verified',
    description: 'Equipped with precision engineering and automated containment systems adhering to Schedule M specifications for high-yield solid dosage forms.',
    createdAt: '2026-03-07T09:00:00Z'
  },
  {
    id: 'mfg-002',
    name: 'Aseptic Injectables & Parenteral Partner',
    location: 'Ahmedabad, Gujarat',
    state: 'Gujarat',
    country: 'India',
    capabilities: [
      'Aseptic filling under Laminar Air Flow (LAF)',
      'Terminal sterilization autoclaves',
      'Lyophilization (Freeze-drying) capabilities',
      'Inline automated visual particulate inspection'
    ],
    dosageForms: ['Injections'],
    certifications: ['c-GMP Quality Protocol', 'ISO 14644 Cleanroom Classified'],
    qualitySystems: ['Endotoxin LAL Testing', '100% Sterility Quarantine Protocols', 'TOC Online Monitoring'],
    website: '',
    status: 'verified',
    description: 'Specialized sterile manufacturing facility engineered for dry powders and liquid injectables with zero-compromise environmental monitoring.',
    createdAt: '2026-03-07T09:30:00Z'
  },
  {
    id: 'mfg-003',
    name: 'Liquid Orals & Topical Formulations Partner',
    location: 'Haridwar, Uttarakhand',
    state: 'Uttarakhand',
    country: 'India',
    capabilities: [
      'SS 316L manufacturing tanks with homogenizers',
      'Automatic bottle washing, filling and capping lines',
      'Touchless induction sealing',
      'Closed-loop pharmaceutical water (WFI & Purified Water) systems'
    ],
    dosageForms: ['Syrups', 'Suspensions', 'Ointments'],
    certifications: ['Schedule M Compliant', 'Good Laboratory Practices (GLP)'],
    qualitySystems: ['Viscosity and pH profiling', 'Microbiological assay labs', 'Batch traceability systems'],
    website: '',
    status: 'verified',
    description: 'Modern high-volume manufacturing center specialized in homogeneous suspensions, pediatric syrups, and topical gels.',
    createdAt: '2026-03-07T10:00:00Z'
  }
];

export const initialCertifications: Certification[] = [
  {
    id: 'cert-mca',
    name: 'Certificate of Incorporation (MCA)',
    type: 'MCA',
    issuingAuthority: 'Registrar of Companies (ROC Mumbai II), Ministry of Corporate Affairs, Govt of India',
    certificateNumber: 'CIN: U46497MR2026PTC474137',
    issueDate: '2026-03-06',
    expiryDate: 'Permanent (Subject to Annual Statutory Filings)',
    scope: 'Incorporation of Juno Healthcare Private Limited as a Private Limited Company under the Companies Act, 2013 (18 of 2013).',
    documentUrl: '',
    status: 'active',
    verified: true,
    createdAt: '2026-03-06T00:00:00Z'
  }
];

export const initialCompanyStats: CompanyStat[] = [
  {
    id: 'stat-1',
    key: 'incorporation',
    label: 'Incorporation Year',
    value: '2026',
    numericValue: 2026,
    isVerified: true,
    notes: 'Incorporated on 06 March 2026 under ROC Mumbai II'
  },
  {
    id: 'stat-2',
    key: 'portfolio',
    label: 'Core Portfolio',
    value: 'Active Line',
    isVerified: true,
    notes: 'Dynamic pharmaceutical product pipeline'
  },
  {
    id: 'stat-3',
    key: 'mfg_network',
    label: 'Manufacturing Network',
    value: 'Audit-Verified',
    isVerified: true,
    notes: 'Partnering exclusively with verified third-party cGMP compliant facilities'
  },
  {
    id: 'stat-4',
    key: 'compliance',
    label: 'Corporate Compliance',
    value: '100% MCA Verified',
    numericValue: 100,
    suffix: '%',
    isVerified: true,
    notes: 'CIN: U46497MR2026PTC474137'
  }
];

export const initialSiteSettings: SiteSettings = {
  siteName: 'JUNO HEALTHCARE PRIVATE LIMITED',
  siteTagline: 'Advancing Healthcare Through Quality & Trust',
  primaryPhone: '+91 9743094555',
  primaryEmail: '',
  address: 'Mumbai, Maharashtra, India',
  cin: 'U46497MR2026PTC474137',
  bannerNotice: '',
  showBanner: false,
  maintenanceMode: false,
  enablePublicEnquiries: true
};

export const qualityProcessSteps = [
  {
    step: '01',
    title: 'Raw Material Selection',
    subtitle: 'Pharmacopoeial Purity',
    description: 'Active Pharmaceutical Ingredients (APIs) and excipients are sourced exclusively from certified vendors with complete Certificate of Analysis (CoA) verification and identity testing.'
  },
  {
    step: '02',
    title: 'Quality Check & Assay',
    subtitle: 'Baseline Verification',
    description: 'Independent lab assays ensure chemical potency, microbial limits, heavy metal screening, and moisture equilibrium before batch dispensing.'
  },
  {
    step: '03',
    title: 'Controlled Manufacturing',
    subtitle: 'Schedule M Environments',
    description: 'Formulations are processed in temperature, humidity, and particulate-controlled cleanrooms utilizing automated high-precision equipment.'
  },
  {
    step: '04',
    title: 'In-Process Testing',
    subtitle: 'Dynamic Parameter Auditing',
    description: 'Continuous monitoring of tablet hardness, friability, disintegration time, dissolution rates, fill volumes, and weight variations throughout the production cycle.'
  },
  {
    step: '05',
    title: 'Quality Control (QC)',
    subtitle: 'Finished Product Clearance',
    description: 'Rigorous finished dosage testing via High-Performance Liquid Chromatography (HPLC), sterility audits, and dissolution profiling.'
  },
  {
    step: '06',
    title: 'Batch Release & QA Sign-off',
    subtitle: 'Authoritative Authorization',
    description: 'Comprehensive batch manufacturing record (BMR) review and formal analytical clearance prior to quarantine release.'
  },
  {
    step: '07',
    title: 'Compliant Distribution',
    subtitle: 'Cold-Chain & Integrity',
    description: 'Systematic dispatch adhering to Good Distribution Practices (GDP), protective secondary packaging, and lot-level traceability.'
  }
];

export const marketingLifecycleSteps = [
  {
    id: 'understand',
    title: 'Understand',
    tagline: 'Therapeutic Gap Analysis',
    description: 'We evaluate epidemiological patterns, patient therapeutic requirements, and physician feedback to identify formulation gaps across essential categories.'
  },
  {
    id: 'select',
    title: 'Select',
    tagline: 'Optimal Dosage Engineering',
    description: 'We select optimal pharmacokinetic profiles, dosage forms (tablets, sustained-release capsules, sterile injectables), and robust primary packaging.'
  },
  {
    id: 'quality',
    title: 'Quality',
    tagline: 'Partner Audit & Standardization',
    description: 'Every partner facility undergoes rigorous vendor qualification, analytical batch verification, and cGMP compliance review.'
  },
  {
    id: 'market',
    title: 'Market',
    tagline: 'Ethical Medical Representation',
    description: 'Providing accurate, scientifically grounded, and factual product literature to medical practitioners, hospitals, and licensed pharmacies.'
  },
  {
    id: 'deliver',
    title: 'Deliver',
    tagline: 'Reliable Supply Chain',
    description: 'Ensuring uninterrupted supply through our dependable network of certified pharmaceutical distributors and stockists.'
  }
];

export const whyJunoPillars = [
  {
    id: 'quality',
    title: 'Quality as a Standard',
    subtitle: 'Uncompromising Benchmarks',
    description: 'We partner exclusively with manufacturing units adhering to strict cGMP norms, pharmacopoeial monographs (IP/BP/USP), and multi-stage testing.'
  },
  {
    id: 'responsibility',
    title: 'Ethical Responsibility',
    subtitle: 'Truth in Pharmaceutical Marketing',
    description: 'Transparent communication, zero unsupported efficacy claims, and accurate clinical datasheets designed for informed medical decision-making.'
  },
  {
    id: 'partnership',
    title: 'Trusted Partnerships',
    subtitle: 'Synergistic Collaboration',
    description: 'Building enduring alliances with accredited formulation manufacturers, wholesale stockists, healthcare institutions, and clinicians.'
  },
  {
    id: 'growth',
    title: 'Scientific Vision',
    subtitle: 'Sustainable Healthcare Impact',
    description: 'Expanding our therapeutic portfolio thoughtfully to address emerging healthcare needs with reliability, precision, and patient-centric focus.'
  }
];

export const initialEnquiries: Enquiry[] = [
  {
    id: 'enq-001',
    name: 'Dr. R. K. Sharma',
    email: 'rk.sharma@example-hospital.org',
    phone: '+91 9820123456',
    company: 'Apex Multi-Specialty Hospital',
    subject: 'Institutional Supply Inquiry for Junoclav 625',
    category: 'Institutional Supply',
    message: 'We are evaluating new pharmaceutical marketing partners for our hospital formulary. Please share commercial terms and batch release protocols.',
    status: 'new',
    createdAt: '2026-03-09T14:20:00Z'
  },
  {
    id: 'enq-002',
    name: 'Vikas Deshmukh',
    email: 'vikas@maharashtra-pharma-dist.com',
    phone: '+91 9822987654',
    company: 'Maharashtra Pharma Distributors',
    subject: 'Distributorship Application - Western Zone',
    category: 'Distribution Partnership',
    message: 'Interested in regional stockist distribution rights for Juno Healthcare portfolio in Pune and Konkan divisions.',
    status: 'read',
    createdAt: '2026-03-08T16:45:00Z'
  }
];
