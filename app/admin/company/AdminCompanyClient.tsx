'use client';

import React, { useState } from 'react';
import { CorporateProfile } from '@/types';
import { Building2, Save, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface Props {
  initialProfile: CorporateProfile;
}

export default function AdminCompanyClient({ initialProfile }: Props) {
  const [profile, setProfile] = useState<CorporateProfile>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setFeedback('Corporate profile and contact coordinates updated.');
      }
    } catch {
      alert('Failed to save company profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block">
          Corporate Records Editor
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
          Company Information & Communication Coordinates
        </h1>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Verified MCA Read-Only Box */}
      <div className="p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory MCA Record (Verified Government Filing)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-sans block text-[10px]">CIN</span>
            <span className="text-sky-300 font-bold">{profile.cin}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-sans block text-[10px]">ROC</span>
            <span className="text-white font-bold">{profile.roc}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-sans block text-[10px]">Incorporation Date</span>
            <span className="text-white font-bold">{profile.incorporationDate} (06/03/2026)</span>
          </div>
        </div>
      </div>

      {/* Form for Editable Parameters */}
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-950">
          Public Contact & Overview Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Official Phone *</label>
            <input
              type="text"
              required
              value={profile.officialPhone}
              onChange={e => setProfile({ ...profile, officialPhone: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Official Email *</label>
            <input
              type="email"
              required
              value={profile.officialEmail}
              onChange={e => setProfile({ ...profile, officialEmail: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Official Domain</label>
            <input
              type="text"
              required
              value={profile.domain}
              onChange={e => setProfile({ ...profile, domain: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Registered Office Address</label>
          <input
            type="text"
            value={profile.registeredOffice}
            onChange={e => setProfile({ ...profile, registeredOffice: e.target.value })}
            className="w-full px-3 py-2 border rounded-xl text-xs text-slate-900"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Brief Corporate Description (Homepage)</label>
          <textarea
            rows={2}
            value={profile.aboutBrief}
            onChange={e => setProfile({ ...profile, aboutBrief: e.target.value })}
            className="w-full px-3 py-2 border rounded-xl text-xs text-slate-900"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Full Corporate Overview (About Page)</label>
          <textarea
            rows={3}
            value={profile.aboutFull}
            onChange={e => setProfile({ ...profile, aboutFull: e.target.value })}
            className="w-full px-3 py-2 border rounded-xl text-xs text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Vision Statement</label>
            <textarea
              rows={2}
              value={profile.vision}
              onChange={e => setProfile({ ...profile, vision: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Mission Statement</label>
            <textarea
              rows={2}
              value={profile.mission}
              onChange={e => setProfile({ ...profile, mission: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Corporate Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
