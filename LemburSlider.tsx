import React, { useState, useRef } from 'react';
import { Briefcase, Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { LemburItem } from '../types';

interface LemburSliderProps {
  data: LemburItem[];
  onOpenLemburList: () => void;
}

export const LemburSlider: React.FC<LemburSliderProps> = ({ data, onOpenLemburList }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 p-4 text-white shadow-md">
        <div className="flex items-center gap-2 mb-2 font-bold text-sm">
          <Briefcase className="h-4 w-4" /> Jadwal Lembur
        </div>
        <p className="text-xs text-emerald-100">Belum ada jadwal lembur saat ini.</p>
      </div>
    );
  }

  const current = data[currentIndex];
  const dateStr = current['Hari/Tanggal'] || current['Hari/tgl'] || 'Jadwal Mendatang';
  const petugas = current.Petugas || 'Petugas Tim';

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : data.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < data.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 p-4 text-white shadow-lg select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-sm font-bold tracking-tight">
          <Briefcase className="h-4 w-4 text-emerald-200" />
          <span>Jadwal Lembur</span>
        </div>
        <span className="truncate max-w-[40%] rounded-md bg-orange-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-xs">
          {current.Keterangan || 'Umum'}
        </span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1.5 text-xs text-emerald-100 font-medium mb-3">
        <Calendar className="h-3.5 w-3.5 text-emerald-300" />
        <span className="truncate">{dateStr}</span>
      </div>

      {/* 2x2 Details Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur-xs">
          <span className="block text-[9px] font-semibold text-emerald-200">Petugas</span>
          <b className="block text-xs font-bold text-white mt-0.5 truncate">{petugas}</b>
        </div>
        <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur-xs">
          <span className="block text-[9px] font-semibold text-emerald-200">Kegiatan</span>
          <b className="block text-xs font-bold text-white mt-0.5 line-clamp-1">{current.Kegiatan || '-'}</b>
        </div>
        <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur-xs">
          <span className="block text-[9px] font-semibold text-emerald-200">Jam Masuk (In)</span>
          <b className="block text-xs font-bold text-white mt-0.5">{current.In || '-'}</b>
        </div>
        <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur-xs">
          <span className="block text-[9px] font-semibold text-emerald-200">Jam Selesai (Out)</span>
          <b className="block text-xs font-bold text-white mt-0.5">{current.Out || '-'}</b>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10">
        <button
          onClick={handlePrev}
          disabled={data.length <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-30 transition"
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {data.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-5 bg-white' : 'w-2 bg-white/40'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <span className="text-[10px] font-bold text-emerald-200">
          {currentIndex + 1}/{data.length}
        </span>

        <button
          onClick={handleNext}
          disabled={data.length <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-30 transition"
          aria-label="Berikutnya"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
