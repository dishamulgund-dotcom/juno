'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: credentials.password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('juno_admin_token', data.token);
        router.push('/admin');
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04243A] text-white flex flex-col justify-between p-4 sm:p-6 select-none">
      
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-[#48D4D2] font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#16B8B3]" />
          <span>CIN: U46497MR2026PTC474137 • ROC Mumbai II</span>
        </div>
        <Link href="/" className="hover:text-white transition-colors">
          ← Return to Public Website
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-8 bg-[#073B5C] border border-[#0B4C74] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
        
        {/* Logo Container */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-[200px] h-[60px] bg-white rounded-2xl p-2 shadow-md">
            <Image
              src="/images/juno-logo.png"
              alt="Juno Healthcare Private Limited Logo"
              fill
              priority
              sizes="200px"
              className="object-contain p-1"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Administrative Console
            </h1>
            <p className="text-xs text-[#F3F9FB]/70 mt-1">
              Authorized compliance and operations management
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F3F9FB] uppercase tracking-wider block">
              Administrator Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={credentials.password}
                onChange={e => setCredentials({ password: e.target.value })}
                placeholder="Enter administrator password"
                className="w-full pl-4 pr-12 py-3.5 bg-[#04243A] border border-[#0B4C74] rounded-xl text-white placeholder:text-[#F3F9FB]/40 focus:outline-none focus:ring-2 focus:ring-[#16B8B3] text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F3F9FB]/60 hover:text-white p-1 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#16B8B3] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-[#F3F9FB]/60 block pt-1">
              Encrypted enterprise access control
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#16B8B3] to-[#0D5C91] hover:from-[#48D4D2] hover:to-[#16B8B3] text-[#073B5C] hover:text-[#04243A] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Policy Footer */}
        <div className="pt-4 border-t border-[#0B4C74] text-center text-[11px] text-[#F3F9FB]/60">
          <span>Encrypted Session • Argon2id Adaptive Security</span>
        </div>

      </div>

      {/* Bottom Legal Tag */}
      <div className="max-w-7xl mx-auto w-full text-center text-[11px] text-[#F3F9FB]/50 font-mono">
        Juno Healthcare Private Limited © 2026 • Confidential Internal Portal
      </div>

    </div>
  );
}
