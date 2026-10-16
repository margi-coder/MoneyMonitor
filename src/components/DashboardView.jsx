import React from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, DollarSign, PlusCircle, ArrowUpRight, 
  ArrowDownRight, Layers, Coins, Globe, Zap, FileText, Activity, ShieldCheck, 
  Landmark, Smartphone, Settings2 
} from 'lucide-react';
import { formatIDR, formatPercent, ASSET_TYPE_MAP } from '../utils/formatters';
import { getAssetUnitPriceInIDR } from '../services/marketApi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export function DashboardView({ 
  cashflow, 
  investments, 
  wallets,
  liveData, 
  onOpenCashflowModal, 
  onOpenInvestmentModal, 
  onOpenWalletManager,
  setActiveTab 
}) {
  const { prices } = liveData;

  // 1. Calculate Cashflow & Wallet Totals
  const totalIncome = cashflow
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = cashflow
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const netCashflow = totalIncome - totalExpense;

  // Total Cash & Liquidity = Sum of all Wallet Current Balances
  const totalLiquidityBalance = wallets.reduce((sum, w) => sum + w.currentBalance, 0);

  // Group balances by category (Tabungan Bank, E-Money, Cash)
  const savingsTotal = wallets.filter(w => w.category === 'SAVINGS').reduce((sum, w) => sum + w.currentBalance, 0);
  const emoneyTotal = wallets.filter(w => w.category === 'EMONEY').reduce((sum, w) => sum + w.currentBalance, 0);
  const cashTotal = wallets.filter(w => w.category === 'CASH').reduce((sum, w) => sum + w.currentBalance, 0);

  // 2. Calculate Portfolio Totals with Live Market Rates
  let totalPortfolioCost = 0;
  let totalPortfolioCurrentValue = 0;

  const assetAllocation = {
    GOLD: 0,
    SILVER: 0,
    STOCK_INDO: 0,
    STOCK_US: 0,
    CRYPTO: 0,
    BOND: 0,
    FOREX: 0
  };

  investments.forEach(asset => {
    const unitPrice = getAssetUnitPriceInIDR(asset, prices);
    const currentValue = asset.quantity * unitPrice;

    totalPortfolioCost += asset.totalCost;
    totalPortfolioCurrentValue += currentValue;

    if (assetAllocation[asset.type] !== undefined) {
      assetAllocation[asset.type] += currentValue;
    }
  });

  const totalPortfolioGainLoss = totalPortfolioCurrentValue - totalPortfolioCost;
  const portfolioGainLossPct = totalPortfolioCost > 0 
    ? (totalPortfolioGainLoss / totalPortfolioCost) * 100 
    : 0;

  // Total Net Worth = Total Liquid Storage Balances + Current Portfolio Value
  const totalNetWorth = totalLiquidityBalance + totalPortfolioCurrentValue;

  // Donut Chart Data (Asset & Liquidity Allocation)
  const donutData = {
    labels: ['Tabungan Bank', 'E-Money', 'Cash (Uang Tunai)', 'Emas & Perak', 'Saham Indo', 'Saham US', 'Crypto', 'Obligasi / SBN', 'Forex'],
    datasets: [
      {
        data: [
          savingsTotal,
          emoneyTotal,
          cashTotal,
          assetAllocation.GOLD + assetAllocation.SILVER,
          assetAllocation.STOCK_INDO,
          assetAllocation.STOCK_US,
          assetAllocation.CRYPTO,
          assetAllocation.BOND,
          assetAllocation.FOREX
        ],
        backgroundColor: [
          '#3b82f6', // Tabungan
          '#06b6d4', // E-Money
          '#10b981', // Cash
          '#f59e0b', // Gold
          '#059669', // Saham Indo
          '#0284c7', // Saham US
          '#8b5cf6', // Crypto
          '#6366f1', // Obligasi
          '#ec4899'  // Forex
        ],
        borderWidth: 2,
        borderColor: '#0f172a'
      }
    ]
  };

  const donutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { size: 10 } }
      }
    },
    cutout: '68%',
    responsive: true,
    maintainAspectRatio: false
  };

  // Bar Chart Data (Income vs Expense)
  const barData = {
    labels: ['Ringkasan Cashflow Bulan Ini'],
    datasets: [
      {
        label: 'Pemasukan',
        data: [totalIncome],
        backgroundColor: '#10b981',
        borderRadius: 8
      },
      {
        label: 'Pengeluaran',
        data: [totalExpense],
        backgroundColor: '#f43f5e',
        borderRadius: 8
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8' } }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Worth Card */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Net Worth</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {formatIDR(totalNetWorth)}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
            <span>Saldo Kas: {formatIDR(totalLiquidityBalance)}</span>
            <span className="text-cyan-400 font-semibold">Live Market</span>
          </div>
        </div>

        {/* Total Portfolio Value & Gain/Loss */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Portofolio Investasi</p>
              <h3 className="text-2xl font-black text-white mt-1">
                {formatIDR(totalPortfolioCurrentValue)}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-slate-400">Total Profit / Loss:</span>
            <span className={`font-extrabold flex items-center gap-0.5 ${totalPortfolioGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalPortfolioGainLoss >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {formatIDR(totalPortfolioGainLoss)} ({formatPercent(portfolioGainLossPct)})
            </span>
          </div>
        </div>

        {/* Monthly Income Card */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pemasukan Bulan Ini</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">
                {formatIDR(totalIncome)}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
            <span>Transaksi: {cashflow.filter(c => c.type === 'income').length}</span>
            <button onClick={() => setActiveTab('cashflow')} className="text-emerald-400 font-semibold hover:underline">
              Detail &rarr;
            </button>
          </div>
        </div>

        {/* Monthly Expense Card */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pengeluaran Bulan Ini</p>
              <h3 className="text-2xl font-black text-rose-400 mt-1">
                {formatIDR(totalExpense)}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
            <span>Net Cashflow:</span>
            <span className={`font-bold ${netCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatIDR(netCashflow)}
            </span>
          </div>
        </div>
      </div>

      {/* Customizable Storage Accounts (Wallets) Section */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-cyan-400" /> Custom Tempat Penyimpanan Saldo ({wallets.length} Akun)
            </h4>
            <p className="text-xs text-slate-400">Rincian saldo Tabungan Bank, E-Money, dan Uang Tunai yang terintegrasi langsung dengan cashflow</p>
          </div>
          <button
            onClick={onOpenWalletManager}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Kelola Penyimpanan</span>
          </button>
        </div>

        {/* Wallet Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {wallets.map(w => (
            <div key={w.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="text-xs font-bold text-white">{w.name}</h5>
                  <span className="text-[10px] text-slate-400">
                    {w.category === 'SAVINGS' ? 'Tabungan Bank' : w.category === 'EMONEY' ? 'E-Money Digital' : 'Uang Tunai / Cash'}
                  </span>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                  w.category === 'SAVINGS' ? 'bg-blue-500/20 text-blue-300' : w.category === 'EMONEY' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {w.category}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Saldo Sisa:</span>
                <span className="text-sm font-black text-cyan-300">{formatIDR(w.currentBalance)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-2xl">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Aksi Cepat Keuangan</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCashflowModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Transaksi Cashflow</span>
          </button>
          <button
            onClick={onOpenInvestmentModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Tambah Investasi</span>
          </button>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Allocation Donut Chart */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Alokasi Kekayaan Total
            </h4>
            <span className="text-[11px] text-slate-400">Kas & Live Assets</span>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>

        {/* Cashflow Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Rasio Pemasukan vs Pengeluaran
            </h4>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Net Savings: {formatIDR(netCashflow)}
            </span>
          </div>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Recent Investment Asset Positions */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" /> Aset Investasi Teratas & Live Value
            </h4>
            <p className="text-xs text-slate-400">Di-evaluasi secara otomatis mengikuti harga pasar live online</p>
          </div>
          <button
            onClick={() => setActiveTab('investment')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Lihat Semua Portofolio ({investments.length}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {investments.map(asset => {
            const unitPrice = getAssetUnitPriceInIDR(asset, prices);
            const currentValue = asset.quantity * unitPrice;
            const gainLoss = currentValue - asset.totalCost;
            const gainLossPct = asset.totalCost > 0 ? (gainLoss / asset.totalCost) * 100 : 0;
            const meta = ASSET_TYPE_MAP[asset.type] || ASSET_TYPE_MAP.GOLD;

            return (
              <div 
                key={asset.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {asset.name}
                    </h5>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded border ${meta.color}`}>
                      {asset.symbol} ({asset.quantity} {asset.unit})
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Harga Pasaran:</span>
                    <span className="font-semibold text-slate-200">{formatIDR(unitPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Nilai Portofolio:</span>
                    <span className="font-bold text-white">{formatIDR(currentValue)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/5">
                    <span className="text-slate-400">Gain / Loss:</span>
                    <span className={`font-bold flex items-center gap-0.5 ${gainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {gainLoss >= 0 ? '+' : ''}{formatIDR(gainLoss)} ({formatPercent(gainLossPct)})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
