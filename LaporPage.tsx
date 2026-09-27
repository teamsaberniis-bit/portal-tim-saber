import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Send, X, CheckCircle2, Eye, Clock } from 'lucide-react';
import { Anggota, LaporanItem } from '../types';

interface LaporPageProps {
  activeMember: Anggota;
  laporanHistory: LaporanItem[];
  onSubmitLaporan: (laporan: Omit<LaporanItem, 'id' | 'Tanggal'>) => Promise<boolean>;
  onBack: () => void;
}

export const LaporPage: React.FC<LaporPageProps> = ({
  activeMember,
  laporanHistory,
  onSubmitLaporan,
  onBack,
}) => {
  const [area, setArea] = useState(activeMember.Area || '');
  const [pekerjaan, setPekerjaan] = useState('');
  const [catatan, setCatatan] = useState('');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMember.Nama || !area.trim() || !pekerjaan.trim()) {
      alert('Nama, area, dan pekerjaan wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmitLaporan({
      Nama: activeMember.Nama,
      Area: area.trim(),
      Pekerjaan: pekerjaan.trim(),
      Catatan: catatan.trim(),
      Foto: fotoPreview || undefined,
    });

    setIsSubmitting(false);

    if (success) {
      setPekerjaan('');
      setCatatan('');
      removePhoto();
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    }
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Back Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900">Form Laporan Kerja</h2>
      </div>

      {successNotice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Laporan kerja berhasil disimpan dan dicatat!
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Nama Petugas
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
            Area Kerja *
          </label>
          <input
            type="text"
            required
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Contoh: Gedung SMP Lt. 2, Ruang Guru, Masjid"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Pekerjaan yang Dilakukan *
          </label>
          <input
            type="text"
            required
            value={pekerjaan}
            onChange={(e) => setPekerjaan(e.target.value)}
            placeholder="Contoh: Pembersihan kaca, pel lantai koridor, disinfeksi toilet"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Catatan Tambahan
          </label>
          <textarea
            rows={3}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Kondisi ruangan, catatan kendala ringan, atau status akhir..."
            className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* Photo Box */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Foto Pekerjaan (Kamera / Galeri)
          </label>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-center">
            {fotoPreview ? (
              <div className="relative inline-block">
                <img
                  src={fotoPreview}
                  alt="Preview pekerjaan"
                  className="max-h-48 w-full rounded-lg object-cover shadow-xs"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-white shadow-md hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-1.5 cursor-pointer py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Camera className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-emerald-700">Ambil Foto / Pilih Gambar</span>
                <span className="text-[10px] text-slate-400">JPG, PNG maks 5MB</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 disabled:opacity-50 transition"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan Kerja'}
        </button>
      </form>

      {/* Recent Reports List */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
          Riwayat Laporan Terakhir
        </h3>
        <div className="space-y-2.5">
          {laporanHistory.length > 0 ? (
            laporanHistory.map((item, idx) => (
              <div key={item.id || idx} className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <b className="text-xs font-bold text-slate-900">{item.Nama}</b>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {item.Area}
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-medium">{item.Pekerjaan}</p>
                {item.Catatan && (
                  <p className="text-[11px] text-slate-500 mt-1 italic">"{item.Catatan}"</p>
                )}
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.Tanggal}</span>
                  </div>
                  {item.Foto && (
                    <a
                      href={item.Foto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                    >
                      <Eye className="h-3 w-3" /> Lihat Foto
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400">
              Belum ada riwayat laporan tersimpan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
