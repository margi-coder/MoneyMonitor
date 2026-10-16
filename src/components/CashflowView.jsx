import React, { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Plus, Search, Filter, Trash2, Edit3, 
  Wallet, Calendar, Tag, FileText, CheckCircle2, AlertCircle, Settings2, Landmark, Smartphone 
} from 'lucide-react';
import { formatIDR, formatDate } from '../utils/formatters';

const CATEGORIES = {
  income: ['Gaji Utama', 'Bonus & Freelance', 'Dividen Investasi', 'Penjualan Aset', 'Hadiah & Lainnya'],
  expense: [
    'Makanan & Minuman', 'Tagihan & Utilitas', 'Transportasi', 
    'Belanja & Lifestyle', 'Hiburan & Hobi', 'Kesehatan', 
    'Pendidikan', 'Investasi / Tabungan', 'Lain-lain'
  ]
};

export function CashflowView({ 
  cashflow, 
  wallets,
  onAddTransaction, 
  onDeleteTransaction, 
  budget, 
  onUpdateBudget,
  onOpenWalletManager
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Modal / Form state
  const [showFormModal, setShowFormModal] = useState(false);
  const [formType, setFormType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES.income[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || '');

  // Budget editing state
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);

  // Calculations
  const totalIncome = cashflow
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = cashflow
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const netCashflow = totalIncome - totalExpense;
  const budgetUsagePct = budget > 0 ? Math.min(100, (totalExpense / budget) * 100) : 0;

  // Filtered Transaksi
  const filteredTransactions = cashflow.filter(item => {
    const w = wallets.find(wal => wal.id === item.walletId);
    const walletName = w ? w.name : (item.account || '');

    const matchesSearch = 
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
      walletName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const selectedWallet = wallets.find(w => w.id === selectedWalletId) || wallets[0];

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    const newTrans = {
      id: `cf-${Date.now()}`,
      type: formType,
      category,
      amount: Number(amount),
      date,
      note,
      walletId: selectedWalletId || wallets[0]?.id
    };

    onAddTransaction(newTrans);
    setShowFormModal(false);
    setAmount('');
    setNote('');
  };

  const handleSaveBudget = () => {
    if (newBudget && !isNaN(newBudget)) {
      onUpdateBudget(Number(newBudget));
      setIsEditingBudget(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-cyan-400" /> Pencatatan Cashflow
          </h2>
          <p className="text-xs text-slate-400">Pemasukan dan pengeluaran memotong/menambah saldo tempat penyimpanan pilihan</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenWalletManager}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-all"
          >
            <Settings2 className="w-4 h-4 text-cyan-400" />
            <span>Kelola Tempat Penyimpanan ({wallets.length})</span>
          </button>
          <button
            onClick={() => {
              setFormType('income');
              setCategory(CATEGORIES.income[0]);
              if (wallets.length > 0) setSelectedWalletId(wallets[0].id);
              setShowFormModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi Baru</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Pemasukan</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">{formatIDR(totalIncome)}</h3>
        </div>

        {/* Total Expense */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-rose-500">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Pengeluaran</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="text-2xl font-black text-rose-400 mt-1">{formatIDR(totalExpense)}</h3>
        </div>

        {/* Net Cashflow */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-cyan-500">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">Net Cashflow</span>
            <Wallet className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className={`text-2xl font-black mt-1 ${netCashflow >= 0 ? 'text-cyan-300' : 'text-rose-400'}`}>
            {formatIDR(netCashflow)}
          </h3>
        </div>
      </div>

      {/* Monthly Budget Tracker Bar */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Target Anggaran Pengeluaran Bulanan</span>
            <p className="text-xs text-slate-400">Terpakai {formatIDR(totalExpense)} dari batasan {formatIDR(budget)}</p>
          </div>
          {isEditingBudget ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={newBudget}
                onChange={e => setNewBudget(e.target.value)}
                className="w-32 px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-cyan-500/40 text-white focus:outline-none"
              />
              <button
                onClick={handleSaveBudget}
                className="px-2.5 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg"
              >
                Simpan
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingBudget(true)}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> Ubah Target
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              budgetUsagePct > 90 
                ? 'bg-rose-500 shadow-md shadow-rose-500/50' 
                : budgetUsagePct > 70 
                  ? 'bg-amber-500' 
                  : 'bg-emerald-500'
            }`}
            style={{ width: `${budgetUsagePct}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-[11px] font-semibold text-slate-400">
          <span>0%</span>
          <span>{budgetUsagePct.toFixed(1)}% Terpakai</span>
          <span>100% ({formatIDR(budget)})</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari transaksi / tempat penyimpanan..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-900/80 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Tipe Filter Buttons */}
        <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              typeFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            Semua ({cashflow.length})
          </button>
          <button
            onClick={() => setTypeFilter('income')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              typeFilter === 'income' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setTypeFilter('expense')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              typeFilter === 'expense' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            Pengeluaran
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Jenis</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Catatan / Keterangan</th>
                <th className="py-3.5 px-4">Tempat Penyimpanan</th>
                <th className="py-3.5 px-4 text-right">Nominal</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    Tidak ada data transaksi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(item => {
                  const w = wallets.find(wal => wal.id === item.walletId);
                  const walletName = w ? w.name : (item.account || 'Umum');

                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-300 whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                          item.type === 'income' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {item.type === 'income' ? '+ Pemasukan' : '- Pengeluaran'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                        {item.note || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-cyan-300 font-semibold whitespace-nowrap">
                        {walletName}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${
                        item.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {item.type === 'income' ? '+' : '-'}{formatIDR(item.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onDeleteTransaction(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel-glow w-full max-w-md p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Catat Transaksi Cashflow</h3>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setFormType('income');
                    setCategory(CATEGORIES.income[0]);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    formType === 'income' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400'
                  }`}
                >
                  + Pemasukan (Tambah Saldo)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType('expense');
                    setCategory(CATEGORIES.expense[0]);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    formType === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400'
                  }`}
                >
                  - Pengeluaran (Potong Saldo)
                </button>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nominal (IDR)</label>
                <input
                  type="number"
                  placeholder="Contoh: 500000"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Wallet / Storage Selector */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Tempat Penyimpanan (Wallets / Kas)
                </label>
                <select
                  value={selectedWalletId}
                  onChange={e => setSelectedWalletId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold focus:outline-none"
                >
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} (Saldo Saat Ini: {formatIDR(w.currentBalance)})
                    </option>
                  ))}
                </select>
                {selectedWallet && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    {formType === 'expense' ? 'Pengeluaran ini akan memotong saldo ' : 'Pemasukan ini akan menambah saldo '}
                    <strong className="text-cyan-300">{selectedWallet.name}</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Kategori Transaksi</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                >
                  {CATEGORIES[formType].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tanggal Transaksi</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Catatan / Keterangan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Keterangan transaksi..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-semibold hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20"
                >
                  Simpan & Potong/Tambah Saldo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
