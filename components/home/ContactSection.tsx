'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Building2,
  Clock,
  Globe
} from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: 'Product Inquiry',
    subject: '',
    message: '',
    honeypot: '' // Spam protection
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // Silent discard for bot spam

    // Basic Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setStatus('error');
      setErrorMessage('Please complete all required fields marked with an asterisk (*).');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          category: formData.category,
          subject: formData.subject || `${formData.category} from ${formData.name}`,
          message: formData.message
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit enquiry');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        category: 'Product Inquiry',
        subject: '',
        message: '',
        honeypot: ''
      });
    } catch (err) {
      setStatus('error');
      setErrorMessage('Unable to transmit enquiry at this time. Please try again or call our official telephone.');
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
            Institutional & Commercial Relations
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102A43] tracking-tight">
            Connect With Juno
          </h2>
          <p className="text-base text-[#334E68] leading-relaxed pt-1">
            For product inquiries, institutional supply, distribution partnerships, or manufacturing alliances, get in touch with our pharmaceutical commercial team.
          </p>
        </div>

        {/* 2-Column Contact & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Corporate Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#073B5C] text-white shadow-xl border border-[#0B4C74] space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#48D4D2]">
                  <Building2 className="w-4 h-4 text-[#16B8B3]" />
                  <span>Corporate Headquarters</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Juno Healthcare Private Limited
                </h3>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#0B4C74] text-sm text-[#F3F9FB]/90">
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#04243A] text-[#48D4D2] shrink-0 mt-0.5 border border-[#0B4C74]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#F3F9FB]/60 block font-bold">Official Phone</span>
                    <a href="tel:+919743094555" className="text-base font-bold text-white hover:text-[#48D4D2] transition-colors">
                      +91 9743094555
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#04243A] text-[#48D4D2] shrink-0 mt-0.5 border border-[#0B4C74]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#F3F9FB]/60 block font-bold">Official Domain</span>
                    <span className="text-sm font-semibold text-white font-mono">
                      junohealthcare.in
                    </span>
                    <span className="text-[11px] text-[#F3F9FB]/60 block mt-0.5">
                      Commercial & Trade Portal
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#04243A] text-[#48D4D2] shrink-0 mt-0.5 border border-[#0B4C74]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#F3F9FB]/60 block font-bold">Registered Office</span>
                    <span className="text-sm font-semibold text-white">
                      Mumbai, Maharashtra, India
                    </span>
                    <span className="text-[11px] text-[#F3F9FB]/60 block mt-0.5">
                      ROC Mumbai II
                    </span>
                  </div>
                </div>

              </div>

              {/* MCA Identity Box */}
              <div className="p-4 rounded-2xl bg-[#04243A] border border-[#0B4C74] text-xs text-[#F3F9FB]/80 space-y-1 font-mono">
                <div className="flex items-center gap-1.5 text-[#48D4D2] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  MCA Verified Filing
                </div>
                <div>CIN: U46497MR2026PTC474137</div>
                <div>Incorporation Date: 06/03/2026</div>
              </div>

            </div>

            {/* Business Hours & Response Standard */}
            <div className="p-5 rounded-3xl bg-[#F3F9FB] border border-[#D9E2EC] text-xs text-[#334E68] flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#073B5C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#073B5C] block mb-0.5 font-bold">Response SLA</strong>
                All trade and distribution inquiries submitted via this portal are logged directly into our administrative console and reviewed within 1–2 business days.
              </div>
            </div>
          </div>

          {/* Right Column: Inbound Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F3F9FB] border border-[#D9E2EC] shadow-xs">
              
              {status === 'success' ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-emerald-200 space-y-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#102A43]">
                    Enquiry Transmitted Successfully
                  </h3>
                  <p className="text-sm text-[#334E68] max-w-md mx-auto leading-relaxed">
                    Thank you for contacting Juno Healthcare Private Limited. Your enquiry has been logged in our secure registry and routed to our pharmaceutical commercial team.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-6 py-2.5 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={e => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Rajesh Kumar"
                        className="w-full px-4 py-3 bg-white border border-[#D9E2EC] rounded-xl text-sm text-[#102A43] placeholder:text-[#334E68]/60 focus:outline-none focus:ring-2 focus:ring-[#16B8B3]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. name@organization.com"
                        className="w-full px-4 py-3 bg-white border border-[#D9E2EC] rounded-xl text-sm text-[#102A43] placeholder:text-[#334E68]/60 focus:outline-none focus:ring-2 focus:ring-[#16B8B3]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block">
                        Contact Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-3 bg-white border border-[#D9E2EC] rounded-xl text-sm text-[#102A43] placeholder:text-[#334E68]/60 focus:outline-none focus:ring-2 focus:ring-[#16B8B3]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block">
                        Company / Hospital / Organization
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Optional"
                        className="w-full px-4 py-3 bg-white border border-[#D9E2EC] rounded-xl text-sm text-[#102A43] placeholder:text-[#334E68]/60 focus:outline-none focus:ring-2 focus:ring-[#16B8B3]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white border border-[#D9E2EC] rounded-xl text-sm text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#16B8B3]"
                    >
                      <option value="Product Inquiry">Product Information & Formulations</option>
                      <option value="Distribution Partnership">Regional Distributorship / Stockist</option>
                      <option value="Institutional Supply">Hospital & Institutional Formulary</option>
                      <option value="Manufacturing Alliance">cGMP Manufacturing Contract Proposal</option>
                      <option value="General">General Corporate Communication</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Distribution inquiry for Western Maharashtra"
                      className="w-full px-4 py-3 bg-white border border-[#D9E2EC] rounded-xl text-sm text-[#102A43] placeholder:text-[#334E68]/60 focus:outline-none focus:ring-2 focus:ring-[#16B8B3]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#102A43] uppercase tracking-wider block">
                      Message / Requirement Details <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your product, distribution territory, or collaboration requirements..."
                      className="w-full px-4 py-3 bg-white border border-[#D9E2EC] rounded-xl text-sm text-[#102A43] placeholder:text-[#334E68]/60 focus:outline-none focus:ring-2 focus:ring-[#16B8B3] resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-4 px-6 bg-[#073B5C] hover:bg-[#0D5C91] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <span>Transmitting Inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Commercial Enquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-[#334E68] text-center leading-relaxed">
                    By submitting this form, you authorize Juno Healthcare Private Limited to respond to your inquiry via phone or email for commercial and distribution purposes.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
