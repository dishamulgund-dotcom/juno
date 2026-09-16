'use client';

import React, { useState } from 'react';
import { CompanyStat } from '@/types';
import { TrendingUp, CheckCircle2, X, Save, AlertCircle } from 'lucide-react';

interface Props {
  initialStats: CompanyStat[];
}

export default function AdminStatsClient({ initialStats }: Props) {
  const [stats, setStats] = useState<CompanyStat[]>(initialStats);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleUpdate = async (stat: CompanyStat) => {
    try {
      const res = await fetch('/api/statistics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stat)
      });
      const data = await res.json();
      if (data.success) {
        setStats(prev => prev.map(s => (s.id === stat.id ? data.data : s)));
        setFeedback(`Stat "${stat.label}" updated.`);
      }
    } catch {
      alert('Failed to update statistic.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block">
          Dynamic Milestones
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
          Company Statistics & Verification Manager
        </h1>
        <p className="text-xs text-slate-500 pt-1">
          Update public corporate numbers. Unverified metrics will automatically display as "—" or "Data to be updated" on the public website.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <div key={stat.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Stat #{idx + 1}
              </span>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stat.isVerified}
                  onChange={e => {
                    const updated = { ...stat, isVerified: e.target.checked };
                    setStats(prev => prev.map(s => (s.id === stat.id ? updated : s)));
                  }}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Verified Metric</span>
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Label Title</label>
              <input
                type="text"
                value={stat.label}
                onChange={e => {
                  const val = e.target.value;
                  setStats(prev => prev.map(s => (s.id === stat.id ? { ...s, label: val } : s)));
                }}
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Displayed Value</label>
                <input
                  type="text"
                  value={stat.value}
                  placeholder="e.g. Active Line or 2026"
                  onChange={e => {
                    const val = e.target.value;
                    setStats(prev => prev.map(s => (s.id === stat.id ? { ...s, value: val } : s)));
                  }}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Suffix (optional)</label>
                <input
                  type="text"
                  value={stat.suffix || ''}
                  placeholder="e.g. + or %"
                  onChange={e => {
                    const val = e.target.value;
                    setStats(prev => prev.map(s => (s.id === stat.id ? { ...s, suffix: val } : s)));
                  }}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Subtext / Verification Note</label>
              <input
                type="text"
                value={stat.notes || ''}
                placeholder="e.g. Incorporated on 06 March 2026"
                onChange={e => {
                  const val = e.target.value;
                  setStats(prev => prev.map(s => (s.id === stat.id ? { ...s, notes: val } : s)));
                }}
                className="w-full px-3 py-2 border rounded-xl text-xs text-slate-600"
              />
            </div>

            <button
              onClick={() => handleUpdate(stat)}
              className="w-full py-2.5 bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs uppercase rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Metric</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
