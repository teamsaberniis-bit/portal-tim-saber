import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Search, Phone, MapPin } from 'lucide-react';
import { Anggota } from '../types';

interface AnggotaPageProps {
  data: Anggota[];
  onSelectMemberForModal: (member: Anggota) => void;
  onBack: () => void;
}

export const AnggotaPage: React.FC<AnggotaPageProps> = ({
  data,
  onSelectMemberForModal,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = data.filter(
    (m) =>
      m.Nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.Jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.Area.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Daftar Anggota & PJ SABER</h2>
          <p className="text-[11px] text-slate-500">Ketuk anggota untuk melihat kontak & WhatsApp</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama, jabatan, atau area..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none shadow-xs"
        />
      </div>

      {/* Member Cards */}
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((member, idx) => {
            const initial = (member.Nama || 'D').charAt(0).toUpperCase();

            return (
              <div
                key={idx}
                onClick={() => onSelectMemberForModal(member)}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs hover:border-emerald-300 transition cursor-pointer active:scale-98"
              >
                {/* Photo / Avatar */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-bold text-emerald-800 text-sm">
                  {member.Foto ? (
                    <img
                      src={member.Foto}
                      alt={member.Nama}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 truncate">{member.Nama}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    <span className="font-semibold text-emerald-700">{member.Jabatan || 'Anggota'}</span>
                    {' • '}
                    <span>{member.Area || 'Umum'}</span>
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
            Tidak ditemukan anggota dengan kata kunci tersebut.
          </div>
        )}
      </div>
    </div>
  );
};
