import React from 'react';
import { 
  Info, 
  AlertTriangle, 
  ChevronRight, 
  ExternalLink, 
  Sparkles, 
  Download, 
  Smartphone,
  Calendar,
  Eye
} from 'lucide-react';
import { DatabaseState, LemburItem, InformasiItem, PengaduanItem } from '../types';
import { LemburSlider } from '../components/LemburSlider';
import { MenuGrid } from '../components/MenuGrid';
import { usePWAInstall } from '../usePWAInstall';

interface HomePageProps {
  data: DatabaseState;
  onNavigate: (page: string) => void;
  onOpenApkModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ data, onNavigate, onOpenApkModal }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const latestInfo = data.informasi.slice(0, 3);
  const latestPengaduan = data.pengaduan.slice(-3).reverse();

  return (
    <div className="space-y-4 pb-2">
      {/* Hero Greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 p-4 text-white shadow-md">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Portal Resmi Petugas
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Assalamualaikum 👋</h2>
          <p className="text-xs text-emerald-100 font-medium mt-0.5">
            Selamat Datang di Pusat Informasi SABER
          </p>
          <div className="mt-2.5 inline-block rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-xs">
            NURUL IMAM ISLAMIC SCHOOL
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
      </div>

      {/* Android Install Banner (if not yet running standalone) */}
      {!isInstalled && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-100/70 p-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">Pasang Aplikasi di HP Android</h4>
              <p className="text-[10px] text-slate-600 truncate">Install APK langsung atau via PWA</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isInstallable) {
                install();
              } else {
                onOpenApkModal();
              }
            }}
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isInstallable ? 'Install' : 'Unduh APK'}</span>
          </button>
        </div>
      )}

      {/* Lembur Carousel */}
      <LemburSlider
        data={data.lembur}
        onOpenLemburList={() => onNavigate('lembur')}
      />

      {/* Menu Tim SABER */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-extrabold text-slate-800">Menu Tim SABER</h3>
        </div>
        <MenuGrid onNavigate={onNavigate} onOpenApkModal={onOpenApkModal} />
      </div>

      {/* Informasi Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-extrabold text-slate-800">Informasi & Pengumuman</h3>
          <button
            onClick={() => onNavigate('informasi')}
            className="flex items-center text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
          >
            Lihat Semua <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-2">
          {latestInfo.length > 0 ? (
            latestInfo.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('informasi')}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:border-emerald-300 transition cursor-pointer"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Info className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                    {item.Judul}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.Informasi}
                  </p>
                  {item.Tanggal && (
                    <span className="inline-block mt-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.Tanggal}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
              Belum ada informasi baru.
            </div>
          )}
        </div>
      </div>

      {/* Pengaduan / Kendala Terbaru */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-extrabold text-slate-800">Pengaduan / Kendala Terbaru</h3>
          <button
            onClick={() => onNavigate('pengaduan')}
            className="flex items-center text-[11px] font-bold text-orange-600 hover:text-orange-700"
          >
            Lihat Semua <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-2">
          {latestPengaduan.length > 0 ? (
            latestPengaduan.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900">{item.Nama}</h4>
                  <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[9px] font-bold text-orange-800">
                    {item.Area || 'Umum'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {item.Kendala || item.Pengaduan}
                </p>
                {item.Foto && (
                  <a
                    href={item.Foto}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:underline"
                  >
                    <Eye className="h-3 w-3" /> Lihat Foto Lampiran
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
              Belum ada kendala yang dilaporkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
