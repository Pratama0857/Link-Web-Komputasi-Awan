/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Flame, HelpCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product, flavor?: string, size?: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    product.flavors && product.flavors.length > 0 ? product.flavors[0] : ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedFlavor || undefined, selectedSize || undefined);
  };

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col hover:border-amber-500/30 transition duration-300 hover:shadow-[0_4px_22px_rgba(251,191,36,0.08)]" id={`product-card-${product.id}`}>
      {/* Product Image Panel */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover hover:scale-105 transition duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-650 bg-zinc-900/30 border-b border-white/5 font-bold text-xs font-mono uppercase">
            CINE MENU
          </div>
        )}

        {/* Hot Popular / Combo Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 select-none">
          {product.popular && (
            <span className="text-[9px] bg-amber-500 text-black font-extrabold font-mono uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
              <Flame className="w-2.5 h-2.5 fill-black" />
              Favorit
            </span>
          )}
          {product.category === 'Combos' && (
            <span className="text-[9px] bg-white text-black font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md">
              Hemat Combo
            </span>
          )}
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5">
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">{product.name}</h4>
            <span className="text-[10px] text-amber-500 font-bold tracking-wide uppercase font-mono">{product.category}</span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2">{product.description}</p>
        </div>

        {/* Custom Configuration: Flavors & Size options inside the card */}
        {(product.flavors || product.sizes) && (
          <div className="border-t border-white/5 pt-2.5 space-y-2">
            {product.flavors && product.flavors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-zinc-500 w-10 font-mono">Rasa:</span>
                <div className="flex flex-wrap gap-1">
                  {product.flavors.map(flavor => (
                    <button
                      key={flavor}
                      type="button"
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`text-[9px] px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                        selectedFlavor === flavor
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-white/5 text-zinc-400 border border-transparent hover:text-white'
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-zinc-500 w-10 font-mono">Ukuran:</span>
                <div className="flex gap-1">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`text-[9px] px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                        selectedSize === size
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-white/5 text-zinc-400 border border-transparent hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Panel pricing and Add to cart */}
        <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-auto">
          <div>
            <span className="text-[8px] text-zinc-500 font-mono font-bold tracking-wider">HARGA MENU</span>
            <p className="text-sm font-mono font-bold text-amber-500">Rp {product.price.toLocaleString('id-ID')}</p>
          </div>
          <button
            onClick={handleAddToCartClick}
            className="p-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition duration-250 cursor-pointer shadow-[0_2px_12px_rgba(251,191,36,0.3)]"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Pesan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
