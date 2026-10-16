import React from 'react';
import { PieChart, ShieldCheck, TrendingUp, DollarSign, Award, Target, Compass } from 'lucide-react';
import { formatIDR, formatPercent } from '../utils/formatters';
import { getAssetUnitPriceInIDR } from '../services/marketApi';

export function AnalyticsView({ cashflow, investments, liveData }) {
  const { prices } = liveData;

  const totalIncome = cashflow
    .filter(c => c.type === 'income')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalExpense = cashflow
    .filter(c => c.type === 'expense')
    .reduce((sum, c) => sum + c.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  let totalPortfolioValue = 0;
  let totalCost = 0;

  investments.forEach(item => {
    const unitPrice = getAssetUnitPriceInIDR(item, prices);
    totalPortfolioValue += item.quantity * unitPrice;
    totalCost += item.totalCost;
  });

  const totalNetWorth = netSavings + totalPortfolioValue;
  const investmentRatio = totalNetWorth > 0 ? (totalPortfolioValue / totalNetWorth) * 100 : 0;

  // Projections assuming 8% compound p.a.
  const annualAdditions = Math.max(0, netSavings) * 12;
  const proj1Yr = (totalNetWorth + annualAdditions) * 1.08;
  const proj3Yr = (totalNetWorth + annualAdditions * 3) * Math.pow(1.08, 3);
  const proj5Yr = (totalNetWorth + annualAdditions * 5) * Math.pow(1.08, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-cyan-400" /> Analisis Keuangan & Kesehatan Portofolio
        </h2>
        <p className="text-xs text-slate-400">Evaluasi indikator rasio keuangan, kesehatan tabungan, dan proyeksi masa depan</p>
      </div>

      {/* Financial Health Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Savings Rate Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">Savings Rate (Rasio Tabungan)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-black text-emerald-400">{savingsRate.toFixed(1)}%</h3>
          <p className="text-xs text-slate-400">
            {savingsRate >= 20 
              ? 'Sangat Sehat! Tabungan Anda melebihi standar 20% dari total pemasukan.' 
              : 'Disarankan meningkatkan rasio tabungan minimal 20% dari pemasukan.'}
          </p>
        </div>

        {/* Investment Ratio Card */}
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">Rasio Alokasi Investasi</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-3xl font-black text-cyan-300">{investmentRatio.toFixed(1)}%</h3>
          <p className="text-xs text-slate-400">
            Sebanyak {investmentRatio.toFixed(1)}% dari Net Worth Anda berada pada aset produktif.
          </p>
        </div>

        {/* Financial Stability Indicator */}
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">Status Kesehatan Keuangan</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-2xl font-black text-purple-300">
            {savingsRate > 25 && investmentRatio > 40 ? 'EXCELLENT 🌟' : 'SEHAT & STABIL 👍'}
          </h3>
          <p className="text-xs text-slate-400">
            Manajemen cashflow positif dan diversifikasi aset terdistribusi dengan baik.
          </p>
        </div>
      </div>

      {/* Net Worth Future Projections */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-400" /> Proyeksi Pertumbuhan Net Worth (Compounding 8% p.a.)
        </h4>
        <p className="text-xs text-slate-400">
          Estimasi akumulasi kekayaan bersih berdasarkan komitmen tabungan rutin bulanan dan imbal hasil investasi tahunan rata-rata 8%:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Proyeksi 1 Tahun</span>
            <h5 className="text-xl font-bold text-cyan-300">{formatIDR(proj1Yr)}</h5>
            <span className="text-[11px] text-emerald-400">+ {formatIDR(proj1Yr - totalNetWorth)}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Proyeksi 3 Tahun</span>
            <h5 className="text-xl font-bold text-cyan-300">{formatIDR(proj3Yr)}</h5>
            <span className="text-[11px] text-emerald-400">+ {formatIDR(proj3Yr - totalNetWorth)}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Proyeksi 5 Tahun</span>
            <h5 className="text-xl font-bold text-purple-300">{formatIDR(proj5Yr)}</h5>
            <span className="text-[11px] text-emerald-400">+ {formatIDR(proj5Yr - totalNetWorth)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
