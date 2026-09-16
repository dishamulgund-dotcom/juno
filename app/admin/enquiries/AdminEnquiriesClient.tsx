'use client';

import React, { useState } from 'react';
import { Enquiry } from '@/types';
import { MessageSquare, Mail, Phone, Building2, Trash2, CheckCircle2, Clock, X, Search, Filter } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Props {
  initialEnquiries: Enquiry[];
}

export default function AdminEnquiriesClient({ initialEnquiries }: Props) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: Enquiry['status']) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: adminNotes })
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries(prev => prev.map(e => (e.id === id ? data.data : e)));
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry(data.data);
        }
        setFeedback(`Status updated to "${newStatus}".`);
      }
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this enquiry record?')) return;
    try {
      await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      setEnquiries(prev => prev.filter(e => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      setFeedback('Enquiry record archived.');
    } catch {
      alert('Failed to archive enquiry.');
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    if (statusFilter === 'all') return true;
    return e.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block">
            Commercial Relations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Inbound Enquiries Inbox ({enquiries.length})
          </h1>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'new', 'read', 'contacted', 'closed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                statusFilter === s
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Grid: List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Enquiry List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredEnquiries.length > 0 ? (
            filteredEnquiries.map(enq => {
              const isSelected = selectedEnquiry?.id === enq.id;
              return (
                <div
                  key={enq.id}
                  onClick={() => {
                    setSelectedEnquiry(enq);
                    setAdminNotes(enq.notes || '');
                    if (enq.status === 'new') {
                      handleStatusChange(enq.id, 'read');
                    }
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-400 shadow-sm ring-1 ring-sky-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{enq.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      enq.status === 'new'
                        ? 'bg-rose-100 text-rose-800'
                        : enq.status === 'contacted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : enq.status === 'read'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-700'
                    }`}>
                      {enq.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-sky-800 line-clamp-1">
                    {enq.category}: {enq.subject}
                  </p>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {enq.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>{enq.email}</span>
                    <span>{formatDate(enq.createdAt)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No enquiries match the current filter.
            </div>
          )}
        </div>

        {/* Enquiry Detail Inspector */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {selectedEnquiry ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
                    {selectedEnquiry.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-950">
                    {selectedEnquiry.name}
                  </h3>
                  {selectedEnquiry.company && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{selectedEnquiry.company}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(selectedEnquiry.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Direct Contact Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-sky-50 hover:text-sky-700 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-sky-600" />
                  <span className="font-semibold truncate">{selectedEnquiry.email}</span>
                </a>

                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-sky-50 hover:text-sky-700 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span className="font-semibold">{selectedEnquiry.phone}</span>
                </a>
              </div>

              {/* Full Message Body */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Inquiry Content
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Update Lead Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'read', 'contacted', 'closed'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        selectedEnquiry.status === st
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase block">
                  Internal Administrative Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Add notes about call discussion or quotes sent..."
                  className="w-full p-3 border rounded-xl text-xs"
                />
                <button
                  onClick={() => handleStatusChange(selectedEnquiry.id, selectedEnquiry.status)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg"
                >
                  Save Notes
                </button>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-xs text-slate-400">
              Select an enquiry from the left to view message details and update communication status.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
