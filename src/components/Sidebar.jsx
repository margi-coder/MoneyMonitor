import React from 'react';
import { LayoutDashboard, ArrowLeftRight, TrendingUp, PieChart, Settings } from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Ringkasan Utama', icon: LayoutDashboard, badge: null },
    { id: 'cashflow', label: 'Pemasukan & Pengeluaran', icon: ArrowLeftRight, badge: null },
    { id: 'investment', label: 'Portofolio Investasi', icon: TrendingUp, badge: 'LIVE' },
    { id: 'analytics', label: 'Analisis & Laporan', icon: PieChart, badge: null },
    { id: 'settings', label: 'Data & Backup', icon: Settings, badge: null }
  ];

  return (
    <nav className="flex overflow-x-auto space-x-1 p-1 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg max-w-7xl mx-auto my-4 px-2 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
