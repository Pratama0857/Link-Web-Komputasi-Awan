/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Sparkles, 
  Bot, 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  CreditCard, 
  Check, 
  ChevronRight, 
  Info, 
  Tv, 
  Mic, 
  MapPin, 
  AlertTriangle,
  Flame,
  Clock,
  Heart,
  HelpCircle,
  Coffee,
  Ticket,
  Loader2,
  User,
  LogIn,
  LogOut,
  Compass,
  Crown
} from 'lucide-react';

import { Movie, Product, CartItem, OrderDetails, CinemaUser } from './types';
import { MOVIES, PRODUCTS } from './data';

import AIChatDrawer from './components/AIChatDrawer';
import SeatPicker from './components/SeatPicker';
import OrderTracker from './components/OrderTracker';
import ProductCard from './components/ProductCard';
import LoginScreen from './components/LoginScreen';

export default function App() {
  // Concession catalog & filter states
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Cart management states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Selected delivery position
  const [deliveryStudio, setDeliveryStudio] = useState('Studio 3');
  const [deliveryRow, setDeliveryRow] = useState('F');
  const [deliveryNumber, setDeliveryNumber] = useState('7');
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);

  // Active movie screening being watched (conveys context to Gemini AI recommender!)
  const [watchedMovie, setWatchedMovie] = useState<Movie | null>(null);

  // AI assistant drawer state
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [aiGreetingBadge, setAiGreetingBadge] = useState(true);

  // Checkout form fields
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'GoPay' | 'OVO' | 'Dana' | 'Virtual_Account'>('GoPay');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Active order tracking id (if the customer successfully placed an order)
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // User authentication state
  const [user, setUser] = useState<CinemaUser | null>(null);

  // Sync user state with customer name and phone
  useEffect(() => {
    if (user) {
      setCustName(user.name);
      setCustPhone(user.phone === 'Tamu-No-Phone' ? '' : user.phone);
    } else {
      setCustName('');
      setCustPhone('');
    }
  }, [user]);

  // Set default movie watched and show some cute visual details on start
  useEffect(() => {
    if (MOVIES.length > 0) {
      setWatchedMovie(MOVIES[0]); // default to first movie
    }
  }, []);

  const handleAddToCart = (product: Product, flavor?: string, size?: string) => {
    const itemFlavor = flavor || (product.flavors && product.flavors.length > 0 ? product.flavors[0] : '');
    const itemSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
    
    // Create unique cart identifier based on selection combination
    const cartItemId = `${product.id}-${itemFlavor}-${itemSize}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item => 
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, {
          id: cartItemId,
          product,
          quantity: 1,
          selectedFlavor: itemFlavor || undefined,
          selectedSize: itemSize || undefined
        }];
      }
    });

    // Make a glowing toast effect in the UI
    const floatBtn = document.getElementById('floating-cart-btn');
    if (floatBtn) {
      floatBtn.classList.add('animate-bounce');
      setTimeout(() => floatBtn.classList.remove('animate-bounce'), 1000);
    }
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty <= 0 ? null : { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = 0; // Free delivery directly to their theater seat!
  const tax = Math.round(subtotal * 0.1); // PB1 Goverment tax 10%
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) {
      setCheckoutError('Silakan masukkan Nama Anda untuk pelayan memanggil Anda.');
      return;
    }
    if (cart.length === 0) {
      setCheckoutError('Keranjang Anda kosong.');
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const orderPayload = {
        customerName: custName,
        customerPhone: custPhone,
        studioNumber: deliveryStudio,
        seatRow: deliveryRow,
        seatNumber: deliveryNumber,
        movieTitle: watchedMovie?.title || 'Film Sedang Berlangsung',
        items: cart.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          flavor: item.selectedFlavor,
          size: item.selectedSize,
          price: item.product.price
        })),
        subtotal,
        deliveryFee,
        tax,
        total,
        paymentMethod
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        throw new Error('Gagal menempatkan order ke bioskop.');
      }

      const completedOrder = await res.json();
      
      // Clear local states
      setCart([]);
      setIsCartOpen(false);
      setActiveOrderId(completedOrder.id);
    } catch (err: any) {
      console.error(err);
      setCheckoutError(err.message || 'Terjadi kesalahan eksternal.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSelectSeat = (studio: string, row: string, number: string) => {
    setDeliveryStudio(studio);
    setDeliveryRow(row);
    setDeliveryNumber(number);
  };

  // Filtered concessions menu catalog
  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen mesh-bg text-zinc-100 font-sans flex flex-col antialiased">
      {/* Top High-Contrast Cinematic Navbar */}
      <header className="sticky top-4 bg-[#07070a]/40 backdrop-blur-xl border border-white/10 z-40 mx-4 rounded-2xl px-4 py-3 sm:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex justify-between items-center" id="main-header">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-black border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.45)]">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5 uppercase font-mono">
              CineDine
              <span className="text-[9px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">2026</span>
            </h1>
            <p className="text-[10px] text-zinc-400 font-medium">Order Premium Beverage & Snacks ke Kursi Bioskop Anda</p>
          </div>
        </div>

        {/* Current Active Location Lock Banner */}
        <div 
          onClick={() => { if (!activeOrderId) setIsSeatModalOpen(true); }}
          className={`flex items-center gap-2 px-3 py-1.5 glass rounded-xl max-w-xs transition ${activeOrderId ? 'opacity-75 cursor-not-allowed' : 'hover:border-amber-500/30 cursor-pointer'}`}
          id="active-location-lock"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <div className="text-left font-mono">
            <p className="text-[8px] text-zinc-500 leading-none font-bold">POSISI ANTAR</p>
            <p className="text-[10px] text-zinc-200 font-bold leading-normal">
              {deliveryStudio} • Baris {deliveryRow}-{deliveryNumber}
            </p>
          </div>
          {!activeOrderId && <ChevronRight className="w-3 h-3 text-zinc-500 ml-1" />}
        </div>

        {/* Header Shopping Cart controls */}
        <div className="flex items-center gap-3">
          {/* Member Profile Widget */}
          {user && (
            <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl">
              <div className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center text-xs ${
                user.tier === 'PLATINUM_VIP' 
                  ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(251,191,36,0.4)]' 
                  : user.tier === 'GOLD'
                    ? 'bg-zinc-300 text-black'
                    : 'bg-zinc-700 text-white'
              }`}>
                {user.tier === 'PLATINUM_VIP' ? <Crown className="w-3 h-3 text-black font-extrabold" /> : <User className="w-3 h-3" />}
              </div>
              <div className="text-left hidden sm:block max-w-[90px]">
                <p className="text-[10px] font-bold text-white truncate leading-tight">{user.name.split(' ')[0]}</p>
                <p className="text-[7.5px] text-zinc-400 font-mono leading-none tracking-wide font-semibold uppercase">
                  {user.tier === 'PLATINUM_VIP' ? 'VIP' : user.tier === 'GOLD' ? 'GOLD' : 'TAMU'}
                  {user.points > 0 && ` • ${user.points} pt`}
                </p>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin keluar dari akun ini?')) {
                    setUser(null);
                  }
                }}
                className="p-1 text-zinc-500 hover:text-red-400 rounded transition ml-1 cursor-pointer"
                title="Keluar / Ganti Akun"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setIsAIDrawerOpen(true);
              setAiGreetingBadge(false);
            }}
            className="p-2.5 glass-accent hover:bg-amber-500/25 border border-amber-550/20 rounded-xl text-amber-500 flex items-center gap-1.5 relative transition duration-300 shadow-md cursor-pointer"
            id="ask-butler-badge-nav"
            title="Konsultasikan camilan ke Cinema AI Butler"
          >
            <Bot className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-250 hidden sm:inline">AI Butler</span>
            {aiGreetingBadge && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2.5 glass hover:bg-white/10 rounded-xl text-zinc-200 hover:text-white flex items-center gap-2 relative transition cursor-pointer"
            id="floating-cart-btn"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-zinc-950 shadow-lg">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-7">
               {/* If there is an active order, render the Order Tracker as primary screen space */}
        {activeOrderId ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center glass p-4 rounded-xl max-w-2xl mx-auto">
              <p className="text-xs text-zinc-400 font-medium">
                Sedang menikmati tontonan? Tracker kami melakukan sinkronisasi dengan concession counter secara berkelala.
              </p>
              <button
                onClick={() => {
                  if (confirm('Apakah Anda ingin memesan snack baru lainnya? Menghapus pelacak pesanan yang ada.')) {
                    setActiveOrderId(null);
                  }
                }}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-lg text-zinc-300 text-nowrap cursor-pointer transition border border-white/5"
              >
                Pesan Baru
              </button>
            </div>
            <OrderTracker orderId={activeOrderId} onNewOrder={() => setActiveOrderId(null)} />
          </div>
        ) : (
          /* OTHERWISE RENDER MAIN CATALOG AND MOVIE SELECTION SECTION */
          <div className="space-y-7" id="main-active-checkout-flow">
            
            {/* Banner: Screen Smart Assistant Recommendation Prompt */}
            <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 shadow-xl relative overflow-hidden" id="ai-smart-nudge">
              <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl"></div>
              <div className="flex gap-4 items-start">
                <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 mt-1 flex-shrink-0 animate-pulse">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded border border-amber-500/20">
                    Fitur Cerdas AI + Bioskop
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-white">Butuh Rekomendasi Camilan Sesuai Genre Film?</h2>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                    Asisten Concession AI kami dapat menganalisis genre film yang sedang Anda tonton dan memasangkan menu minuman-snack ternikmat (caramel popcorn, hotdog juicy, nachos pedas) agar menonton makin membekas!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAIDrawerOpen(true)}
                className="w-full md:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.25)] transition duration-350 flex items-center justify-center gap-2 active:scale-95 cursor-pointer uppercase border-transparent"
              >
                <Sparkles className="w-4 h-4 text-black" />
                Tanya AI Butler Sekarang
              </button>
            </div>
 
            {/* Select Movie watched panel */}
            <section className="space-y-3" id="movie-selection-section">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">1. PILIH FILM YANG SEDANG KAKAK TONTON</h3>
              </div>
              
              {/* Horizontal Scroll Movie Selection */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                {MOVIES.map(movie => {
                  const isSelected = watchedMovie?.id === movie.id;
                  return (
                    <div
                      key={movie.id}
                      onClick={() => setWatchedMovie(movie)}
                      className={`relative rounded-xl overflow-hidden pointer-events-auto transition duration-300 border flex flex-col justify-between cursor-pointer group ${
                        isSelected 
                          ? 'glass-accent ring-2 ring-amber-500/30 border-amber-500' 
                          : 'glass hover:border-white/15'
                      }`}
                    >
                      {/* Movie poster image or symbol mock as thumbnail */}
                      <div className="aspect-[4/3] w-full relative bg-zinc-950 overflow-hidden">
                        {movie.posterUrl ? (
                          <img 
                            src={movie.posterUrl} 
                            alt={movie.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-650 font-mono font-bold">CINEMA</div>
                        )}
                        <div className="absolute bottom-2 left-2 flex gap-1 select-none">
                          <span className="text-[8px] font-bold font-mono bg-zinc-950/80 text-amber-400 px-1 py-0.5 rounded border border-zinc-800/60 font-semibold uppercase">{movie.rating}</span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-400 transition">{movie.title}</h4>
                          <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{movie.genre}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-medium font-mono pt-1 border-t border-zinc-800/40">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{movie.duration}</span>
                        </div>
                      </div>

                      {/* Check dot selector */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 border border-amber-400 rounded-full flex items-center justify-center text-black text-xs font-extrabold shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Cinema Concession catalog */}
            <section className="space-y-4" id="concession-catalog-section">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">2. MENU CEMILAN BIOSKOP (CONCESSION CATALOG)</h3>
                </div>

                {/* Filters categories */}
                <div className="flex gap-1.5 overflow-x-auto select-none py-1 no-scrollbar-x pointer-events-auto">
                  {['All', 'Combos', 'Popcorn', 'Beverages', 'Snacks'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1 text-xs font-bold rounded-lg transition duration-200 cursor-pointer ${
                        activeCategory === cat 
                          ? 'glass-accent text-amber-500 border-l-2 border-l-amber-500 animate-fade-in' 
                          : 'glass text-white/70 hover:text-white'
                      }`}
                    >
                      {cat === 'All' ? 'Semua Menu' : cat === 'Combos' ? 'Spesial Combo' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concession product catalog Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(prod => (
                  <ProductCard 
                    key={prod.id} 
                    product={prod} 
                    onAddToCart={handleAddToCart} 
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>      {/* Floating Concession Assistant AI Action Button */}
      {!activeOrderId && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2" id="floating-ai-agent-fab">
          {aiGreetingBadge && (
            <div className="glass text-zinc-150 p-2.5 rounded-xl shadow-xl max-w-xs text-[11px] leading-relaxed relative flex items-start gap-2 animate-fade-in mb-1">
              <Bot className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                Tanya **CineBites AI** untuk mencocokkan popcorn ternikmat sesuai filmmu!
              </div>
              <button 
                onClick={() => setAiGreetingBadge(false)}
                className="text-zinc-500 hover:text-zinc-300 p-0.5 cursor-pointer ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setIsAIDrawerOpen(true);
              setAiGreetingBadge(false);
            }}
            className="p-4 bg-amber-500 hover:bg-amber-400 rounded-full text-black shadow-2xl transition duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center relative cursor-pointer group border-transparent shadow-amber-500/20"
            id="open-ai-chat-btn"
          >
            <Sparkles className="w-6 h-6 text-black group-hover:animate-bounce" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-extrabold font-mono ml-0 group-hover:ml-2">TANYA BUTLER AI</span>
          </button>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-auto py-6 border-t border-white/5 bg-[#040406]/30 text-zinc-500 text-xs text-center px-4 space-y-2">
        <p className="font-mono text-[10px] text-zinc-450">
          CineDine • Solusi Layanan Konsumsi Digital Mandiri Terakreditasi Bioskop Premium
        </p>
        <p className="text-[10px]">
          Copyright © 2026. Diantar dengan senyap menggunakan Runner Terlatih & Integritas Tinggi.
        </p>
      </footer>

      {/* SEAT PICKER MODAL - Location Setup */}
      {isSeatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" id="seat-modal">
          <div className="bg-black/60 border border-white/10 backdrop-blur-2xl rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono uppercase">
                <MapPin className="w-4 h-4 text-amber-500 animate-pulse" />
                Sewa / Set Kursi Pengantaran
              </h3>
              <button 
                onClick={() => setIsSeatModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[75vh]">
              <SeatPicker 
                selectedStudio={deliveryStudio}
                selectedRow={deliveryRow}
                selectedNumber={deliveryNumber}
                onSeatChange={handleSelectSeat}
              />
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 flex justify-end gap-2.5 animate-fade-in">
              <button
                onClick={() => setIsSeatModalOpen(false)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl cursor-pointer transition shadow-[0_0_12px_rgba(251,191,36,0.3)] uppercase"
              >
                Konfirmasi Lokasi Kursi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OUT PANEL: SHOPPING CART & SECURE CHECKOUT */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-xs animate-fade-in flex justify-end" id="shopping-cart-drawer">
          <div className="w-full max-w-md bg-black/60 backdrop-blur-2xl border-l border-white/10 h-full flex flex-col justify-between shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-500 animate-pulse" />
                <h3 className="text-sm font-bold text-white font-mono uppercase">Keranjang Camilan</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List items inside cart */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-6 select-none animate-fade-in">
                  <div className="p-4 glass rounded-full text-zinc-150 scale-105">
                    <ShoppingCart className="w-8 h-8 text-amber-550 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-350">Keranjang Masih Kosong</h4>
                    <p className="text-[10px] text-zinc-450 max-w-[200px] mt-1 leading-normal">
                      Apakah Anda terburu-buru masuk? Tambahkan popcorn hangat atau Milo Dinosaur lezat terlebih dahulu!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsAIDrawerOpen(true);
                    }}
                    className="mt-3 px-4 py-2 glass-accent rounded-xl text-xs text-amber-500 hover:text-amber-400 font-extrabold transition cursor-pointer flex items-center gap-1.5 shadow-md uppercase"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Tanya AI Rekomendator
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected items card lists */}
                  <div className="space-y-2.5">
                    <p className="text-[10px] text-zinc-550 font-bold font-mono uppercase tracking-wider">Item Terpilih ({cart.length})</p>
                    {cart.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-3 glass rounded-xl"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <h5 className="text-[11px] font-bold text-white truncate leading-snug">{item.product.name}</h5>
                          <p className="text-[10px] text-amber-500 font-bold font-mono tracking-wide mt-0.5">
                            Rp {item.product.price.toLocaleString('id-ID')}
                            {item.selectedSize && ` • ${item.selectedSize}`}
                            {item.selectedFlavor && ` • ${item.selectedFlavor}`}
                          </p>
                        </div>

                        {/* Qty counters */}
                        <div className="flex items-center gap-2.5 bg-zinc-950/40 px-2 py-1 rounded-lg border border-white/5">
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(item.id, -1)}
                            className="p-1 text-zinc-400 hover:text-amber-500 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-zinc-200 w-4 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(item.id, 1)}
                            className="p-1 text-zinc-400 hover:text-amber-500 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active delivery seat row display inline */}
                  <div className="glass rounded-xl p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[8px] text-amber-500 font-mono block font-bold uppercase tracking-wider">PENGANTARAN KE SEAT</span>
                      <p className="font-semibold text-zinc-200 mt-0.5">{deliveryStudio} • Baris {deliveryRow}-{deliveryNumber}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSeatModalOpen(true)}
                      className="px-2.5 py-1 text-[10px] text-amber-500 hover:bg-amber-550/10 rounded border border-amber-500/25 font-bold cursor-pointer"
                    >
                      Ubah Kursi
                    </button>
                  </div>

                  {/* SECURE CHECKOUT FORM SECTION */}
                  <form onSubmit={handlePlaceOrder} className="border-t border-white/5 pt-4 space-y-3.5 text-xs">
                    <p className="text-[10px] text-zinc-550 font-bold font-mono uppercase tracking-wider">Detail Pelanggan & Pembayaran</p>
                    
                    {/* Customer name */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-400 font-medium">Nama Pemesan <span className="text-amber-500 font-bold">*</span></label>
                      <input
                        type="text"
                        placeholder="Masukkan nama lengkap Anda..."
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-zinc-950/40 border border-white/10 rounded-lg text-xs font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/25 text-white"
                        id="customer-name-field"
                      />
                    </div>

                    {/* Customer Phone */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-400 font-medium">No. WhatsApp Pemesan</label>
                      <input
                        type="tel"
                        placeholder="Contoh: 08123456789..."
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950/40 border border-white/10 rounded-lg text-xs font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/25 text-white"
                      />
                    </div>

                    {/* Movie watching locked info */}
                    <div className="p-2.5 glass rounded-lg flex items-center justify-between text-[11px]">
                      <span className="text-zinc-550 font-bold font-mono text-[9px] tracking-wide">Mencocokkan Film:</span>
                      <span className="font-semibold text-zinc-100 truncate max-w-[200px]">{watchedMovie?.title || 'Film Sedang Berlangsung'}</span>
                    </div>

                    {/* Payment methods list */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                        Metode Pembayaran Online (Simulasi QRIS/E-Wallet)
                      </label>
                      <div className="grid grid-cols-2 gap-2 font-mono">
                        {[
                          { id: 'GoPay', name: 'GoPay' },
                          { id: 'OVO', name: 'OVO' },
                          { id: 'Dana', name: 'Dana' },
                          { id: 'Virtual_Account', name: 'VA Bank' }
                        ].map(pm => {
                          const isSelected = paymentMethod === pm.id;
                          return (
                            <button
                              key={pm.id}
                              type="button"
                              onClick={() => setPaymentMethod(pm.id as any)}
                              className={`p-2.5 rounded-lg border text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
                                isSelected 
                                  ? 'border-amber-500 bg-amber-500/10 text-amber-400' 
                                  : 'border-white/10 bg-zinc-950/40 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <span>{pm.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {checkoutError && (
                      <div className="p-2.5 bg-red-950/20 border border-red-900/30 text-rose-400 rounded-lg text-[11px]">
                        ⚠️ {checkoutError}
                      </div>
                    )}
                  </form>
                </div>
              )}
            </div>

            {/* Bottom Checkout Panel Pricing bar */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-white/5 bg-zinc-950/60 space-y-3">
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Biaya Subtotal Camilan</span>
                    <span className="font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Pengantaran ke Kursi</span>
                    <span className="font-mono text-green-500 font-bold">Gratis (Promo)</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Pajak Restoran PB1 (10%)</span>
                    <span className="font-mono">Rp {tax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2 text-white font-black text-sm">
                    <span>Total Pembayaran</span>
                    <span className="font-mono text-amber-500">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isCheckingOut || !custName.trim()}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-98 text-black text-xs font-mono font-black rounded-xl transition duration-200 mt-2 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase shadow-[0_0_20px_rgba(251,191,36,0.35)]"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Memproses Securing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Bayar & Antar ke {deliveryStudio}: {deliveryRow}-{deliveryNumber}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REACTIVE DRAWER CONTAINER: AI CONCESSION BUTLER */}
      <AIChatDrawer 
        movie={watchedMovie} 
        isOpen={isAIDrawerOpen} 
        onClose={() => setIsAIDrawerOpen(false)} 
        onAddToCart={(product, fav, size) => {
          handleAddToCart(product, fav, size);
          // Auto trigger simple friendly feedback that recommendation got pulled!
          setIsAIDrawerOpen(false);
          setIsCartOpen(true);
        }}
      />
    </div>
  );
}
