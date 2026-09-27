import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share2, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  X, 
  Sparkles, 
  QrCode, 
  Terminal, 
  Database,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../usePWAInstall';

interface ApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptUrl: string;
  onSaveScriptUrl: (url: string) => void;
}

export const ApkModal: React.FC<ApkModalProps> = ({
  isOpen,
  onClose,
  scriptUrl,
  onSaveScriptUrl,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'github' | 'pwabuilder' | 'capacitor' | 'api'>('install');
  const [tempScriptUrl, setTempScriptUrl] = useState(scriptUrl);
  const [savedApiNotice, setSavedApiNotice] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=ffffff&color=15803d&margin=2`;

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveApi = () => {
    onSaveScriptUrl(tempScriptUrl.trim());
    setSavedApiNotice(true);
    setTimeout(() => setSavedApiNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-green-700 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Pusat APK Android</h3>
              <p className="text-[11px] text-emerald-100">Portal Tim SABER Nurul Imam</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 min-w-[75px] py-3 text-center border-b-2 transition ${
              activeTab === 'install'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Pasang di HP
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 min-w-[75px] py-3 text-center border-b-2 transition ${
              activeTab === 'github'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            GitHub
          </button>
          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`flex-1 min-w-[75px] py-3 text-center border-b-2 transition ${
              activeTab === 'pwabuilder'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            File .APK
          </button>
          <button
            onClick={() => setActiveTab('capacitor')}
            className={`flex-1 min-w-[75px] py-3 text-center border-b-2 transition ${
              activeTab === 'capacitor'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Build Android
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 min-w-[75px] py-3 text-center border-b-2 transition ${
              activeTab === 'api'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Sheet API
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 text-slate-800 text-sm">
          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* Primary Install Action */}
              {isInstalled ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-1" />
                  <p className="font-bold text-emerald-900 text-sm">Aplikasi Sudah Terpasang!</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Aplikasi ini sudah berjalan dalam mode native mandiri di perangkat Anda.
                  </p>
                </div>
              ) : isInstallable ? (
                <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 p-4 text-white shadow-md">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="h-5 w-5 text-amber-300" />
                    <h4 className="font-bold text-sm">Pasang ke Android Sekali Klik</h4>
                  </div>
                  <p className="text-xs text-emerald-100 mb-3">
                    Otomatis terpasang seperti APK asli di beranda HP Android Anda tanpa bilah browser.
                  </p>
                  <button
                    onClick={async () => {
                      await install();
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 px-4 text-sm font-bold text-emerald-800 shadow-md hover:bg-emerald-50 active:scale-95 transition"
                  >
                    <Download className="h-4 w-4" />
                    Pasang Sekarang (Install App)
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5 mb-1">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    Cara Pasang di HP Android:
                  </h4>
                  <ol className="text-xs text-blue-800 space-y-1.5 list-decimal pl-4 mt-2">
                    <li>Buka tautan ini di browser <strong>Google Chrome</strong> di HP Anda.</li>
                    <li>Ketuk menu titik tiga (<strong>⋮</strong>) di pojok kanan atas.</li>
                    <li>Pilih <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Instal Aplikasi"</strong>.</li>
                    <li>Aplikasi akan muncul di menu HP dengan ikon Tim SABER!</li>
                  </ol>
                </div>
              )}

              {/* QR Code Section */}
              <div className="rounded-xl border border-slate-200 p-4 text-center bg-slate-50">
                <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-center gap-1.5">
                  <QrCode className="h-4 w-4 text-emerald-600" />
                  Scan QR Ini Pakai Kamera HP Android:
                </p>
                <div className="flex justify-center p-2 bg-white rounded-lg border border-slate-200 inline-block mx-auto shadow-xs">
                  <img
                    src={qrCodeUrl}
                    alt="Scan QR Code untuk instal di Android"
                    className="h-40 w-40 object-contain"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-600 select-all"
                  />
                  <button
                    onClick={copyUrl}
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                  >
                    {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-900 text-white p-3.5 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <h4 className="font-bold text-sm text-slate-100">Cara Upload ke Repositori GitHub</h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Ikuti 2 langkah mudah di bawah ini untuk mengunggah seluruh kode proyek ke akun GitHub Anda.
                </p>
              </div>

              {/* Step 1 */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 font-bold text-white text-[10px]">
                    1
                  </span>
                  <b className="text-slate-900 font-bold">Buat Repository di GitHub:</b>
                </div>
                <p className="text-slate-600 pl-7 text-[11px]">
                  Buka <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold underline inline-flex items-center gap-0.5">github.com/new <ExternalLink className="h-3 w-3" /></a>, beri nama repositori (misal: <code>portal-tim-saber</code>), lalu klik <b>Create repository</b>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs space-y-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 font-bold text-white text-[10px]">
                    2
                  </span>
                  <b className="text-slate-900 font-bold">Jalankan Perintah di Terminal / CMD:</b>
                </div>
                <div className="rounded-xl bg-slate-900 p-3 font-mono text-[11px] text-emerald-400 space-y-1 overflow-x-auto select-all">
                  <p className="text-slate-500"># Inisialisasi & Commit</p>
                  <p>git init</p>
                  <p>git add .</p>
                  <p>git commit -m "feat: Portal Tim SABER Android APK"</p>
                  <p>git branch -M main</p>
                  <p className="text-slate-500 mt-2"># Hubungkan ke URL repo Anda</p>
                  <p>git remote add origin https://github.com/USERNAME/portal-tim-saber.git</p>
                  <p className="text-slate-500 mt-2"># Push ke GitHub</p>
                  <p>git push -u origin main</p>
                </div>
                <p className="text-[10px] text-slate-500 italic pl-1">
                  *Ganti USERNAME dengan nama akun GitHub Anda. File lengkap tersimpan di <code>PANDUAN_GITHUB.md</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pwabuilder' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5 mb-1">
                  <Download className="h-4 w-4 text-emerald-600" />
                  Buat File .APK dengan PWABuilder
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  PWABuilder adalah alat resmi rekomendasi Google & Microsoft untuk mengubah web PWA menjadi paket <strong>APK murni</strong> atau <strong>Google Play Bundle (AAB)</strong>.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-white">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">1</span>
                  <div>
                    <p className="font-semibold text-slate-800">Salin URL Aplikasi:</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="truncate rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600 max-w-[200px]">
                        {currentUrl}
                      </span>
                      <button
                        onClick={copyUrl}
                        className="text-[11px] font-bold text-emerald-600 hover:underline"
                      >
                        {copied ? '✓ Tersalin' : 'Salin URL'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-white">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">2</span>
                  <div>
                    <p className="font-semibold text-slate-800">Buka PWABuilder.com:</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Tempel URL di kotak yang tersedia lalu tekan Start.
                    </p>
                    <a
                      href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-700 transition"
                    >
                      Buka PWABuilder Sekarang <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-white">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">3</span>
                  <div>
                    <p className="font-semibold text-slate-800">Pilih "Package for Android":</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Klik tombol <strong>Generate Package</strong> &rarr; pilih <strong>Download APK</strong> untuk di-instal langsung di HP atau upload ke Play Store.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'capacitor' && (
            <div className="space-y-3.5">
              <div className="rounded-xl bg-slate-900 text-white p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <h4 className="font-bold text-sm text-slate-100">Build APK via Capacitor / Android Studio</h4>
                </div>
                <p className="text-[11px] text-slate-300">
                  Untuk mengkompilasi file <code className="text-emerald-300">app-debug.apk</code> secara mandiri via CLI:
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-900 p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto space-y-1.5">
                <p className="text-slate-400"># 1. Install Capacitor</p>
                <p>npm i @capacitor/core @capacitor/android</p>
                <p>npm i -D @capacitor/cli</p>
                <p className="text-slate-400 mt-2"># 2. Inisialisasi & Tambah Android</p>
                <p>npx cap init "Tim SABER" "com.timsaber.nurulimam"</p>
                <p>npm run build</p>
                <p>npx cap add android</p>
                <p className="text-slate-400 mt-2"># 3. Buka Android Studio & Build APK</p>
                <p>npx cap open android</p>
                <p className="text-slate-400"># Atau via Gradle:</p>
                <p>cd android && ./gradlew assembleDebug</p>
              </div>
              <p className="text-xs text-slate-500">
                File APK siap pakai berada di direktori <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">android/app/build/outputs/apk/debug/app-debug.apk</code>.
              </p>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="h-4 w-4 text-emerald-600" />
                  <h4 className="font-bold text-sm text-slate-900">Hubungkan ke Google Apps Script</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jika Anda memiliki Web App Google Apps Script yang terhubung ke Google Sheet, Anda dapat menempelkan URL eksekusinya di bawah ini agar data tersinkronisasi otomatis.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  URL Google Apps Script Web App:
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={tempScriptUrl}
                  onChange={(e) => setTempScriptUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  *Bila kosong, aplikasi menggunakan penyimpanan lokal (offline-first & cepat).
                </p>
              </div>

              {savedApiNotice && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Pengaturan URL berhasil disimpan!
                </div>
              )}

              <button
                onClick={handleSaveApi}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                Simpan Konfigurasi
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Versi Android 1.0.0 (PWA Ready)</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-300 transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
