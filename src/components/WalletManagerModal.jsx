import React, { useState } from 'react';
import { Landmark, Smartphone, Wallet, Plus, Trash2, Edit3, ShieldCheck, X } from 'lucide-react';
import { formatIDR } from '../utils/formatters';

const CATEGORY_MAP = {
  SAVINGS: { label: 'Tabungan Bank', icon: Landmark, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  EMONEY: { label: 'E-Money / Digital', icon: Smartphone, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  CASH: { label: 'Uang Tunai / Cash', icon: Wallet, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' }
};

export function WalletManagerModal({ wallets, onClose, onAddWallet, onDeleteWallet }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('SAVINGS');
  const [initialBalance, setInitialBalance] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newWallet = {
      id: `wal-${Date.now()}`,
      name: name.trim(),
      category,
      initialBalance: Number(initialBalance) || 0,
      color: category === 'SAVINGS' ? 'from-blue-600 to-indigo-700' : category === 'EMONEY' ? 'from-cyan-500 to-teal-600' : 'from-emerald-600 to-teal-700'
    };

    onAddWallet(newWallet);
    setName('');
    setInitialBalance('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel-glow w-full max-w-2xl p-6 rounded-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-cyan-400" /> Kelola Tempat Penyimpanan Kas (Wallets)
            </h3>
            <p className="text-xs text-slate-400">Atur akun Tabungan Bank, E-Money, dan Uang Tunai sesuai kebutuhan Anda</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add New Wallet Form */}
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
            + Tambah Tempat Penyimpanan Baru
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Nama Penyimpanan</label>
              <input
                type="text"
                required
                placeholder="Contoh: BCA Tabungan / GoPay"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Kategori Kas</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="SAVINGS">Tabungan Bank</option>
                <option value="EMONEY">E-Money / Wallet Digital</option>
                <option value="CASH">Uang Tunai (Cash)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Saldo Awal (IDR)</label>
              <input
                type="number"
                placeholder="0"
                value={initialBalance}
                onChange={e => setInitialBalance(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 active:scale-95"
            >
              Simpan Tempat Penyimpanan
            </button>
          </div>
        </form>

        {/* Existing Wallets List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Daftar Tempat Penyimpanan Terdaftar ({wallets.length})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
            {wallets.map(w => {
              const meta = CATEGORY_MAP[w.category] || CATEGORY_MAP.SAVINGS;
              const Icon = meta.icon;

              return (
                <div key={w.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl border ${meta.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{w.name}</h5>
                      <span className="text-[10px] text-slate-400">{meta.label}</span>
                      <p className="text-xs font-black text-cyan-300 mt-0.5">{formatIDR(w.currentBalance)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteWallet(w.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Hapus Tempat Penyimpanan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
