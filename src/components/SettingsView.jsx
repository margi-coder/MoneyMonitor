import React, { useRef } from 'react';
import { Settings, Download, Upload, RotateCcw, FileSpreadsheet, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { exportDataToJSON, exportCashflowToCSV, resetAllDataToSample } from '../services/storage';

export function SettingsView({ onImportData }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.cashflow && data.investments) {
          onImportData(data);
          alert('Berhasil mengimpor data dari file backup!');
        } else {
          alert('Format file JSON tidak valid. Pastikan berisi data cashflow & investasi.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" /> Pengaturan Data & Backup
        </h2>
        <p className="text-xs text-slate-400">Kelola cadangan data keuangan, ekspor laporan, dan opsi pemulihan data</p>
      </div>

      {/* Export Options Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" /> Ekspor & Backup Data Keuangan
        </h3>
        <p className="text-xs text-slate-400">
          Simpan cadangan data keuangan Anda secara lokal ke perangkat komputer Anda untuk keamanan atau analisis lanjutan di Excel/Google Sheets.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportDataToJSON}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Full Backup (JSON)</span>
          </button>

          <button
            onClick={exportCashflowToCSV}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Cashflow (CSV / Excel)</span>
          </button>
        </div>
      </div>

      {/* Import Data Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-cyan-400" /> Impor Backup Data (JSON)
        </h3>
        <p className="text-xs text-slate-400">
          Pulihkan data transaksi dan portofolio investasi dari file backup `.json` sebelumnya.
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-all"
        >
          <Upload className="w-4 h-4 text-cyan-400" />
          <span>Pilih File Backup JSON</span>
        </button>
      </div>

      {/* Reset Data Card */}
      <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-rose-500 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-rose-400" /> Reset & Muat Data Sampel
        </h3>
        <p className="text-xs text-slate-400">
          Kembalikan data ke kondisi awal dengan sampel data Indonesia yang lengkap (Emas, Saham Indo, Saham US, Crypto, Obligasi, Forex & Cashflow).
        </p>

        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin mereset seluruh data ke data sampel bawaan? Data transaksi saat ini akan diganti.')) {
              resetAllDataToSample();
            }
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset ke Data Sampel Realistis</span>
        </button>
      </div>
    </div>
  );
}
