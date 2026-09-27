import React, { useState } from 'react';
import { ArrowLeft, Megaphone, Search, Calendar } from 'lucide-react';
import { InformasiItem } from '../types';

interface InformasiPageProps {
  data: InformasiItem[];
  onBack: () => void;
}

export const InformasiPage: React.FC<InformasiPageProps> = ({ data, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = data.filter(
    (item) =>
      item.Judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Informasi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-4">
      {/* Back Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900">Pusat Informasi & Pengumuman</h2>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari pengumuman..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none shadow-xs"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-emerald-200 transition"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.Judul}</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.Informasi}</p>
                  {item.Tanggal && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
                      <Calendar className="h-3 w-3" />
                      <span>{item.Tanggal}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
            Tidak ada informasi yang sesuai.
          </div>
        )}
      </div>
    </div>
  );
};
