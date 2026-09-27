import React from 'react';
import { Home, CalendarDays, Send, Users, Headset } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const tabs = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'jadwal', label: 'Jadwal', icon: CalendarDays },
    { id: 'pengajuan', label: 'Pengajuan', icon: Send },
    { id: 'anggota', label: 'Anggota', icon: Users },
    { id: 'pengaduan', label: 'Pengaduan', icon: Headset },
  ];

  return (
    <nav className="sticky bottom-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white py-1.5 px-2 shadow-lg">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive =
          currentPage === tab.id ||
          (tab.id === 'home' && !['jadwal', 'pengajuan', 'anggota', 'pengaduan'].includes(currentPage));

        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-1 flex-col items-center justify-center py-1 transition ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <IconComponent className={`h-5 w-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] leading-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
