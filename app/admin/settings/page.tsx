'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Lock, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { validatePasswordStrength } from '@/lib/auth';

export default function AdminSettingsPage() {
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Independent Eye Visibility Toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings State
  const [phone, setPhone] = useState('+91 9743094555');
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('junohealthcare.in');
  const [address, setAddress] = useState('Mumbai, Maharashtra, India');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load existing site settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/company');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setPhone(json.data.officialPhone || '+91 9743094555');
            setEmail(json.data.officialEmail || '');
            setDomain(json.data.domain || 'junohealthcare.in');
            setAddress(json.data.registeredOffice || 'Mumbai, Maharashtra, India');
          }
        }
      } catch {
        // Fallback to default verified values
      }
    }
    loadSettings();
  }, []);

  // Real-time password criteria evaluation
  const hasMinLength = newPassword.length >= 12;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    const strengthCheck = validatePasswordStrength(newPassword);
    if (!strengthCheck.isValid) {
      setPasswordFeedback({ type: 'error', message: strengthCheck.message || 'Please ensure all password security requirements are met.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('juno_admin_token') : '';
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordFeedback({ type: 'success', message: 'Administrator password successfully updated and securely hashed with Argon2id.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordFeedback({ type: 'error', message: data.error || 'Failed to update password.' });
      }
    } catch {
      setPasswordFeedback({ type: 'error', message: 'Connection error while updating password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsFeedback(null);

    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('juno_admin_token') : '';
      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          officialPhone: phone,
          officialEmail: email,
          domain: domain,
          registeredOffice: address
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsFeedback({ type: 'success', message: 'Official company coordinates successfully updated and published.' });
      } else {
        setSettingsFeedback({ type: 'error', message: data.error || 'Failed to update company coordinates.' });
      }
    } catch {
      setSettingsFeedback({ type: 'error', message: 'Network error while updating settings.' });
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="pb-6 border-b border-slate-200">
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block">
          Platform Security & Administration
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
          Owner Control & Security Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure administrative credentials, access control, and verified public communication coordinates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Change Administrator Password */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-slate-800">
              <Key className="w-4 h-4 text-sky-600" />
              <span>Change Administrator Password</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
              Argon2id Protected
            </span>
          </div>

          {passwordFeedback && (
            <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
              passwordFeedback.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}>
              {passwordFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{passwordFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            {/* Current Password Field */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter existing administrator password"
                  className="w-full pl-3.5 pr-11 py-2.5 border border-slate-200 rounded-xl font-mono text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimum 12 characters"
                  className="w-full pl-3.5 pr-11 py-2.5 border border-slate-200 rounded-xl font-mono text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full pl-3.5 pr-11 py-2.5 border border-slate-200 rounded-xl font-mono text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Policy Checklist */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-[11px]">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                Enterprise Password Requirements:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-medium">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasMinLength ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>12+ characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasUpperCase ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>Uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLowerCase ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasLowerCase ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>Lowercase letter (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>Numerical digit (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecialChar ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasSpecialChar ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>Special symbol (!@#$...)</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading || !isPasswordValid}
              className="w-full py-3 bg-[#073B5C] hover:bg-[#04243A] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-xs"
            >
              <Lock className="w-4 h-4 text-[#16B8B3]" />
              <span>{passwordLoading ? 'Hashing with Argon2id & Saving...' : 'Change Password'}</span>
            </button>
          </form>
        </div>

        {/* Card 2: Official Company Communication Coordinates */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100">
            <Mail className="w-4 h-4 text-sky-600" />
            <span>Configurable Official Coordinates</span>
          </div>

          {settingsFeedback && (
            <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
              settingsFeedback.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}>
              {settingsFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{settingsFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSaveContactSettings} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Official Verified Phone</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono text-sm text-slate-900"
                />
              </div>
              <span className="text-[11px] text-slate-500 block">Verified company telephone: +91 9743094555</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Official Contact Email</label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. info@junohealthcare.in (configured by admin)"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <span className="text-[11px] text-slate-500 block">
                Leave empty until official domain email is established. Public pages will show neutral placeholder.
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Official Domain</label>
              <input
                type="text"
                required
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Registered Office Location</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={settingsLoading}
              className="w-full py-3 bg-[#16B8B3] hover:bg-[#129B97] text-[#073B5C] font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{settingsLoading ? 'Saving...' : 'Update Public Coordinates'}</span>
            </button>
          </form>
        </div>

      </div>

      {/* Database & Security Compliance Status Box */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-sky-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Statutory Data & Security Compliance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-sans text-[10px] block">Corporate Identity Number</span>
            <span className="text-sky-300 font-bold text-sm">U46497MR2026PTC474137</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-sans text-[10px] block">Registrar of Companies</span>
            <span className="text-white font-bold text-sm">ROC Mumbai II</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-sans text-[10px] block">Incorporation Date</span>
            <span className="text-white font-bold text-sm">06/03/2026</span>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-400 space-y-1 leading-relaxed">
          <p>
            • <strong>Single Source of Truth:</strong> PostgreSQL database backend with B-Tree indexes and Row Level Security.
          </p>
          <p>
            • <strong>Secure Object Storage:</strong> High-res packaging imagery and analytical certificates stored in unified object storage with 15MB file cap.
          </p>
          <p>
            • <strong>Soft Deletion:</strong> Archived records are preserved in the database and can be restored at any time by authorized administrators.
          </p>
        </div>
      </div>

    </div>
  );
}
