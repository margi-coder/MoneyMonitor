import React from 'react';
import { RefreshCw, Activity, Wallet, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { formatIDR, formatUSD, formatPercent } from '../utils/formatters';

export function Header({ liveData, onRefresh, isRefreshing }) {
  const { prices, lastUpdated, isLive } = liveData;

  const btc = prices?.BTC || { usd: 67500, idr: 1096875000, change24h: 2.45 };
  const gold = prices?.GOLD_IDR || 1485000;
  const usdIdr = prices?.USD_IDR || 16250;
  const bbca = prices?.['BBCA.JK'] || { price: 10250, change24h: 1.23 };
  const nvda = prices?.NVDA || { price: 122.50, change24h: 4.15 };

  const tickerItems = [
    { label: 'Emas/gr', val: formatIDR(gold), change: '+0.8%' },
    { label: 'USD/IDR', val: `Rp ${usdIdr.toLocaleString('id-ID')}`, change: '-0.1%' },
    { label: 'BTC/USD', val: formatUSD(btc.usd), change: formatPercent(btc.change24h) },
    { label: 'BBCA (IDX)', val: formatIDR(bbca.price), change: formatPercent(bbca.change24h) },
    { label: 'NVDA (US)', val: formatUSD(nvda.price), change: formatPercent(nvda.change24h) },
    { label: 'ETH/USD', val: formatUSD(prices?.ETH?.usd || 3480), change: formatPercent(prices?.ETH?.change24h || 0) },
    { label: 'Perak/gr', val: formatIDR(prices?.SILVER_IDR || 18500), change: '+0.5%' },
    { label: 'EUR/IDR', val: formatIDR(prices?.EUR_IDR || 17650), change: '+0.2%' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
      {/* Top Live Ticker Bar */}
      <div className="overflow-hidden border-b border-white/5 bg-slate-900/60 py-1.5 text-xs">
        <div className="animate-ticker space-x-8">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2 shrink-0">
              <span className="text-slate-400 font-medium">{item.label}:</span>
              <span className="font-semibold text-slate-100">{item.val}</span>
              <span className={`text-[11px] font-bold ${item.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.change}
              </span>
              <span className="text-slate-600">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
            <Wallet className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent">
                MoneyMonitor
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PRO LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Cashflow & Live Investment Tracker
            </p>
          </div>
        </div>

        {/* Live Market Sync Action */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col items-end text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300 font-medium">
                {isLive ? 'Harga Pasar Live Online' : 'Update Terakhir (Online Sync)'}
              </span>
            </div>
            <span className="text-slate-500 text-[11px]">
              {lastUpdated ? new Date(lastUpdated).toLocaleTimeString('id-ID') : 'Auto-Sync Active'}
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50"
            title="Refresh Harga Pasar Online (Emas, Stocks, Crypto, Forex)"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">
              {isRefreshing ? 'Syncing Market...' : 'Refresh Market'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
