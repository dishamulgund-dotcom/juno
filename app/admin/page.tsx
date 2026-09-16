import React from 'react';
import Link from 'next/link';
import { 
  getProducts, 
  getManufacturers, 
  getCertifications, 
  getEnquiries, 
  getCorporateProfile 
} from '@/lib/db';
import { 
  Pill, 
  Factory, 
  Award, 
  MessageSquare, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminDashboardOverview() {
  const [products, manufacturers, certifications, enquiries, profile] = await Promise.all([
    getProducts({ includeDrafts: true }),
    getManufacturers(),
    getCertifications(),
    getEnquiries(),
    getCorporateProfile()
  ]);

  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block">
            Juno Healthcare Management Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Operations & Catalog Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Formulation</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            View Live Site
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Link 
          href="/admin/products"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Products
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-950 mb-1">
            {products.length}
          </div>
          <span className="text-xs text-sky-700 font-semibold flex items-center gap-1">
            <span>Manage Formulations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link 
          href="/admin/enquiries"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Trade Enquiries
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-black text-slate-950">{enquiries.length}</span>
            {newEnquiriesCount > 0 && (
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full uppercase">
                {newEnquiriesCount} New
              </span>
            )}
          </div>
          <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
            <span>Open Inquiries Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link 
          href="/admin/manufacturers"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Partner Plants
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Factory className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-950 mb-1">
            {manufacturers.length}
          </div>
          <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
            <span>Audited Manufacturing Units</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link 
          href="/admin/certifications"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Statutory Records
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-950 mb-1">
            {certifications.length}
          </div>
          <span className="text-xs text-indigo-700 font-semibold flex items-center gap-1">
            <span>MCA & Quality Certificates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

      </div>

      {/* Main 2-Column Split: Recent Enquiries & Corporate Record Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent Enquiries */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Inbound Trade & Product Inquiries
              </h2>
              <span className="text-xs text-slate-500">
                Direct inquiries logged from the public web portal
              </span>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-sky-700 hover:text-sky-900"
            >
              View All ({enquiries.length})
            </Link>
          </div>

          {enquiries.length > 0 ? (
            <div className="divide-y divide-slate-100 space-y-4">
              {enquiries.slice(0, 5).map(enq => (
                <div key={enq.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{enq.name}</span>
                      {enq.company && (
                        <span className="text-xs text-slate-500 font-medium">({enq.company})</span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        enq.status === 'new'
                          ? 'bg-rose-100 text-rose-800'
                          : enq.status === 'contacted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                      }`}>
                        {enq.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      <strong className="text-slate-700">{enq.category}:</strong> {enq.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{enq.email}</span>
                      <span>•</span>
                      <span>{enq.phone}</span>
                      <span>•</span>
                      <span>{formatDate(enq.createdAt)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/admin/enquiries`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg shrink-0 self-start sm:self-center transition-colors"
                  >
                    Inspect
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No inbound inquiries logged yet.
            </div>
          )}
        </div>

        {/* Right Column: Verified Corporate Identity Card */}
        <div className="lg:col-span-4 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified MCA Record</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              {profile.companyName}
            </h3>
            <span className="text-xs text-slate-400 font-mono block">
              CIN: {profile.cin}
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ROC:</span>
              <span className="font-semibold text-white">{profile.roc}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Incorporation Date:</span>
              <span className="font-semibold text-white">06/03/2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Official Phone:</span>
              <span className="font-semibold text-white">{profile.officialPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Official Email:</span>
              <span className="font-semibold text-sky-300">{profile.officialEmail}</span>
            </div>
          </div>

          <Link
            href="/admin/company"
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <span>Edit Company Profile</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
          </Link>
        </div>

      </div>
    </div>
  );
}
