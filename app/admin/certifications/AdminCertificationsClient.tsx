'use client';

import React, { useState, useRef } from 'react';
import { Certification } from '@/types';
import { Plus, Edit3, Trash2, CheckCircle2, Award, X, Calendar, Building2, FileText, Upload, ExternalLink, RotateCcw, Archive } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Props {
  initialCertifications: Certification[];
}

export default function AdminCertificationsClient({ initialCertifications }: Props) {
  const [items, setItems] = useState<Certification[]>(initialCertifications);
  const [archivedItems, setArchivedItems] = useState<Certification[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certification | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'GMP' as Certification['type'],
    issuingAuthority: '',
    certificateNumber: '',
    issueDate: '',
    expiryDate: '',
    scope: '',
    documentUrl: '',
    status: 'active' as Certification['status'],
    verified: true
  });

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      type: 'GMP',
      issuingAuthority: 'State Licensing Authority / Auditor Panel',
      certificateNumber: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: 'Permanent',
      scope: '',
      documentUrl: '',
      status: 'active',
      verified: true
    });
    setIsModalOpen(true);
  };

  const openEdit = (c: Certification) => {
    setEditingItem(c);
    setFormData({
      name: c.name,
      type: c.type,
      issuingAuthority: c.issuingAuthority,
      certificateNumber: c.certificateNumber,
      issueDate: c.issueDate,
      expiryDate: c.expiryDate,
      scope: c.scope,
      documentUrl: c.documentUrl || '',
      status: c.status,
      verified: c.verified
    });
    setIsModalOpen(true);
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Document size must be less than 15MB.');
      return;
    }

    setUploadingDoc(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'documents');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setFormData(prev => ({ ...prev, documentUrl: json.url }));
        setFeedback('Certificate document attached successfully.');
      } else {
        alert(json.error || 'Document upload failed.');
      }
    } catch {
      alert('Failed to upload document.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await fetch(`/api/certifications/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          setItems(prev => prev.map(c => (c.id === editingItem.id ? data.data : c)));
          setIsModalOpen(false);
          setFeedback('Certificate updated.');
        }
      } else {
        const res = await fetch('/api/certifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          setItems(prev => [data.data, ...prev]);
          setIsModalOpen(false);
          setFeedback('New certificate record added.');
        }
      }
    } catch {
      alert('Failed to save certificate record.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Archive certificate entry: ${name}?`)) return;
    try {
      await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
      const item = items.find(c => c.id === id);
      if (item) {
        setArchivedItems(prev => [item, ...prev]);
      }
      setItems(prev => prev.filter(c => c.id !== id));
      setFeedback(`Certificate "${name}" archived. You can restore it from the Archived tab.`);
    } catch {
      alert('Archive failed.');
    }
  };

  const handleRestore = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/certifications/${id}/restore`, { method: 'PUT' });
      if (res.ok) {
        const item = archivedItems.find(c => c.id === id);
        if (item) {
          setItems(prev => [item, ...prev]);
          setArchivedItems(prev => prev.filter(c => c.id !== id));
        }
        setFeedback(`Certificate "${name}" restored successfully.`);
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
            Compliance Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Certifications & Statutory Registry ({items.length})
          </h1>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate Record</span>
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
          Active Certificates ({items.length})
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
        {currentList.map(cert => (
          <div key={cert.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-sky-300 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-sky-50 text-sky-800 text-[10px] font-bold rounded-full uppercase">
                  {cert.type} Record
                </span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {cert.verified ? 'Verified' : 'Pending'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{cert.name}</h3>

              <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-800">
                <span className="text-[10px] text-slate-500 font-sans block">Certificate / Ref No:</span>
                <span className="font-bold select-all">{cert.certificateNumber}</span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{cert.scope}</p>

              <div className="text-[11px] text-slate-500 space-y-0.5">
                <div>Authority: <strong className="text-slate-700">{cert.issuingAuthority}</strong></div>
                <div>Issue Date: {formatDate(cert.issueDate)}</div>
                {cert.documentUrl && (
                  <div className="pt-1">
                    <a
                      href={cert.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sky-700 font-bold hover:underline"
                    >
                      <FileText className="w-3 h-3 text-sky-600" />
                      <span>View Official Document (PDF/Scan)</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              {activeTab === 'archived' ? (
                <button
                  onClick={() => handleRestore(cert.id, cert.name)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => openEdit(cert)}
                    className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id, cert.name)}
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
                {editingItem ? 'Edit Certificate Record' : 'Add New Certificate Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Certificate Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Partner cGMP Compliance Record"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="GMP">GMP Standard</option>
                    <option value="WHO-GMP">WHO-GMP</option>
                    <option value="ISO">ISO 9001/Quality</option>
                    <option value="MCA">MCA Government Record</option>
                    <option value="GLP">GLP Standard</option>
                    <option value="Other">Other Verified Standard</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Certificate Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.certificateNumber}
                    onChange={e => setFormData({ ...formData, certificateNumber: e.target.value })}
                    placeholder="e.g. AUD-2026-GMP-01"
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Issuing Authority / Statutory Body *</label>
                <input
                  type="text"
                  required
                  value={formData.issuingAuthority}
                  onChange={e => setFormData({ ...formData, issuingAuthority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Expiry Date / Validity</label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    placeholder="e.g. 2028-03-06 or Permanent"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Audited Scope / Description</label>
                <textarea
                  rows={3}
                  value={formData.scope}
                  onChange={e => setFormData({ ...formData, scope: e.target.value })}
                  placeholder="Scope of verification..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              {/* Document PDF Attachment */}
              <div className="p-3 bg-slate-50 border rounded-xl space-y-2">
                <label className="font-bold text-slate-700 block">
                  Official Verification Document (PDF / Image — Max 15MB)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf,image/png,image/jpeg,image/webp"
                    onChange={handleDocUpload}
                    className="hidden"
                    id="cert-doc-upload"
                  />
                  <label
                    htmlFor="cert-doc-upload"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{formData.documentUrl ? 'Replace Document' : 'Upload PDF Document'}</span>
                  </label>
                  {formData.documentUrl && (
                    <span className="text-[11px] text-emerald-700 font-bold truncate">
                      Document Attached
                    </span>
                  )}
                </div>
                {uploadingDoc && <span className="text-[11px] text-sky-600 block">Uploading file to storage...</span>}
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
