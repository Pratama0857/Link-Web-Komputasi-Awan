/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Truck, CheckCircle2, Flame, Loader2, Sparkles, Navigation, Clock, Receipt, RefreshCw, AlertCircle } from 'lucide-react';
import { OrderDetails } from '../types';

interface OrderTrackerProps {
  orderId: string;
  onNewOrder: () => void;
}

export default function OrderTracker({ orderId, onNewOrder }: OrderTrackerProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(120);

  // Poll order status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          throw new Error('Gagal memuat status pesanan');
        }
        const data = await res.json();
        setOrder(data);
        setError(null);

        // Adjust remaining simulation countdown
        const elapsed = (new Date().getTime() - new Date(data.createdAt).getTime()) / 1000;
        const remaining = Math.max(0, Math.round(120 - elapsed));
        setCountdown(remaining);

        // Stop polling if delivered
        if (data.status === 'Delivered') {
          clearInterval(intervalId);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
    intervalId = setInterval(fetchOrderDetails, 3000);

    return () => clearInterval(intervalId);
  }, [orderId]);

  // Handle countdown clock ticker
  useEffect(() => {
    if (countdown <= 0 || order?.status === 'Delivered') return;
    const cdId = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(cdId);
  }, [countdown, order]);

  // Map progress phases
  const getStepStatusClass = (step: 'Received' | 'Preparing' | 'In_Transit' | 'Delivered', currentStatus: string) => {
    const statusSequence = ['Received', 'Preparing', 'In_Transit', 'Delivered'];
    const stepIndex = statusSequence.indexOf(step);
    const currentIndex = statusSequence.indexOf(currentStatus);

    if (currentIndex > stepIndex) {
      return 'bg-amber-500 text-black border-amber-400 font-bold'; // finished
    } else if (currentIndex === stepIndex) {
      return 'bg-amber-550/10 text-amber-550 border-amber-500 font-bold animate-pulse shadow-[0_0_14px_rgba(251,191,36,0.5)]'; // current
    } else {
      return 'bg-zinc-950/40 text-zinc-650 border-white/5'; // upcoming
    }
  };

  const getProgressWidthClass = (status: string) => {
    switch (status) {
      case 'Received': return 'w-[10%]';
      case 'Preparing': return 'w-[45%]';
      case 'In_Transit': return 'w-[75%]';
      case 'Delivered': return 'w-full';
      default: return 'w-[0%]';
    }
  };

  if (loading && !order) {
    return (
      <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center space-y-4" id="order-tracker-loading">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-sm text-zinc-400 font-medium">Menghubungkan ke Concession counter bioskop...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center space-y-4" id="order-tracker-error">
        <AlertCircle className="w-8 h-8 text-amber-500" />
        <p className="text-sm text-zinc-300">Gagal melacak pesanan Anda saat ini.</p>
        <button 
          onClick={onNewOrder}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl cursor-pointer shadow-[0_4px_12px_rgba(251,191,36,0.25)]"
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-6 max-w-2xl mx-auto focus-mode-order-tracker" id="order-tracker-panel">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono px-2.5 py-1 rounded-full border border-amber-500/20 font-bold uppercase tracking-wider">
            PESANAN AKTIF DILACAK
          </span>
          <h3 className="text-lg font-bold text-white mt-2 flex items-center gap-2">
            No. Nota: <span className="font-mono text-amber-500">{order.id}</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Studio {order.studioNumber} • Baris {order.seatRow} - Kursi {order.seatNumber}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
          <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
          <div>
            <p className="text-[10px] text-zinc-500 font-bold tracking-wide">ESTIMASI TIBA DI KURSI</p>
            <p className="text-sm font-mono font-bold text-white">
              {order.status === 'Delivered' ? 'Sudah Tiba' : `${Math.floor(countdown / 60)}m ${countdown % 60}s`}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Progress Steps Map */}
      <div className="relative pt-3 pb-2 px-1">
        {/* Background Line */}
        <div className="absolute top-7 left-6 right-6 h-1.5 bg-zinc-950 rounded-full">
          <div className={`h-full bg-amber-500 rounded-full transition-all duration-1000 ${getProgressWidthClass(order.status)}`} />
        </div>

        {/* Step Circles */}
        <div className="relative flex justify-between">
          {/* Step 1: Received */}
          <div className="flex flex-col items-center space-y-2.5 max-w-[80px] text-center">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition duration-500 ${getStepStatusClass('Received', order.status)}`}>
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-100">Diterima</p>
              <p className="text-[8px] text-zinc-500 mt-0.5">Antrean Masuk</p>
            </div>
          </div>

          {/* Step 2: Preparing */}
          <div className="flex flex-col items-center space-y-2.5 max-w-[80px] text-center">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition duration-500 ${getStepStatusClass('Preparing', order.status)}`}>
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-100">Disiapkan</p>
              <p className="text-[8px] text-zinc-500 mt-0.5">Concession Kitchen</p>
            </div>
          </div>

          {/* Step 3: In Transit */}
          <div className="flex flex-col items-center space-y-2.5 max-w-[80px] text-center">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition duration-500 ${getStepStatusClass('In_Transit', order.status)}`}>
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-100">Diantar</p>
              <p className="text-[8px] text-zinc-500 mt-0.5">Oleh Runner</p>
            </div>
          </div>

          {/* Step 4: Delivered */}
          <div className="flex flex-col items-center space-y-2.5 max-w-[80px] text-center">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition duration-500 ${getStepStatusClass('Delivered', order.status)}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-100">Selesai</p>
              <p className="text-[8px] text-zinc-500 mt-0.5">Tiba di Kursi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Status Detail Card */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
        <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-2 mb-2 font-mono uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Status Detail
        </h4>
        
        {order.status === 'Received' && (
          <p className="text-xs text-zinc-400 leading-relaxed">
            Pesanan Anda telah diterima oleh petugas bioskop. Saat ini sedang antre untuk diproses cepat. Snack hangat bermutu tinggi siap meluncur ke panggung pertunjukan Anda segera!
          </p>
        )}
        {order.status === 'Preparing' && (
          <p className="text-xs text-zinc-400 leading-relaxed">
            Koki concession kami sedang memanaskan Popcorn segar Anda dan meracik minuman dengan es batu dingin kristal melimpah. Harap tetap nyaman duduk menatap layar lebar!
          </p>
        )}
        {order.status === 'In_Transit' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400 leading-relaxed">
              <strong className="text-amber-500">Runner Bioskop siap meluncur!</strong> Runner kami sedang berjalan masuk menyusuri lorong gelap Studio <span className="text-amber-500 font-bold">{order.studioNumber}</span> menuju baris kursi <span className="text-amber-500 font-bold">{order.seatRow}-{order.seatNumber}</span> dengan bungkusan camilan harum Anda.
            </p>
            <div className="p-2.5 glass-accent rounded-lg border text-[10px] text-amber-200">
              💡 **Tips Gelap**: Nyalakan sedikit permukaan layar ponsel Anda menghadap ke bawah agar runner mendeteksi posisi duduk Anda dengan akurat tanpa menyilaukan penonton lain.
            </div>
          </div>
        )}
        {order.status === 'Delivered' && (
          <div className="space-y-2">
            <p className="text-xs text-amber-400 font-bold leading-relaxed">
              🎉 Selamat Menikmati! Snack telah sampai di tangan Anda secara selamat dan hangat.
            </p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Runner kami telah menyerahkan camilan langsung ke kursi Anda dengan senyap. Terima kasih telah memesan melalui CineDine! Semoga sukses dan selamat menikmati filmnya.
            </p>
          </div>
        )}
      </div>

      {/* Bill Items Summary */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-white">Rincian Camilan</h4>
        <div className="bg-white/5 rounded-xl border border-white/5 p-3.5 space-y-2.5">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-zinc-100">{item.name}</span>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Qty: {item.quantity} • {item.size || 'Regular'} {item.flavor ? `• ${item.flavor}` : ''}
                </p>
              </div>
              <span className="font-mono text-zinc-300">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
            </div>
          ))}

          <div className="border-t border-white/5 pt-2.5 space-y-1.5 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>Biaya Subtotal</span>
              <span className="font-mono">Rp {order.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Pengantaran ke Kursi</span>
              <span className="font-mono text-green-500">Gratis (Promo)</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak Restoran & Layanan PB1 (10%)</span>
              <span className="font-mono">Rp {order.tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-2 text-white font-bold">
              <span>Total Pembayaran ({order.paymentMethod})</span>
              <span className="font-mono text-amber-550">Rp {order.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Controls */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={onNewOrder}
          className="flex-1 sm:flex-initial px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl text-center cursor-pointer transition border border-white/5"
        >
          Pesan Camilan Tambahan
        </button>
      </div>
    </div>
  );
}
