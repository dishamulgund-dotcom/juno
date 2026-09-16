'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, DosageForm } from '@/types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Eye, 
  CheckCircle2,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Archive
} from 'lucide-react';

interface AdminProductsClientProps {
  initialProducts: Product[];
}

const DOSAGE_OPTIONS: DosageForm[] = [
  'Tablets',
  'Capsules',
  'Syrups',
  'Injections',
  'Ointments',
  'Suspensions',
  'Drops',
  'Other'
];

export default function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    genericName: string;
    composition: string;
    dosageForm: DosageForm;
    strength: string;
    therapeuticCategory: string;
    packSize: string;
    manufacturer: string;
    description: string;
    indications: string;
    storageInstructions: string;
    image: string;
    isFeatured: boolean;
    status: 'published' | 'draft';
  }>({
    name: '',
    genericName: '',
    composition: '',
    dosageForm: 'Tablets',
    strength: '',
    therapeuticCategory: '',
    packSize: '',
    manufacturer: 'Verified cGMP Manufacturing Partner',
    description: '',
    indications: '',
    storageInstructions: 'Store in a cool, dry place protected from light.',
    image: '',
    isFeatured: false,
    status: 'published'
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      genericName: '',
      composition: '',
      dosageForm: 'Tablets',
      strength: '',
      therapeuticCategory: 'General Therapeutics',
      packSize: '1 x 10 Alu-Alu Strip',
      manufacturer: 'Verified cGMP Manufacturing Partner',
      description: '',
      indications: '',
      storageInstructions: 'Store in a cool, dry place protected from light.',
      image: '',
      isFeatured: false,
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      genericName: p.genericName,
      composition: p.composition,
      dosageForm: p.dosageForm,
      strength: p.strength || '',
      therapeuticCategory: p.therapeuticCategory,
      packSize: p.packSize,
      manufacturer: p.manufacturer || 'Verified cGMP Manufacturing Partner',
      description: p.description,
      indications: p.indications || '',
      storageInstructions: p.storageInstructions || 'Store in a cool, dry place.',
      image: p.image || '',
      isFeatured: p.isFeatured,
      status: p.status
    });
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be less than 10MB.');
      return;
    }

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setFormData(prev => ({ ...prev, image: json.url }));
        setFeedback('Product image uploaded successfully.');
      } else {
        // Fallback to base64 data URL
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setFormData(prev => ({ ...prev, image: reader.result as string }));
            setFeedback('Image converted and attached.');
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      // Fallback
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const payload = {
      ...formData,
      image: formData.image || '/images/placeholder-product.png'
    };

    try {
      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          setProducts(prev => prev.map(p => (p.id === editingProduct.id ? json.data : p)));
          setIsModalOpen(false);
          setFeedback('Product updated successfully.');
        }
      } else {
        // POST create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          setProducts(prev => [json.data, ...prev]);
          setIsModalOpen(false);
          setFeedback('New formulation added to catalog.');
        }
      }
    } catch (err) {
      alert('Operation failed. Please verify all required fields.');
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to archive formulation: ${name}?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const item = products.find(p => p.id === id);
        if (item) {
          setArchivedProducts(prev => [item, ...prev]);
        }
        setProducts(prev => prev.filter(p => p.id !== id));
        setFeedback(`Formulation "${name}" archived. You can restore it at any time from the Archived tab.`);
      }
    } catch (err) {
      alert('Failed to archive formulation.');
    }
  };

  const handleRestore = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/products/${id}/restore`, { method: 'PUT' });
      if (res.ok) {
        const item = archivedProducts.find(p => p.id === id);
        if (item) {
          setProducts(prev => [item, ...prev]);
          setArchivedProducts(prev => prev.filter(p => p.id !== id));
        }
        setFeedback(`Formulation "${name}" successfully restored to active catalog.`);
      }
    } catch (err) {
      alert('Failed to restore formulation.');
    }
  };

  const currentList = activeTab === 'active' ? products : archivedProducts;

  const filteredProducts = currentList.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.genericName.toLowerCase().includes(q) ||
      p.composition.toLowerCase().includes(q) ||
      p.therapeuticCategory.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9E2EC]">
        <div>
          <span className="text-xs font-bold text-[#0D5C91] uppercase tracking-widest block">
            Catalog & Media Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#102A43]">
            Pharmaceutical Products ({products.length})
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Formulation</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Tab Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D9E2EC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#334E68] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products by brand, generic name, or category..."
            className="w-full pl-10 pr-4 py-2 bg-[#F3F9FB] border border-[#D9E2EC] rounded-xl text-xs text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#16B8B3]"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#F3F9FB] border border-[#D9E2EC] rounded-xl text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'active'
                ? 'bg-[#073B5C] text-white shadow-xs'
                : 'text-[#334E68] hover:text-[#073B5C]'
            }`}
          >
            Active Formulations ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('archived')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'archived'
                ? 'bg-[#073B5C] text-white shadow-xs'
                : 'text-[#334E68] hover:text-[#073B5C]'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archived ({archivedProducts.length})</span>
          </button>
        </div>
      </div>

      {/* Products Table with Dedicated Image Column */}
      <div className="bg-white rounded-2xl border border-[#D9E2EC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3F9FB] border-b border-[#D9E2EC] text-[#334E68] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 w-20">Image</th>
                <th className="px-5 py-3.5">Product Formulation</th>
                <th className="px-5 py-3.5">Dosage / Strength</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E2EC]/70">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-[#F3F9FB]/60 transition-colors">
                  {/* Dedicated Image Column */}
                  <td className="px-5 py-3">
                    <div className="relative w-12 h-12 bg-white rounded-lg border border-[#D9E2EC] p-1 flex items-center justify-center overflow-hidden">
                      <Image
                        src={product.image || '/images/placeholder-product.png'}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
                        }}
                      />
                    </div>
                  </td>

                  {/* Formulation Name & Composition */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#102A43] text-sm">{product.name}</span>
                        {product.isFeatured && (
                          <span className="px-1.5 py-0.5 bg-[#073B5C] text-white text-[10px] font-bold rounded uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#0D5C91] font-semibold line-clamp-1">
                        {product.genericName}
                      </span>
                    </div>
                  </td>

                  {/* Dosage & Strength */}
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-[#F3F9FB] text-[#073B5C] border border-[#D9E2EC] font-bold rounded-lg text-[11px] inline-block mb-1">
                      {product.dosageForm}
                    </span>
                    <div className="text-[11px] text-[#334E68] font-mono">{product.strength || 'Standard'} • {product.packSize}</div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4 text-[#334E68] font-medium">
                    {product.therapeuticCategory}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      product.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {activeTab === 'archived' ? (
                        <button
                          onClick={() => handleRestore(product.id, product.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16B8B3] hover:bg-[#129B97] text-[#073B5C] font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                          title="Restore Formulation to Active Catalog"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>
                      ) : (
                        <>
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#334E68] hover:text-[#073B5C] rounded-lg hover:bg-[#F3F9FB]"
                            title="View Live Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-[#0D5C91] hover:text-[#073B5C] rounded-lg hover:bg-[#F3F9FB] cursor-pointer"
                            title="Edit Formulation"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Archive Formulation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal with Image Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B5C]/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D9E2EC] overflow-hidden my-8">
            
            <div className="flex items-center justify-between px-6 py-4 bg-[#073B5C] text-white border-b border-[#0B4C74]">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? `Edit Formulation: ${editingProduct.name}` : 'Add New Pharmaceutical Formulation'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Product Image Upload Section */}
              <div className="p-4 rounded-2xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-3">
                <label className="text-xs font-bold text-[#073B5C] uppercase tracking-wider block">
                  Product Pack Image (JPG, PNG, WEBP — Max 10MB)
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Thumbnail Preview */}
                  <div className="relative w-28 h-28 bg-white rounded-xl border border-[#D9E2EC] p-2 flex items-center justify-center overflow-hidden shrink-0">
                    <Image
                      src={formData.image || '/images/placeholder-product.png'}
                      alt="Preview"
                      fill
                      sizes="112px"
                      className="object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
                      }}
                    />
                  </div>

                  <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageFileChange}
                        className="hidden"
                        id="product-image-upload"
                      />
                      <label
                        htmlFor="product-image-upload"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{formData.image ? 'Replace Image' : 'Upload Pack Image'}</span>
                      </label>

                      {formData.image && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#334E68]">
                      {uploadingImage ? 'Uploading image...' : formData.image ? 'Custom image attached and ready.' : 'No custom image chosen. Standard placeholder will be displayed.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulation Core Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#102A43] uppercase">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. JUNOCLAV 625"
                    className="w-full px-3 py-2 border border-[#D9E2EC] rounded-xl text-xs text-[#102A43] focus:ring-2 focus:ring-[#16B8B3]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#102A43] uppercase">Generic Composition *</label>
                  <input
                    type="text"
                    required
                    value={formData.genericName}
                    onChange={e => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Amoxicillin & Clavulanate Potassium Tablets IP"
                    className="w-full px-3 py-2 border border-[#D9E2EC] rounded-xl text-xs text-[#102A43] focus:ring-2 focus:ring-[#16B8B3]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#102A43] uppercase">Full Pharmacopoeial Composition *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.composition}
                  onChange={e => setFormData({ ...formData, composition: e.target.value })}
                  placeholder="e.g. Each film coated tablet contains: Amoxicillin Trihydrate IP eq. to Amoxicillin 500mg..."
                  className="w-full px-3 py-2 border border-[#D9E2EC] rounded-xl text-xs text-[#102A43] focus:ring-2 focus:ring-[#16B8B3]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#102A43] uppercase">Dosage Form</label>
                  <select
                    value={formData.dosageForm}
                    onChange={e => setFormData({ ...formData, dosageForm: e.target.value as DosageForm })}
                    className="w-full px-3 py-2 border border-[#D9E2EC] rounded-xl text-xs text-[#102A43] focus:ring-2 focus:ring-[#16B8B3]"
                  >
                    {DOSAGE_OPTIONS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#102A43] uppercase">Strength</label>
                  <input
                    type="text"
                    value={formData.strength}
                    onChange={e => setFormData({ ...formData, strength: e.target.value })}
                    placeholder="e.g. 500mg + 125mg"
                    className="w-full px-3 py-2 border border-[#D9E2EC] rounded-xl text-xs text-[#102A43] focus:ring-2 focus:ring-[#16B8B3]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#102A43] uppercase">Pack Size</label>
                  <input
                    type="text"
                    value={formData.packSize}
                    onChange={e => setFormData({ ...formData, packSize: e.target.value })}
                    placeholder="e.g. 10 x 10 Alu-Alu"
                    className="w-full px-3 py-2 border border-[#D9E2EC] rounded-xl text-xs text-[#102A43] focus:ring-2 focus:ring-[#16B8B3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#102A43] uppercase">Therapeutic Category</label>
                  <input
                    type="text"
                    value={formData.therapeuticCategory}
                    onChange={e => setFormData({ ...formData, therapeuticCategory: e.target.value })}
                    placeholder="e.g. Antibiotic / Anti-Infective"
                    className="w-full px-3 py-2 border border-[#D9E2EC] rounded-xl text-xs text-[#102A43] focus:ring-2 focus:ring-[#16B8B3]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#102A43] uppercase">Manufacturing Standard / Partner</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="Verified cGMP Manufacturing Partner"
                    className="w-full px-3 py-2 border border-[#D9E2EC] rounded-xl text-xs text-[#102A43] focus:ring-2 focus:ring-[#16B8B3]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#102A43] uppercase">Product Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Clinical therapeutic overview..."
                  className="w-full px-3 py-2 border border-[#D9E2EC] rounded-xl text-xs text-[#102A43] focus:ring-2 focus:ring-[#16B8B3]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#102A43] uppercase">Clinical Indications</label>
                <input
                  type="text"
                  value={formData.indications}
                  onChange={e => setFormData({ ...formData, indications: e.target.value })}
                  placeholder="e.g. Respiratory infections, skin infections"
                  className="w-full px-3 py-2 border border-[#D9E2EC] rounded-xl text-xs text-[#102A43] focus:ring-2 focus:ring-[#16B8B3]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#102A43] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-[#073B5C] focus:ring-[#16B8B3] w-4 h-4 cursor-pointer"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#102A43]">Status:</span>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="px-2 py-1 border border-[#D9E2EC] rounded-lg text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft / Under Review</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D9E2EC] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#334E68] hover:bg-[#F3F9FB] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-xs font-bold uppercase rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
