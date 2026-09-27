import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Send, X, CheckCircle2, AlertTriangle, Eye, Clock } from 'lucide-react';
import { Anggota, PengaduanItem } from '../types';

interface PengaduanPageProps {
  activeMember: Anggota;
  pengaduanList: PengaduanItem[];
  onSubmitPengaduan: (pengaduan: Omit<PengaduanItem, 'id' | 'Tanggal'>) => Promise<boolean>;
  onBack: () => void;
}

export const PengaduanPage: React.FC<PengaduanPageProps> = ({
  activeMember,
  pengaduanList,
  onSubmitPengaduan,
  onBack,
}) => {
  const [area, setArea] = useState(activeMember.Area || '');
  const [kendala, setKendala] = useState('');
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
    if (!activeMember.Nama || !area.trim() || !kendala.trim()) {
      alert('Nama, area, dan pengaduan wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmitPengaduan({
      Nama: activeMember.Nama,
      Area: area.trim(),
      Kendala: kendala.trim(),
      Foto: fotoPreview || undefined,
    });

    setIsSubmitting(false);

    if (success) {
      setKendala('');
      removePhoto();
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
        <h2 className="text-base font-extrabold text-slate-900">Pengaduan Kendala / Sarana</h2>
      </div>

      {successNotice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Pengaduan kendala berhasil dikirim dan akan segera dicek!
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Nama Pelapor
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
            Area yang Bermasalah *
          </label>
          <input
            type="text"
            required
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Contoh: Kamar mandi lantai 2, Ruang Kelas 7B, Selasar Barat"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Deskripsi Kendala / Kerusakan *
          </label>
          <textarea
            required
            rows={3}
            value={kendala}
            onChange={(e) => setKendala(e.target.value)}
            placeholder="Jelaskan kendala secara spesifik (contoh: gagang pintu patah, kran air dol, genteng bocor)..."
            className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* Photo Box */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Foto Kendala (Kamera / Galeri)
          </label>
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-center">
            {fotoPreview ? (
              <div className="relative inline-block">
                <img
                  src={fotoPreview}
                  alt="Preview kendala"
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <Camera className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-orange-700">Foto Kerusakan / Kendala</span>
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
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-xs font-bold text-white shadow-md hover:bg-orange-700 active:scale-95 disabled:opacity-50 transition"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? 'Mengirim Pengaduan...' : 'Kirim Pengaduan Kendala'}
        </button>
      </form>

      {/* Riwayat Pengaduan */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
          Daftar Pengaduan Masuk
        </h3>
        <div className="space-y-2.5">
          {pengaduanList.length > 0 ? (
            pengaduanList.map((item, idx) => (
              <div key={item.id || idx} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.Nama}</span>
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[9px] font-extrabold text-orange-800">
                    {item.Area}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {item.Kendala || item.Pengaduan}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.Tanggal || 'Hari ini'}</span>
                  </div>
                  {item.Foto && (
                    <a
                      href={item.Foto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" /> Foto Kendala
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400">
              Belum ada riwayat pengaduan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
