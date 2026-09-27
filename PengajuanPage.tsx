import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Anggota, PengajuanItem } from '../types';

interface PengajuanPageProps {
  activeMember: Anggota;
  pengajuanHistory: PengajuanItem[];
  onSubmitPengajuan: (pengajuan: Omit<PengajuanItem, 'id' | 'Tanggal'>) => Promise<boolean>;
  onBack: () => void;
}

export const PengajuanPage: React.FC<PengajuanPageProps> = ({
  activeMember,
  pengajuanHistory,
  onSubmitPengajuan,
  onBack,
}) => {
  const [area, setArea] = useState(activeMember.Area || '');
  const [prioritas, setPrioritas] = useState<'Normal' | 'Penting' | 'Mendesak'>('Normal');
  const [kebutuhan, setKebutuhan] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleKebutuhanChange = (index: number, val: string) => {
    const updated = [...kebutuhan];
    updated[index] = val;
    setKebutuhan(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = kebutuhan.map((k) => k.trim()).filter((k) => k.length > 0);

    if (!activeMember.Nama || !area.trim() || validItems.length === 0) {
      alert('Isi nama, area, dan minimal satu kebutuhan alat/bahan.');
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmitPengajuan({
      Nama: activeMember.Nama,
      Area: area.trim(),
      Prioritas: prioritas,
      Kebutuhan: validItems,
    });

    setIsSubmitting(false);

    if (success) {
      setKebutuhan(['', '', '', '', '', '']);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    }
  };

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
        <h2 className="text-base font-extrabold text-slate-900">Pengajuan Alat / Bahan</h2>
      </div>

      {successNotice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Pengajuan berhasil dikirim dan dicatat untuk ditindaklanjuti!
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Nama Pemohon
          </label>
          <input
            type="text"
            disabled
            value={activeMember.Nama}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Area Peruntukan *
          </label>
          <input
            type="text"
            required
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Contoh: Lantai 1 & Masjid, Kamar Mandi Siswa, dsb"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* Prioritas radio group */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
            Tingkat Prioritas
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Normal', 'Penting', 'Mendesak'] as const).map((level) => {
              const active = prioritas === level;
              const activeClasses =
                level === 'Mendesak'
                  ? 'border-red-500 bg-red-50 text-red-700 font-extrabold'
                  : level === 'Penting'
                  ? 'border-orange-500 bg-orange-50 text-orange-700 font-extrabold'
                  : 'border-emerald-500 bg-emerald-50 text-emerald-700 font-extrabold';

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPrioritas(level)}
                  className={`rounded-xl border py-2 text-xs font-semibold transition ${
                    active ? activeClasses : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 Kebutuhan Fields */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
            Daftar Kebutuhan Alat / Bahan (Maks. 6 Item)
          </label>
          <div className="space-y-1.5">
            {kebutuhan.map((item, idx) => (
              <input
                key={idx}
                type="text"
                value={item}
                onChange={(e) => handleKebutuhanChange(idx, e.target.value)}
                placeholder={`${idx + 1}. ${
                  idx === 0 ? 'Kebutuhan utama (contoh: Pembersih porselen 5 botol)' : `Kebutuhan ke-${idx + 1} (opsional)`
                }`}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 disabled:opacity-50 transition"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan Alat & Bahan'}
        </button>
      </form>

      {/* Riwayat Pengajuan */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
          Riwayat Pengajuan Tersimpan
        </h3>
        <div className="space-y-2.5">
          {pengajuanHistory.length > 0 ? (
            pengajuanHistory.map((item, idx) => (
              <div key={item.id || idx} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.Nama}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                      item.Prioritas === 'Mendesak'
                        ? 'bg-red-100 text-red-800'
                        : item.Prioritas === 'Penting'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.Prioritas}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Area: <b className="text-slate-700">{item.Area}</b>
                </div>

                <div className="rounded-xl bg-slate-50 p-2.5 space-y-1">
                  {item.Kebutuhan.map((req, rIdx) => (
                    <div key={rIdx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{item.Tanggal}</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {item.Status || 'Menunggu Verifikasi'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400">
              Belum ada riwayat pengajuan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
