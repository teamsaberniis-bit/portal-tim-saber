import React from 'react';
import { 
  Megaphone, 
  CalendarDays, 
  ClipboardCheck, 
  Clock, 
  FileText, 
  Users, 
  AlertTriangle,
  Smartphone
} from 'lucide-react';

interface MenuGridProps {
  onNavigate: (page: string) => void;
  onOpenApkModal: () => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ onNavigate, onOpenApkModal }) => {
  const menuItems = [
    {
      id: 'informasi',
      label: 'Informasi',
      icon: Megaphone,
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'jadwal',
      label: 'Jadwal',
      icon: CalendarDays,
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'lapor',
      label: 'Lapor Kerja',
      icon: ClipboardCheck,
      bg: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      id: 'lembur',
      label: 'Lembur',
      icon: Clock,
      bg: 'bg-orange-50 text-orange-600 border-orange-100',
    },
    {
      id: 'pengajuan',
      label: 'Pengajuan',
      icon: FileText,
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'anggota',
      label: 'Anggota',
      icon: Users,
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'pengaduan',
      label: 'Pengaduan',
      icon: AlertTriangle,
      bg: 'bg-orange-50 text-orange-600 border-orange-100',
    },
    {
      id: 'apk',
      label: 'Pasang APK',
      icon: Smartphone,
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      action: onOpenApkModal,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 my-4">
      {menuItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                onNavigate(item.id);
              }
            }}
            className="group flex flex-col items-center gap-1.5 focus:outline-none"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-xs transition-transform duration-150 active:scale-90 group-hover:scale-105 ${item.bg}`}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight text-center">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
