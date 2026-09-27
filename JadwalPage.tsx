import React, { useState } from 'react';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface JadwalPageProps {
  onBack: () => void;
}

export const JadwalPage: React.FC<JadwalPageProps> = ({ onBack }) => {
  const [filter, setFilter] = useState<'all' | 'today' | 'harian' | 'mingguan' | 'bulanan'>('all');

  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 5 is Friday, 6 is Saturday
  const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'][day];
  const tanggal = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const mingguKe = Math.ceil(now.getDate() / 7);
  const isWeekday = day >= 1 && day <= 5;
  const isFriday = day === 5;
  const isTuesday = day === 2;
  const isThursday = day === 4;
  const isMonday = day === 1;
  const isWednesday = day === 3;
  const minggu1 = mingguKe === 1;
  const minggu2 = [2, 3, 4, 5, 6, 7].includes(mingguKe);
  const minggu3 = [3, 4].includes(mingguKe);
  const minggu4 = mingguKe >= 4;
  const bulan = now.getMonth() + 1;

  const allTasks = [
    // Harian
    { name: 'Glass cleaning kelas / ruangan', type: 'Harian', period: "Senin - Jum'at", isToday: isWeekday },
    { name: 'Cleaning masjid & tempat wudhu', type: 'Harian', period: "Senin - Jum'at", isToday: isWeekday },
    { name: 'Cleaning kelas / ruangan secara menyeluruh', type: 'Harian', period: "Senin - Jum'at", isToday: isWeekday },
    { name: 'Cleaning list kaca & lemari prasman siswa', type: 'Harian', period: "Senin - Jum'at", isToday: isWeekday },
    { name: 'Toilet cleaning & pewangi ruangan', type: 'Harian', period: "Senin - Jum'at", isToday: isWeekday },
    { name: 'Membuang sampah ke TPS utama', type: 'Harian', period: "Senin - Jum'at", isToday: isWeekday },

    // Mingguan
    { name: 'Cleaning karpet toilet & keset', type: 'Mingguan', period: "Setiap Jum'at", isToday: isFriday },
    { name: 'General cleaning toilet santri/siswa', type: 'Mingguan', period: "Setiap Jum'at", isToday: isFriday },
    { name: 'Cleaning tong sampah & desinfeksi wadah', type: 'Mingguan', period: "Setiap Jum'at", isToday: isFriday },
    { name: 'Penggantian sprei ruang UKS', type: 'Mingguan', period: "Setiap Jum'at", isToday: isFriday },
    { name: 'Cleaning sawang-sawang langit ruangan', type: 'Mingguan', period: 'Selasa & Kamis', isToday: isTuesday || isThursday },
    { name: 'Cleaning dinding & lis lantai kelas', type: 'Mingguan', period: 'Senin & Rabu', isToday: isMonday || isWednesday },

    // Bulanan
    { name: 'Cleaning kaca balkon lantai 2 & 3', type: 'Bulanan', period: 'Minggu ke-1 & ke-3', isToday: minggu1 || minggu3 },
    { name: 'Pembersihan & sanitasi galon dispenser', type: 'Bulanan', period: 'Minggu ke-2 & ke-4', isToday: minggu2 || minggu4 },
    { name: 'General cleaning Masjid Nurul Imam', type: 'Bulanan', period: 'Minggu ke-4', isToday: minggu4 },
    { name: 'Brushing lantai koridor & selasar', type: 'Bulanan', period: 'Minggu ke-3', isToday: minggu3 },
    { name: 'Penyemprotan disinfektan ruang kelas', type: 'Bulanan', period: 'Minggu ke-2', isToday: minggu2 },
    { name: 'Fogging area nyamuk sekolah', type: 'Bulanan', period: 'Minggu ke-1 (Triwulan)', isToday: minggu1 && [1, 4, 7, 10].includes(bulan) },
  ];

  const filteredTasks = allTasks.filter((task) => {
    if (filter === 'today') return task.isToday;
    if (filter === 'harian') return task.type === 'Harian';
    if (filter === 'mingguan') return task.type === 'Mingguan';
    if (filter === 'bulanan') return task.type === 'Bulanan';
    return true;
  });

  const todayCount = allTasks.filter((t) => t.isToday).length;

  return (
    <div className="space-y-4 pb-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
      </button>

      {/* Today Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Jadwal Kerja Tim SABER
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              {namaHari}, {tanggal}
            </h3>
          </div>
          <div className="rounded-xl bg-emerald-600 px-3 py-1.5 text-center text-white shadow-xs">
            <span className="block text-[10px] font-bold uppercase opacity-90">Hari Ini</span>
            <span className="block text-sm font-black">{todayCount} Tugas</span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'Semua Tugas' },
          { id: 'today', label: `Hari Ini (${todayCount})` },
          { id: 'harian', label: 'Harian' },
          { id: 'mingguan', label: 'Mingguan' },
          { id: 'bulanan', label: 'Bulanan' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-bold transition ${
              filter === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3 shadow-xs transition ${
                task.isToday
                  ? 'border-emerald-300 bg-white ring-1 ring-emerald-500/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {task.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="font-semibold text-emerald-700">{task.type}</span>
                    <span>•</span>
                    <span>{task.period}</span>
                  </div>
                </div>
                {task.isToday ? (
                  <span className="shrink-0 flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> Hari Ini
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
                    Jadwal
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
            Tidak ada tugas untuk kategori ini.
          </div>
        )}
      </div>
    </div>
  );
};
