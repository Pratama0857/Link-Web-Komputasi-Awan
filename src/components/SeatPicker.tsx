/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Armchair, CheckCircle2, AlertCircle } from 'lucide-react';

interface SeatPickerProps {
  selectedStudio: string;
  selectedRow: string;
  selectedNumber: string;
  onSeatChange: (studio: string, row: string, number: string) => void;
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const SEATS_PER_ROW = 10;

// Predefined set of preoccupied seats to make theater look realistic
const PREOCCUPIED_SEATS = [
  'A3', 'A4', 'B5', 'B6', 'C1', 'C2', 'C8', 'D4', 'D5', 'E7', 'E8', 'F3', 'F10', 'G2', 'G6', 'H4', 'I9'
];

export default function SeatPicker({ selectedStudio, selectedRow, selectedNumber, onSeatChange }: SeatPickerProps) {
  const [activeStudio, setActiveStudio] = useState(selectedStudio || 'Studio 3');
  const [activeRow, setActiveRow] = useState(selectedRow || 'F');
  const [activeNumber, setActiveNumber] = useState(selectedNumber || '7');

  const handleSeatClick = (row: string, num: number) => {
    const seatId = `${row}${num}`;
    if (PREOCCUPIED_SEATS.includes(seatId)) return; // occupied

    setActiveRow(row);
    setActiveNumber(num.toString());
    onSeatChange(activeStudio, row, num.toString());
  };

  const handleStudioChange = (studio: string) => {
    setActiveStudio(studio);
    onSeatChange(studio, activeRow, activeNumber);
  };

  return (
    <div className="glass p-5 space-y-5 rounded-2xl" id="seat-picker-panel">
      {/* Visual Header */}
      <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
        <div>
          <h4 className="text-xs font-bold text-white">Posisi/Kursi Deteksi Delivery</h4>
          <p className="text-[10px] text-zinc-400 font-medium">Snack premium akan diantar langsung ke posisi duduk Anda</p>
        </div>
        <div className="flex gap-1.5">
          {['Studio 1', 'Studio 2', 'Studio 3'].map(studio => (
            <button
              key={studio}
              type="button"
              onClick={() => handleStudioChange(studio)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                activeStudio === studio 
                  ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(251,191,36,0.25)]' 
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {studio}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Representation of Screen */}
      <div className="relative space-y-1.5 py-1">
        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]"></div>
        <p className="text-[8px] text-amber-500 text-center font-mono tracking-widest font-bold uppercase">LAYAR UTAMA BIOSKOP / MAIN SCREEN</p>
      </div>

      {/* Visual Interactive Seat Grid */}
      <div className="overflow-x-auto py-2 flex justify-center scrollbar-none">
        <div className="grid gap-2.5 min-w-[280px]">
          {ROWS.map(row => (
            <div key={row} className="flex items-center gap-3">
              {/* Row Label */}
              <span className="w-4 text-xs font-mono font-bold text-zinc-500 text-center">{row}</span>
              
              {/* Seats in Row */}
              <div className="flex gap-1.5">
                {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                  const num = i + 1;
                  const seatId = `${row}${num}`;
                  const isOccupied = PREOCCUPIED_SEATS.includes(seatId);
                  const isSelected = activeRow === row && activeNumber === num.toString();

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSeatClick(row, num)}
                      disabled={isOccupied}
                      title={isOccupied ? `Kursi ${seatId} ditempati penonton lain` : `Kursi ${seatId}`}
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-mono transition-all duration-200 cursor-pointer ${
                        isOccupied 
                          ? 'bg-white/5 text-zinc-700 cursor-not-allowed border border-white/5' 
                          : isSelected
                            ? 'bg-amber-500 text-black font-extrabold shadow-[0_0_12px_rgba(251,191,36,0.6)] scale-115 border border-amber-400'
                            : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Legend Indicator */}
      <div className="flex justify-center items-center gap-6 text-[10px] text-zinc-400 border-t border-white/5 pt-3 select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-white/5 border border-white/10 rounded"></div>
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-white/5 text-zinc-700 border border-white/5 rounded"></div>
          <span>Ditempati</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-amber-500 rounded shadow-[0_0_6px_rgba(251,191,36,0.6)]"></div>
          <span className="text-white font-semibold">Kursi Anda ({activeStudio}: {activeRow}-{activeNumber})</span>
        </div>
      </div>

      {/* Helpful Warning */}
      <div className="p-3 glass-accent rounded-xl flex gap-2.5 items-start">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-[10px] text-amber-200 leading-relaxed">
          <span className="font-semibold block text-amber-400 mb-0.5">Tata Tertib Antar di Dalam Studio:</span>
          Harap catat nomor kursi Anda dengan benar. Runner kami akan mendatangi Anda secara senyap agar tidak merusak fokus penonton lain. Mohon jaga cahaya ponsel seminimal mungkin.
        </div>
      </div>
    </div>
  );
}
