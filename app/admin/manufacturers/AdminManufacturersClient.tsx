'use client';

import React, { useState } from 'react';
import { Manufacturer, DosageForm } from '@/types';
import { Plus, Search, Edit3, Trash2, CheckCircle2, Factory, MapPin, X, RotateCcw, Archive } from 'lucide-react';

interface Props {
  initialManufacturers: Manufacturer[];
}

export default function AdminManufacturersClient({ initialManufacturers }: Props) {
  const [items, setItems] = useState<Manufacturer[]>(initialManufacturers);
  const [archivedItems, setArchivedItems] = useState<Manufacturer[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Manufacturer | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    state: '',
    country: 'India',
    capabilities: '',
    dosageForms: 'Tablets, Capsules',
    certifications: 'cGMP Compliant',
    qualitySystems: 'HPLC & Dissolution',
    description: '',
    status: 'verified' as 'verified' | 'pending_audit' | 'partner'
  });

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      location: '',
      state: '',
      country: 'India',
      capabilities: 'High-speed rotary tablet compression\nAutomated blister packing',
      dosageForms: 'Tablets, Capsules',
      certifications: 'cGMP Compliant, Schedule M',
      qualitySystems: 'HPLC & Dissolution Profiling',
      description: '',
      status: 'verified'
    });
    setIsModalOpen(true);
  };

  const openEdit = (m: Manufacturer) => {
    setEditingItem(m);
    setFormData({
      name: m.name,
      location: m.location,
      state: m.state || '',
      country: m.country,
      capabilities: m.capabilities.join('\n'),
      dosageForms: m.dosageForms.join(', '),
      certifications: m.certifications.join(', '),
      qualitySystems: m.qualitySystems.join(', '),
      description: m.description,
      status: m.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      location: formData.location,
      state: formData.state,
      country: formData.country,
      capabilities: formData.capabilities.split('\n').map(s => s.trim()).filter(Boolean),
      dosageForms: formData.dosageForms.split(',').map(s => s.trim() as DosageForm).filter(Boolean),
      certifications: formData.certifications.split(',').map(s => s.trim()).filter(Boolean),
      qualitySystems: formData.qualitySystems.split(',').map(s => s.trim()).filter(Boolean),
      description: formData.description,
      status: formData.status
    };

    try {
      if (editingItem) {
        const res = await fetch(`/api/manufacturers/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setItems(prev => prev.map(m => (m.id === editingItem.id ? data.data : m)));
          setIsModalOpen(false);
          setFeedback('Manufacturing partner updated.');
        }
      } else {
        const res = await fetch('/api/manufacturers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setItems(prev => [data.data, ...prev]);
          setIsModalOpen(false);
          setFeedback('Manufacturing partner added.');
        }
      }
    } catch (err) {
      alert('Error saving manufacturer');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Archive manufacturing partner: ${name}?`)) return;
    try {
      await fetch(`/api/manufacturers/${id}`, { method: 'DELETE' });
      const item = items.find(m => m.id === id);
      if (item) {
        setArchivedItems(prev => [item, ...prev]);
      }
      setItems(prev => prev.filter(m => m.id !== id));
      setFeedback(`Partner "${name}" archived. You can restore it from the Archived tab.`);
    } catch {
      alert('Archive failed.');
    }
  };

  const handleRestore = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/manufacturers/${id}/restore`, { method: 'PUT' });
      if (res.ok) {
        const item = archivedItems.find(m => m.id === id);
        if (item) {
          setItems(prev => [item, ...prev]);
          setArchivedItems(prev => prev.filter(m => m.id !== id));
        }
        setFeedback(`Partner "${name}" restored successfully.`);
      }
    } catch {
      alert('Restore failed.');
    }
  };

  const currentList = activeTab === 'active' ? items : archivedItems;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block">
            Alliance Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Manufacturing Partners ({items.length})
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Manufacturing Partner</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'active' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Partners ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'archived' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archived ({archivedItems.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentList.map(mfg => (
          <div key={mfg.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-sky-300 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-sky-50 text-sky-800 text-[10px] font-bold rounded-full uppercase">
                  Partner Unit
                </span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {mfg.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{mfg.name}</h3>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{mfg.location}, {mfg.country}</span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{mfg.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              {activeTab === 'archived' ? (
                <button
                  onClick={() => handleRestore(mfg.id, mfg.name)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => openEdit(mfg)}
                    className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(mfg.id, mfg.name)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Archive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Manufacturing Partner' : 'Add Manufacturing Partner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Facility / Partner Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Modern Solid Orals Partner"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Location (City/Area) *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Baddi, Himachal Pradesh"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Dosage Forms Produced (comma separated)</label>
                <input
                  type="text"
                  value={formData.dosageForms}
                  onChange={e => setFormData({ ...formData, dosageForms: e.target.value })}
                  placeholder="Tablets, Capsules, Syrups"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Technical Capabilities (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.capabilities}
                  onChange={e => setFormData({ ...formData, capabilities: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Certifications (comma separated)</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="c-GMP Compliant, Schedule M"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description / Facility Overview</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white font-bold rounded-xl"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
