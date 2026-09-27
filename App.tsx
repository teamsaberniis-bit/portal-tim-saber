/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_DATA } from './initialData';
import { DatabaseState, Anggota, LaporanItem, PengajuanItem, PengaduanItem } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MemberModal } from './components/MemberModal';
import { ApkModal } from './components/ApkModal';
import { HomePage } from './pages/HomePage';
import { InformasiPage } from './pages/InformasiPage';
import { JadwalPage } from './pages/JadwalPage';
import { LaporPage } from './pages/LaporPage';
import { LemburPage } from './pages/LemburPage';
import { PengajuanPage } from './pages/PengajuanPage';
import { AnggotaPage } from './pages/AnggotaPage';
import { PengaduanPage } from './pages/PengaduanPage';
import { useOnlineStatus } from './useOnlineStatus';
import { WifiOff } from 'lucide-react';

const STORAGE_KEY = 'tim_saber_data_v2';
const SCRIPT_URL_KEY = 'tim_saber_script_url';
const ACTIVE_MEMBER_KEY = 'tim_saber_active_member';
const NOTIF_SNAPSHOT_KEY = 'tim_saber_notif_snapshot';

export default function App() {
  const isOnline = useOnlineStatus();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Load saved database or default
  const [data, setData] = useState<DatabaseState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          anggota: parsed.anggota?.length ? parsed.anggota : INITIAL_DATA.anggota,
          lembur: parsed.lembur?.length ? parsed.lembur : INITIAL_DATA.lembur,
          informasi: parsed.informasi?.length ? parsed.informasi : INITIAL_DATA.informasi,
          pengaduan: parsed.pengaduan || INITIAL_DATA.pengaduan,
          pengajuan: parsed.pengajuan || INITIAL_DATA.pengajuan,
          laporan: parsed.laporan || INITIAL_DATA.laporan,
        };
      }
    } catch (e) {
      console.error('Failed to parse saved database', e);
    }
    return INITIAL_DATA;
  });

  const [activeMemberIndex, setActiveMemberIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_MEMBER_KEY);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    return localStorage.getItem(SCRIPT_URL_KEY) || '';
  });

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedMember, setSelectedMember] = useState<Anggota | null>(null);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Sync state to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [data]);

  // Check notifications snapshot
  useEffect(() => {
    try {
      const currentSnap = JSON.stringify({
        infoCount: data.informasi.length,
        pengaduanCount: data.pengaduan.length,
        lemburCount: data.lembur.length,
      });
      const oldSnap = localStorage.getItem(NOTIF_SNAPSHOT_KEY);
      if (!oldSnap) {
        localStorage.setItem(NOTIF_SNAPSHOT_KEY, currentSnap);
      } else if (oldSnap !== currentSnap) {
        setHasUnread(true);
      }
    } catch {
      // ignore
    }
  }, [data.informasi, data.pengaduan, data.lembur]);

  const handleOpenNotifications = () => {
    try {
      const currentSnap = JSON.stringify({
        infoCount: data.informasi.length,
        pengaduanCount: data.pengaduan.length,
        lemburCount: data.lembur.length,
      });
      localStorage.setItem(NOTIF_SNAPSHOT_KEY, currentSnap);
    } catch {
      // ignore
    }
    setHasUnread(false);
    navigate('informasi');
  };

  const navigate = (page: string) => {
    setCurrentPage(page);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectMember = (idx: number) => {
    setActiveMemberIndex(idx);
    localStorage.setItem(ACTIVE_MEMBER_KEY, String(idx));
  };

  const handleSaveScriptUrl = (url: string) => {
    setScriptUrl(url);
    localStorage.setItem(SCRIPT_URL_KEY, url);
  };

  // Submissions
  const handleSubmitLaporan = async (newReport: Omit<LaporanItem, 'id' | 'Tanggal'>): Promise<boolean> => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })} - ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const item: LaporanItem = {
      ...newReport,
      id: `lp-${Date.now()}`,
      Tanggal: formattedDate,
    };

    setData((prev) => ({
      ...prev,
      laporan: [item, ...prev.laporan],
    }));

    // If scriptUrl is set, optionally sync
    if (scriptUrl) {
      try {
        fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simpanLaporan', data: item }),
        }).catch((err) => console.warn('Background sync error', err));
      } catch (e) {
        console.warn('Sync failed', e);
      }
    }

    return true;
  };

  const handleSubmitPengajuan = async (newRequest: Omit<PengajuanItem, 'id' | 'Tanggal'>): Promise<boolean> => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const item: PengajuanItem = {
      ...newRequest,
      id: `pj-${Date.now()}`,
      Tanggal: formattedDate,
      Status: 'Diproses',
    };

    setData((prev) => ({
      ...prev,
      pengajuan: [item, ...prev.pengajuan],
    }));

    if (scriptUrl) {
      try {
        fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simpanPengajuan', data: item }),
        }).catch((err) => console.warn('Background sync error', err));
      } catch (e) {
        console.warn('Sync failed', e);
      }
    }

    return true;
  };

  const handleSubmitPengaduan = async (newComplaint: Omit<PengaduanItem, 'id' | 'Tanggal'>): Promise<boolean> => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const item: PengaduanItem = {
      ...newComplaint,
      id: `pg-${Date.now()}`,
      Tanggal: formattedDate,
      Status: 'Diproses',
    };

    setData((prev) => ({
      ...prev,
      pengaduan: [item, ...prev.pengaduan],
    }));

    if (scriptUrl) {
      try {
        fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'simpanPengaduan', data: item }),
        }).catch((err) => console.warn('Background sync error', err));
      } catch (e) {
        console.warn('Sync failed', e);
      }
    }

    return true;
  };

  const activeMember = data.anggota[activeMemberIndex] || data.anggota[0] || {
    Nama: 'Petugas SABER',
    Jabatan: 'Anggota',
    Area: 'Umum',
    WA: '',
  };

  return (
    <div className="flex justify-center min-h-screen bg-slate-900 md:py-6">
      {/* Mobile Shell Container */}
      <div className="relative flex flex-col w-full max-w-[420px] h-[100dvh] md:max-h-[880px] md:rounded-3xl bg-slate-50 shadow-2xl overflow-hidden border border-slate-700/30">
        
        {/* Top Header */}
        <Header
          members={data.anggota}
          activeMemberIndex={activeMemberIndex}
          onSelectMember={handleSelectMember}
          onOpenNotifications={handleOpenNotifications}
          onOpenApkModal={() => setIsApkModalOpen(true)}
          hasUnread={hasUnread}
        />

        {/* Scrollable Main Content */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-3">
          {currentPage === 'home' && (
            <HomePage
              data={data}
              onNavigate={navigate}
              onOpenApkModal={() => setIsApkModalOpen(true)}
            />
          )}

          {currentPage === 'informasi' && (
            <InformasiPage
              data={data.informasi}
              onBack={() => navigate('home')}
            />
          )}

          {currentPage === 'jadwal' && (
            <JadwalPage
              onBack={() => navigate('home')}
            />
          )}

          {currentPage === 'lapor' && (
            <LaporPage
              activeMember={activeMember}
              laporanHistory={data.laporan}
              onSubmitLaporan={handleSubmitLaporan}
              onBack={() => navigate('home')}
            />
          )}

          {currentPage === 'lembur' && (
            <LemburPage
              data={data.lembur}
              onBack={() => navigate('home')}
            />
          )}

          {currentPage === 'pengajuan' && (
            <PengajuanPage
              activeMember={activeMember}
              pengajuanHistory={data.pengajuan}
              onSubmitPengajuan={handleSubmitPengajuan}
              onBack={() => navigate('home')}
            />
          )}

          {currentPage === 'anggota' && (
            <AnggotaPage
              data={data.anggota}
              onSelectMemberForModal={(m) => setSelectedMember(m)}
              onBack={() => navigate('home')}
            />
          )}

          {currentPage === 'pengaduan' && (
            <PengaduanPage
              activeMember={activeMember}
              pengaduanList={data.pengaduan}
              onSubmitPengaduan={handleSubmitPengaduan}
              onBack={() => navigate('home')}
            />
          )}
        </main>

        {/* Offline indicator banner */}
        {!isOnline && (
          <div className="bg-amber-500 text-white text-[11px] font-semibold py-1 px-3 flex items-center justify-center gap-1.5 shadow-xs">
            <WifiOff className="h-3.5 w-3.5" />
            <span>Mode Offline — Data disimpan lokal di perangkat.</span>
          </div>
        )}

        {/* Bottom Navigation */}
        <BottomNav
          currentPage={currentPage}
          onNavigate={navigate}
        />

        {/* Member WhatsApp Modal */}
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />

        {/* APK / Install Modal */}
        <ApkModal
          isOpen={isApkModalOpen}
          onClose={() => setIsApkModalOpen(false)}
          scriptUrl={scriptUrl}
          onSaveScriptUrl={handleSaveScriptUrl}
        />

      </div>
    </div>
  );
}
