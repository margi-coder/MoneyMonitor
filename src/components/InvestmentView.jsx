import React, { useState } from 'react';
import { 
  TrendingUp, RefreshCw, Plus, ArrowUpRight, ArrowDownRight, Coins, 
  Globe, Zap, FileText, DollarSign, ShieldCheck, Activity, Trash2, Edit3 
} from 'lucide-react';
import { formatIDR, formatUSD, formatPercent, ASSET_TYPE_MAP } from '../utils/formatters';
import { getAssetUnitPriceInIDR, DEFAULT_MARKET_PRICES } from '../services/marketApi';

const ASSET_CLASSES = [
  { id: 'ALL', label: 'Semua Aset' },
  { id: 'GOLD', label: 'Emas & Perak' },
  { id: 'STOCK_INDO', label: 'Saham Indo (IDX)' },
  { id: 'STOCK_US', label: 'Saham US' },
  { id: 'CRYPTO', label: 'Crypto' },
  { id: 'BOND', label: 'Obligasi / SBN' },
  { id: 'FOREX', label: 'Forex (Valas)' }
];

export function InvestmentView({ 
  investments, 
  liveData, 
  onRefreshMarket, 
  isRefreshing, 
  onAddInvestment, 
  onUpdateInvestment,
  onDeleteInvestment 
}) {
  const { prices, lastUpdated, isLive } = liveData;
  const [selectedClass, setSelectedClass] = useState('ALL');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('STOCK_INDO');
  const [symbol, setSymbol] = useState('BBCA.JK');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('lembar');
  const [buyPrice, setBuyPrice] = useState('');
  const [institution, setInstitution] = useState('Stockbit Sekuritas');

  // Total Portfolio Metrics
  let totalCost = 0;
  let totalCurrentValue = 0;

  investments.forEach(item => {
    const unitPrice = getAssetUnitPriceInIDR(item, prices);
    const currVal = item.quantity * unitPrice;
    totalCost += item.totalCost;
    totalCurrentValue += currVal;
  });

  const totalProfitLoss = totalCurrentValue - totalCost;
  const totalProfitLossPct = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

  // Filtered Assets
  const filteredInvestments = investments.filter(item => {
    if (selectedClass === 'ALL') return true;
    if (selectedClass === 'GOLD') return item.type === 'GOLD' || item.type === 'SILVER';
    return item.type === selectedClass;
  });

  const handleOpenAddModal = () => {
    setEditingId(null);
    setAssetType('STOCK_INDO');
    setSymbol('BBCA.JK');
    setAssetName('Bank Central Asia Tbk');
    setQuantity('');
    setUnit('lembar');
    setBuyPrice('');
    setInstitution('Stockbit Sekuritas');
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setAssetType(item.type);
    setSymbol(item.symbol);
    setAssetName(item.name);
    setQuantity(item.quantity.toString());
    setUnit(item.unit || 'lembar');
    setBuyPrice(item.buyPrice.toString());
    setInstitution(item.institution || '');
    setShowModal(true);
  };

  const handleAssetTypeChange = (type) => {
    setAssetType(type);
    if (editingId) return; // don't overwrite custom name if editing

    switch (type) {
      case 'GOLD':
        setSymbol('GOLD');
        setAssetName('Emas Batangan Antam');
        setUnit('gram');
        break;
      case 'SILVER':
        setSymbol('SILVER');
        setAssetName('Perak Murni 999');
        setUnit('gram');
        break;
      case 'STOCK_INDO':
        setSymbol('BBCA.JK');
        setAssetName('Bank Central Asia Tbk');
        setUnit('lembar');
        break;
      case 'STOCK_US':
        setSymbol('NVDA');
        setAssetName('NVIDIA Corporation');
        setUnit('lembar');
        break;
      case 'CRYPTO':
        setSymbol('BTC');
        setAssetName('Bitcoin');
        setUnit('BTC');
        break;
      case 'BOND':
        setSymbol('SBN_ORI023');
        setAssetName('Surat Berharga Negara ORI023');
        setUnit('paket');
        break;
      case 'FOREX':
        setSymbol('USD');
        setAssetName('US Dollar Reserve');
        setUnit('USD');
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!quantity || !buyPrice || Number(quantity) <= 0 || Number(buyPrice) <= 0) return;

    const qty = Number(quantity);
    const unitCost = Number(buyPrice);

    if (editingId) {
      // Edit existing asset
      const updatedAsset = {
        id: editingId,
        name: assetName || symbol,
        type: assetType,
        symbol,
        quantity: qty,
        unit,
        buyPrice: unitCost,
        totalCost: qty * unitCost,
        institution
      };
      onUpdateInvestment(updatedAsset);
    } else {
      // Add new asset
      const newAsset = {
        id: `inv-${Date.now()}`,
        name: assetName || symbol,
        type: assetType,
        symbol,
        quantity: qty,
        unit,
        buyPrice: unitCost,
        totalCost: qty * unitCost,
        datePurchased: new Date().toISOString().slice(0, 10),
        institution
      };
      onAddInvestment(newAsset);
    }

    setShowModal(false);
    setEditingId(null);
    setQuantity('');
    setBuyPrice('');
  };

  return (
    <div className="space-y-6">
      {/* Header Title & Market Live Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" /> Portofolio Investasi Live Market
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              REALTIME ONLINE API
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Nilai portofolio dievaluasi otomatis mengikuti pergerakan harga pasar terkini
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefreshMarket}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh Live Market'}</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Posisi Investasi</span>
          </button>
        </div>
      </div>

      {/* Portfolio Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Cost Basis */}
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Modal (Cost Basis)</span>
          <h3 className="text-2xl font-black text-slate-200 mt-1">{formatIDR(totalCost)}</h3>
        </div>

        {/* Current Portfolio Value */}
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Nilai Pasar Portofolio</span>
          <h3 className="text-2xl font-black text-cyan-300 mt-1">{formatIDR(totalCurrentValue)}</h3>
        </div>

        {/* Total Unrealized Profit/Loss */}
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Gain / Loss (Unrealized)</span>
          <h3 className={`text-2xl font-black mt-1 flex items-center gap-1 ${totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalProfitLoss >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            {formatIDR(totalProfitLoss)} ({formatPercent(totalProfitLossPct)})
          </h3>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {ASSET_CLASSES.map(cls => (
          <button
            key={cls.id}
            onClick={() => setSelectedClass(cls.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedClass === cls.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-white/5'
            }`}
          >
            {cls.label}
          </button>
        ))}
      </div>

      {/* Detailed Investment Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Nama Aset & Simbol</th>
                <th className="py-3.5 px-4">Kategori Aset</th>
                <th className="py-3.5 px-4 text-right">Jumlah Unit</th>
                <th className="py-3.5 px-4 text-right">Modal / Unit (Beli)</th>
                <th className="py-3.5 px-4 text-right">Harga Pasar Live</th>
                <th className="py-3.5 px-4 text-right">Nilai Saat Ini</th>
                <th className="py-3.5 px-4 text-right">Profit / Loss</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvestments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    Tidak ada aset investasi dalam kategori ini.
                  </td>
                </tr>
              ) : (
                filteredInvestments.map(item => {
                  const unitPrice = getAssetUnitPriceInIDR(item, prices);
                  const currentValue = item.quantity * unitPrice;
                  const gainLoss = currentValue - item.totalCost;
                  const gainLossPct = item.totalCost > 0 ? (gainLoss / item.totalCost) * 100 : 0;
                  const meta = ASSET_TYPE_MAP[item.type] || ASSET_TYPE_MAP.GOLD;

                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div>
                            <p className="text-sm font-bold text-slate-100">{item.name}</p>
                            <p className="text-[11px] text-slate-400">{item.symbol} &bull; {item.institution || 'Portofolio'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${meta.color}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-slate-200 whitespace-nowrap">
                        {item.quantity.toLocaleString('id-ID')} {item.unit}
                      </td>
                      <td className="py-4 px-4 text-right text-slate-300 whitespace-nowrap">
                        {formatIDR(item.buyPrice)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-cyan-300 whitespace-nowrap">
                        {formatIDR(unitPrice)}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {item.type === 'STOCK_US' ? `${formatUSD(prices?.[item.symbol]?.price || 0)}` : 'Live Online'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-black text-white whitespace-nowrap">
                        {formatIDR(currentValue)}
                      </td>
                      <td className="py-4 px-4 text-right font-extrabold whitespace-nowrap">
                        <span className={`inline-flex items-center gap-0.5 ${gainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {gainLoss >= 0 ? '+' : ''}{formatIDR(gainLoss)}
                        </span>
                        <span className={`block text-[11px] font-bold ${gainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ({formatPercent(gainLossPct)})
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                            title="Edit Posisi Investasi"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteInvestment(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Hapus Posisi Aset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Investment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel-glow w-full max-w-lg p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {editingId ? <Edit3 className="w-4 h-4 text-cyan-400" /> : <Plus className="w-4 h-4 text-cyan-400" />}
                {editingId ? 'Edit Posisi Investasi' : 'Tambah Posisi Investasi Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Jenis / Kelas Aset</label>
                <select
                  value={assetType}
                  onChange={e => handleAssetTypeChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="STOCK_INDO">Saham Indonesia (IDX)</option>
                  <option value="STOCK_US">Saham US (Wall Street)</option>
                  <option value="CRYPTO">Cryptocurrency</option>
                  <option value="GOLD">Emas (Gold)</option>
                  <option value="SILVER">Perak (Silver)</option>
                  <option value="BOND">Obligasi / SBN / Bonds</option>
                  <option value="FOREX">Forex / Mata Uang Asing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nama Aset</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bank BCA"
                    value={assetName}
                    onChange={e => setAssetName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Kode Simbol Ticker</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BBCA.JK / NVDA / BTC"
                    value={symbol}
                    onChange={e => setSymbol(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold font-bold text-cyan-300">Jumlah Unit</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="Contoh: 1000"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-white focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Satuan Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold font-bold text-cyan-300">Harga Beli / Unit (IDR)</label>
                  <input
                    type="number"
                    required
                    placeholder="Harga per unit"
                    value={buyPrice}
                    onChange={e => setBuyPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-white focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Platform / Broker / Instansi</label>
                <input
                  type="text"
                  placeholder="Contoh: Stockbit / Indodax / Pegadaian / Bibit"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-semibold hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20"
                >
                  {editingId ? 'Simpan Perubahan' : 'Simpan Aset Investasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
