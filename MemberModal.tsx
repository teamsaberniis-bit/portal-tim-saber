import React from 'react';
import { X, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Anggota } from '../types';

interface MemberModalProps {
  member: Anggota | null;
  onClose: () => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({ member, onClose }) => {
  if (!member) return null;

  const initial = (member.Nama || 'D').charAt(0).toUpperCase();
  const cleanPhone = (member.WA || '').replace(/[^0-9]/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}`
    : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xs rounded-2xl bg-white p-5 text-center shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Avatar */}
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-3 border-emerald-500 bg-emerald-100 font-extrabold text-2xl text-emerald-800 shadow-md">
          {member.Foto ? (
            <img src={member.Foto} alt={member.Nama} className="h-full w-full object-cover" />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        {/* Name and Role */}
        <h3 className="text-base font-extrabold text-slate-900 leading-snug">{member.Nama}</h3>
        <span className="inline-block mt-1 mb-3 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
          {member.Jabatan || 'Anggota'}
        </span>

        {/* Details Card */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              Area:{' '}
              <b className="font-bold text-slate-900">{member.Area || 'Umum'}</b>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              WA:{' '}
              <b className="font-bold text-slate-900">{member.WA || '-'}</b>
            </span>
          </div>
        </div>

        {/* WhatsApp Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 px-4 text-xs font-bold text-white shadow-md hover:bg-[#20ba5a] active:scale-95 transition"
        >
          <MessageCircle className="h-4 w-4 fill-white" />
          Hubungi via WhatsApp
        </a>
      </div>
    </div>
  );
};
