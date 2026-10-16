// Formatting Utilities for MoneyMonitor

export function formatIDR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatUSD(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercent(value) {
  if (value === undefined || value === null || isNaN(value)) return '0.00%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export const ASSET_TYPE_MAP = {
  GOLD: { label: 'Emas (Gold)', icon: 'Coins', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  SILVER: { label: 'Perak (Silver)', icon: 'Shield', color: 'text-slate-300 border-slate-400/30 bg-slate-400/10' },
  STOCK_INDO: { label: 'Saham Indonesia', icon: 'TrendingUp', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  STOCK_US: { label: 'Saham US', icon: 'Globe', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  CRYPTO: { label: 'Crypto', icon: 'Zap', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  BOND: { label: 'Obligasi / SBN', icon: 'FileText', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  FOREX: { label: 'Forex (Valas)', icon: 'DollarSign', color: 'text-pink-400 border-pink-500/30 bg-pink-500/10' }
};
