/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Plus, Loader2, RefreshCw } from 'lucide-react';
import { AIChatMessage, Movie, Product } from '../types';
import { PRODUCTS } from '../data';

interface AIChatDrawerProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, flavor?: string, size?: string) => void;
}

export default function AIChatDrawer({ movie, isOpen, onClose, onAddToCart }: AIChatDrawerProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      sender: 'ai',
      text: 'Halo Kak! Saya **Asisten CineBites** siap melayani pemesanan makanan & minuman lezat siap antar ke kursi Anda. 🍿\n\nSedang nonton atau berencana nonton apa hari ini? Tulis juga jika Kakak punya request khusus (misal: "suka pedas", "rasa karamel", atau "butuh yang hangat"). Saya carikan paket paling pas!',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [mood, setMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle active movie context changes
  useEffect(() => {
    if (movie && isOpen) {
      // Send a welcoming contextual nudge about the selected movie
      const introMessage = `Kakak memilih menonton film **${movie.title}** (${movie.genre}). Pilihan yang luar biasa!\n\nApakah Kakak menyukai jenis camilan manis pemanja lidah, nachos dengan lumatan keju gurih melimpah, atau combo horor seru? Beritahu saya suasana hati Kakak, agar saya carikan menu bioskop paling cocok untuk film ini! 🎬`;
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: introMessage,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [movie]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !mood) return;

    const userMsgText = inputText.trim() || `Rekomendasikan menu yang cocok untuk mood: "${mood}"`;
    const userMsg: AIChatMessage = {
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieTitle: movie?.title || '',
          genre: movie?.genre || '',
          mood: mood || '',
          userMessage: userMsgText,
          chatHistory: messages.slice(-6).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();
      
      const aiReply: AIChatMessage = {
        sender: 'ai',
        text: data.reply || 'Maaf Kak, asisten CineBites sedang sibuk. Kami merekomendasikan Popcorn Caramel Manis terlaris kami!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        suggestedItems: data.suggestedItemIds || []
      };

      setMessages(prev => [...prev, aiReply]);
      if (mood) setMood(''); // Clear instant mood prompt once used
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Mohon maaf Kak, sinyal di dalam ruangan teater bioskop agak tersendat. Namun jangan khawatir, pelayan kami merekomendasikan **Combo Horor Jantungan** (popcorn asin besar dan keripik nachos keju pedas) sebagai teman terbaik Anda!',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          suggestedItems: ['p-combo1']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickMoodClick = (selectedMood: string) => {
    setMood(selectedMood);
    setInputText(`Saya sedang mood yang "${selectedMood}". Berikan menu cemilan pas Kak!`);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Helper to retrieve match concession products
  const getProductById = (id: string): Product | undefined => {
    return PRODUCTS.find(p => p.id === id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-black/60 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col focus-mode-ai-drawer" id="ai-chat-drawer">
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/25 animate-pulse" id="ai-icon">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Concession Butler AI
              <span className="text-[10px] bg-amber-500/20 text-amber-400 font-mono px-1.5 py-0.5 rounded border border-amber-500/20">CineBites</span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium">Siap mencarikan camilan terbaik Anda</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          id="close-drawer-btn"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Movie Banner */}
      {movie && (
        <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-10 rounded overflow-hidden flex-shrink-0 border border-white/5">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[8px] text-zinc-500">POSTER</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-amber-500 font-mono tracking-wider font-bold">MENONTON FILM</p>
            <h4 className="text-xs font-semibold text-white truncate">{movie.title}</h4>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-950/40 custom-scrollbar">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-amber-500">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div className="space-y-2">
              <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-amber-500 text-black font-bold rounded-tr-none shadow-[0_3px_12px_rgba(251,191,36,0.3)]' 
                  : 'glass text-zinc-100 rounded-tl-none'
              }`}>
                {/* Parse basic markdown like **text** and newlines */}
                <div className="whitespace-pre-wrap">
                  {msg.text.split('\n').map((line, lIdx) => (
                    <p key={lIdx} className={lIdx > 0 ? 'mt-1.5' : ''}>
                      {line.split('**').map((part, pIdx) => 
                        pIdx % 2 === 1 ? <strong key={pIdx} className="text-amber-400 font-bold">{part}</strong> : part
                      )}
                    </p>
                  ))}
                </div>
              </div>

              {/* Render Recommended Products if any exist */}
              {msg.sender === 'ai' && msg.suggestedItems && msg.suggestedItems.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <p className="text-[10px] text-amber-500 font-mono tracking-wider font-bold">REKOMENDASI CAMILAN:</p>
                  <div className="space-y-2">
                    {msg.suggestedItems.map(itemId => {
                      const prod = getProductById(itemId);
                      if (!prod) return null;
                      return (
                        <div 
                          key={itemId}
                          className="flex items-center gap-2.5 p-2 glass rounded-xl hover:border-amber-500/25 transition"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/10">
                            {prod.imageUrl ? (
                              <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px]">SNACK</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 text-[11px]">
                            <h5 className="font-semibold text-zinc-100 truncate">{prod.name}</h5>
                            <p className="text-amber-400 font-mono font-bold">Rp {prod.price.toLocaleString('id-ID')}</p>
                          </div>
                          <button
                            onClick={() => onAddToCart(prod, prod.flavors?.[0], prod.sizes?.[0])}
                            className="p-1 px-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-[0_2px_8px_rgba(251,191,36,0.3)]"
                          >
                            <Plus className="w-3 h-3" />
                            Pesan
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <span className="text-[9px] text-zinc-500 block px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 animate-spin">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="p-3 glass text-zinc-400 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span className="font-medium">Membuat racikan snack terbaik untuk Anda...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2 border-t border-white/5 bg-zinc-950 flex gap-2 overflow-x-auto select-none no-scrollbar">
        {['Takut/Tegang 😱', 'Manis Romantis 🥰', 'Gurih Nagih 🍿', 'Sangat Haus 🥤'].map((m) => (
          <button
            key={m}
            onClick={() => handleQuickMoodClick(m)}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/5 rounded-full text-xs text-zinc-300 hover:text-white whitespace-nowrap transition cursor-pointer"
          >
            {m}
          </button>
        ))}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900/60 border-t border-white/5 flex gap-2 items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tanyakan resep snack bioskop..."
          className="flex-1 px-4 py-2 bg-zinc-950/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 placeholder-zinc-500 text-xs"
          disabled={isLoading}
          id="ai-text-input"
        />
        <button
          type="submit"
          className="p-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition flex items-center justify-center disabled:opacity-50 disabled:hover:bg-amber-500 cursor-pointer shadow-md"
          disabled={isLoading || !inputText.trim()}
          id="ai-send-btn"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
