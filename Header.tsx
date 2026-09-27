import React from 'react';
import { Bell, Smartphone, Download } from 'lucide-react';
import { Anggota } from '../types';

interface HeaderProps {
  members: Anggota[];
  activeMemberIndex: number;
  onSelectMember: (index: number) => void;
  onOpenNotifications: () => void;
  onOpenApkModal: () => void;
  hasUnread: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  members,
  activeMemberIndex,
  onSelectMember,
  onOpenNotifications,
  onOpenApkModal,
  hasUnread,
}) => {
  const activeMember = members[activeMemberIndex] || {
    Nama: 'Petugas SABER',
    Jabatan: 'Anggota',
    Area: 'Umum',
  };

  const initial = (activeMember.Nama || 'D').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex items-center gap-2.5 border-b border-slate-200 bg-white px-4 py-3 shadow-xs">
      {/* Avatar */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-500 font-extrabold text-white shadow-xs">
        {activeMember.Foto ? (
          <img
            src={activeMember.Foto}
            alt={activeMember.Nama}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {/* Greeting and Member Select */}
      <div className="min-w-0 flex-1">
        <div className="text-[11px] leading-tight text-slate-500 font-medium">Selamat bekerja,</div>
        <select
          value={activeMemberIndex}
          onChange={(e) => onSelectMember(parseInt(e.target.value, 10))}
          className="w-full truncate border-none bg-transparent p-0 text-sm font-bold text-slate-900 outline-none cursor-pointer focus:ring-0"
        >
          {members.length > 0 ? (
            members.map((m, idx) => (
              <option key={idx} value={idx}>
                {m.Nama}
              </option>
            ))
          ) : (
            <option>Belum ada anggota</option>
          )}
        </select>
        <div className="truncate text-[10px] font-semibold text-emerald-700">
          • {activeMember.Jabatan || 'Anggota'}
          {activeMember.Area ? ` (${activeMember.Area})` : ''}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* APK / Install Button */}
        <button
          onClick={onOpenApkModal}
          className="flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition"
          title="Pasang APK / Unduh Android App"
        >
          <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
          <span className="hidden sm:inline">APK</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition active:scale-95"
          aria-label="Notifikasi"
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-xs">
              !
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
