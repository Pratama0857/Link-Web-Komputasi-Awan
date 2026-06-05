/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Ticket, 
  LogIn, 
  User, 
  Phone, 
  Sparkles, 
  Bookmark, 
  Crown, 
  ShieldCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import { CinemaUser } from '../types';

interface LoginScreenProps {
  onLogin: (user: CinemaUser) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'membership' | 'guest'>('membership');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [pinNumber, setPinNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Pre-configured elegant VIP/Gold accounts for demonstration
  const demoAccounts: { name: string; phone: string; tier: 'GOLD' | 'PLATINUM_VIP'; memberId: string; points: number; bg: string; badge: string; text: string; border: string }[] = [
    {
      name: 'Alexander Pratama',
      phone: '081199882233',
      tier: 'PLATINUM_VIP',
      memberId: 'CD-992-PLATINUM',
      points: 1250,
      bg: 'from-amber-600/20 via-yellow-600/10 to-amber-950/40',
      border: 'border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.15)]',
      badge: 'bg-amber-500 text-black',
      text: 'text-amber-400'
    },
    {
      name: 'Aisyah Rahmadani',
      phone: '081244558899',
      tier: 'GOLD',
      memberId: 'CD-411-GOLD',
      points: 480,
      bg: 'from-zinc-700/25 via-zinc-800/15 to-zinc-900/40',
      border: 'border-zinc-400/40 shadow-[0_0_15px_rgba(228,228,231,0.08)]',
      badge: 'bg-zinc-350 text-black font-semibold',
      text: 'text-zinc-300'
    }
  ];

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'membership') {
      if (!phoneNumber.trim()) {
        setError('Silakan masukkan nomor telepon keanggotaan Anda.');
        return;
      }
      if (!pinNumber || pinNumber.length < 4) {
        setError('PIN Keanggotaan harus minimal 4 angka sandi.');
        return;
      }

      // Simulate match with demo accounts or register new
      const foundDemo = demoAccounts.find(acc => acc.phone === phoneNumber.trim());
      if (foundDemo) {
        onLogin({
          name: foundDemo.name,
          phone: foundDemo.phone,
          tier: foundDemo.tier,
          memberId: foundDemo.memberId,
          points: foundDemo.points
        });
      } else {
        // Automatically create a nice new Member Gold account for them!
        onLogin({
          name: fullName.trim() || 'Pelanggan Setia CineDine',
          phone: phoneNumber.trim(),
          tier: 'GOLD',
          memberId: `CD-${Math.floor(100 + Math.random() * 900)}-GOLD`,
          points: 100 // Welcome points!
        });
      }
    } else {
      // Guest login
      if (!fullName.trim()) {
        setError('Masukan Nama Anda untuk pemanggilan pengantaran snack.');
        return;
      }
      onLogin({
        name: fullName.trim(),
        phone: phoneNumber.trim() || 'Tamu-No-Phone',
        tier: 'GUEST',
        memberId: 'CD-GUEST',
        points: 0
      });
    }
  };

  const handleDemoSelect = (account: typeof demoAccounts[0]) => {
    onLogin({
      name: account.name,
      phone: account.phone,
      tier: account.tier,
      memberId: account.memberId,
      points: account.points
    });
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col justify-center items-center py-10 px-4 antialiased text-zinc-100 select-none animate-fade-in">
      
      {/* Decorative Blur Ambient Lights */}
      <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-orange-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Glass Card */}
      <div className="relative w-full max-w-lg glass border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col gap-6">
        
        {/* Amber Gradient Top Border Ambient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/25 via-amber-500 to-amber-500/25"></div>

        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-black border border-amber-450/30 shadow-[0_0_25px_rgba(251,191,36,0.55)]">
              <Ticket className="w-8 h-8 stroke-[1.8]" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2 uppercase font-mono">
              CINE<span className="text-amber-500">DINE</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">2026</span>
            </h1>
            <p className="text-xs text-zinc-400 font-medium max-w-sm mx-auto mt-1 leading-relaxed">
              Order Premium Snack, Beverage & Popcorn Langsung ke Kursi Teater Bioskop Premium Anda
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-1.5 bg-black/40 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => { setActiveTab('membership'); setError(null); }}
            className={`w-full py-2.5 rounded-lg text-xs font-bold font-mono transition duration-300 uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'membership' 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            Keanggotaan VIP
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('guest'); setError(null); }}
            className={`w-full py-2.5 rounded-lg text-xs font-bold font-mono transition duration-300 uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'guest' 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Masuk Tamu (Guest)
          </button>
        </div>

        {/* DEMO ACCOUNTS SLIDEOUT SHEET (Exclusive to Member Tab) */}
        {activeTab === 'membership' && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-zinc-400 px-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-[10px] font-bold uppercase tracking-wider font-mono">PILIH LOGIN DEMO CEPAT (SANGAT DIREKOMENDASIKAN)</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoAccounts.map((account) => (
                <div
                  key={account.memberId}
                  onClick={() => handleDemoSelect(account)}
                  className={`relative p-3.5 bg-gradient-to-br ${account.bg} border rounded-2xl flex flex-col justify-between h-28 cursor-pointer transition duration-300 transform hover:scale-[1.02] hover:border-amber-400 bg-black/40 select-none ${account.border}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded font-mono uppercase ${account.badge}`}>
                      {account.tier.replace('_', ' ')}
                    </span>
                    <Crown className={`w-4 h-4 ${account.text}`} />
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">{account.name}</h4>
                    <p className="text-[9px] text-zinc-400 font-mono mt-0.5">{account.phone}</p>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono border-t border-white/5 pt-1.5 mt-1">
                    <span className="text-zinc-500">POIN: <strong className={account.text}>{account.points} pt</strong></span>
                    <span className="text-zinc-400 hover:underline flex items-center gap-0.5">
                      Gunakan <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Login Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4">
          <div className="flex items-center gap-1 px-1">
            <LogIn className="w-3.5 h-3.5 text-amber-500" />
            <h4 className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider">
              {activeTab === 'membership' ? 'Atau Masuk Keanggotaan Sendiri' : 'Masukkan Identitas Tamu'}
            </h4>
          </div>

          <div className="space-y-3.5">
            {/* If tab is guest or custom member sign up */}
            {(activeTab === 'guest' || activeTab === 'membership') && (
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500/70" />
                  Nama Lengkap Pemesan <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama Anda..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950/40 border border-white/10 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/25 text-white transition"
                />
              </div>
            )}

            {/* Phone input */}
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-500/70" />
                Nomor Telepon (WhatsApp) {activeTab === 'membership' && <span className="text-amber-500">*</span>}
              </label>
              <input
                type="tel"
                required={activeTab === 'membership'}
                placeholder="Contoh: 08123456789..."
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950/40 border border-white/10 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/25 text-white transition"
              />
            </div>

            {/* PIN input (Member only) */}
            {activeTab === 'membership' && (
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500/70" />
                  PIN Passphrase / Sandi Keanggotaan <span className="text-amber-500">*</span>
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="PIN Member Anda (4-6 Angka)..."
                  value={pinNumber}
                  onChange={(e) => setPinNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 bg-zinc-950/40 border border-white/10 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/25 text-white transition tracking-widest text-center"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] p-3 rounded-xl flex items-center gap-2 animate-fade-in font-medium">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.3)] transition duration-300 transform active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer border border-transparent"
          >
            <span>Lanjutkan Layanan CineDine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Small Trust Info badge footer */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-medium text-center border-t border-white/5 pt-4 mt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500/50" />
          <span>Layanan Terenkripsi & Terintegrasi Sistem Bioskop Premium</span>
        </div>
      </div>
    </div>
  );
}
