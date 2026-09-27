import React from 'react';
import { ArrowLeft, Clock, Calendar, MapPin, User, Briefcase } from 'lucide-react';
import { LemburItem } from '../types';

interface LemburPageProps {
  data: LemburItem[];
  onBack: () => void;
}

export const LemburPage: React.FC<LemburPageProps> = ({ data, onBack }) => {
  return (
    <div className="space-y-4 pb-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900">Daftar Jadwal Lembur</h2>
      </div>

      <div className="space-y-3">
        {data.length > 0 ? (
          data.map((item, idx) => {
            const dateStr = item['Hari/Tanggal'] || item['Hari/tgl'] || '-';
            const petugas = item.Petugas || 'Petugas Tim';

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5 hover:border-emerald-200 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.Kegiatan}
                  </h3>
                  <span className="shrink-0 rounded-md bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-800">
                    {item.Keterangan || 'Lembur'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      <b>Petugas:</b> {petugas}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      <b>Jam:</b> {item.In} - {item.Out}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      <b>Tanggal:</b> {dateStr}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
            Belum ada jadwal lembur yang dijadwalkan.
          </div>
        )}
      </div>
    </div>
  );
};
