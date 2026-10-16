// LocalStorage & Initial Data Seed Service for MoneyMonitor

const STORAGE_KEYS = {
  CASHFLOW: 'moneymonitor_cashflow_v1',
  INVESTMENTS: 'moneymonitor_investments_v1',
  WALLETS: 'moneymonitor_wallets_v1',
  BUDGET: 'moneymonitor_budget_v1',
  SETTINGS: 'moneymonitor_settings_v1',
};

// Initial Sample Custom Storage Accounts (Wallets)
export const SAMPLE_WALLETS = [
  {
    id: 'wal-1',
    name: 'Bank BCA Utama (Payroll)',
    category: 'SAVINGS', // SAVINGS, EMONEY, CASH
    initialBalance: 12500000,
    color: 'from-blue-600 to-indigo-700',
    icon: 'Building2'
  },
  {
    id: 'wal-2',
    name: 'Bank Mandiri Tabungan',
    category: 'SAVINGS',
    initialBalance: 5200000,
    color: 'from-amber-600 to-yellow-700',
    icon: 'Landmark'
  },
  {
    id: 'wal-3',
    name: 'GoPay',
    category: 'EMONEY',
    initialBalance: 750000,
    color: 'from-cyan-500 to-teal-600',
    icon: 'Smartphone'
  },
  {
    id: 'wal-4',
    name: 'OVO Cash',
    category: 'EMONEY',
    initialBalance: 450000,
    color: 'from-purple-600 to-indigo-600',
    icon: 'Zap'
  },
  {
    id: 'wal-5',
    name: 'ShopeePay',
    category: 'EMONEY',
    initialBalance: 320000,
    color: 'from-orange-500 to-amber-600',
    icon: 'ShoppingBag'
  },
  {
    id: 'wal-6',
    name: 'Dompet Saku Harian',
    category: 'CASH',
    initialBalance: 650000,
    color: 'from-emerald-600 to-teal-700',
    icon: 'Wallet'
  },
  {
    id: 'wal-7',
    name: 'Brankas Cash Rumah',
    category: 'CASH',
    initialBalance: 2500000,
    color: 'from-slate-600 to-slate-800',
    icon: 'ShieldCheck'
  }
];

// Initial Realistic Sample Cashflow Transactions linked to specific Wallets
export const SAMPLE_CASHFLOW = [
  {
    id: 'cf-1',
    type: 'income',
    category: 'Gaji Utama',
    amount: 18500000,
    date: '2026-07-01',
    note: 'Gaji Bulanan PT Tech Indonesia',
    walletId: 'wal-1' // Bank BCA Utama
  },
  {
    id: 'cf-2',
    type: 'income',
    category: 'Bonus & Freelance',
    amount: 4200000,
    date: '2026-07-12',
    note: 'Projek Web Design Client',
    walletId: 'wal-2' // Bank Mandiri
  },
  {
    id: 'cf-3',
    type: 'income',
    category: 'Dividen Investasi',
    amount: 850000,
    date: '2026-07-20',
    note: 'Dividen Saham BBCA H1',
    walletId: 'wal-1' // Bank BCA Utama
  },
  {
    id: 'cf-4',
    type: 'expense',
    category: 'Makanan & Minuman',
    amount: 2800000,
    date: '2026-07-05',
    note: 'Belanja Bulanan Supermarket & Makan Harian',
    walletId: 'wal-1' // Bank BCA Utama
  },
  {
    id: 'cf-5',
    type: 'expense',
    category: 'Tagihan & Utilitas',
    amount: 1650000,
    date: '2026-07-08',
    note: 'Listrik PLN, Internet Wi-Fi & Air PDAM',
    walletId: 'wal-1' // Bank BCA Utama
  },
  {
    id: 'cf-6',
    type: 'expense',
    category: 'Transportasi',
    amount: 950000,
    date: '2026-07-10',
    note: 'Bensin & Ojek Online',
    walletId: 'wal-4' // OVO Cash
  },
  {
    id: 'cf-7',
    type: 'expense',
    category: 'Belanja & Lifestyle',
    amount: 1400000,
    date: '2026-07-15',
    note: 'Pakaian & Keperluan Pribadi',
    walletId: 'wal-3' // GoPay
  },
  {
    id: 'cf-8',
    type: 'expense',
    category: 'Hiburan & Hobi',
    amount: 600000,
    date: '2026-07-22',
    note: 'Nonton Bioskop & Jajanan Weekend',
    walletId: 'wal-6' // Dompet Saku Harian
  }
];

export const SAMPLE_INVESTMENTS = [
  {
    id: 'inv-1',
    name: 'Emas Batangan Antam',
    type: 'GOLD',
    symbol: 'GOLD',
    quantity: 25,
    unit: 'gram',
    buyPrice: 1320000,
    totalCost: 33000000,
    datePurchased: '2025-11-10',
    institution: 'Pegadaian Digital'
  },
  {
    id: 'inv-2',
    name: 'Bank Central Asia Tbk',
    type: 'STOCK_INDO',
    symbol: 'BBCA.JK',
    quantity: 5000,
    unit: 'lembar',
    buyPrice: 9450,
    totalCost: 47250000,
    datePurchased: '2025-08-14',
    institution: 'Stockbit Sekuritas'
  },
  {
    id: 'inv-3',
    name: 'NVIDIA Corporation',
    type: 'STOCK_US',
    symbol: 'NVDA',
    quantity: 18,
    unit: 'lembar',
    buyPriceUsd: 105.20,
    buyPrice: 1709500,
    totalCost: 30771000,
    datePurchased: '2026-01-20',
    institution: 'Interactive Brokers'
  },
  {
    id: 'inv-4',
    name: 'Bitcoin (BTC)',
    type: 'CRYPTO',
    symbol: 'BTC',
    quantity: 0.045,
    unit: 'BTC',
    buyPriceUsd: 59800,
    buyPrice: 971750000,
    totalCost: 43728750,
    datePurchased: '2025-09-05',
    institution: 'Indodax / Tokocrypto'
  },
  {
    id: 'inv-5',
    name: 'Surat Berharga Negara ORI023',
    type: 'BOND',
    symbol: 'SBN_ORI023',
    quantity: 1,
    unit: 'paket',
    buyPrice: 20000000,
    totalCost: 20000000,
    couponPct: 5.9,
    datePurchased: '2025-07-01',
    institution: 'Bibit / BCA Mobile'
  },
  {
    id: 'inv-6',
    name: 'US Dollar Cash Reserve',
    type: 'FOREX',
    symbol: 'USD',
    quantity: 1500,
    unit: 'USD',
    buyPrice: 15800,
    totalCost: 23700000,
    datePurchased: '2026-02-10',
    institution: 'Valas BCA'
  }
];

export const DEFAULT_BUDGET = 8500000;

// Helper Storage API
export function loadWallets() {
  const data = localStorage.getItem(STORAGE_KEYS.WALLETS);
  if (!data) {
    saveWallets(SAMPLE_WALLETS);
    return SAMPLE_WALLETS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SAMPLE_WALLETS;
  }
}

export function saveWallets(wallets) {
  localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
}

export function loadCashflow() {
  const data = localStorage.getItem(STORAGE_KEYS.CASHFLOW);
  if (!data) {
    saveCashflow(SAMPLE_CASHFLOW);
    return SAMPLE_CASHFLOW;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SAMPLE_CASHFLOW;
  }
}

export function saveCashflow(items) {
  localStorage.setItem(STORAGE_KEYS.CASHFLOW, JSON.stringify(items));
}

export function loadInvestments() {
  const data = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
  if (!data) {
    saveInvestments(SAMPLE_INVESTMENTS);
    return SAMPLE_INVESTMENTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SAMPLE_INVESTMENTS;
  }
}

export function saveInvestments(items) {
  localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(items));
}

export function loadBudget() {
  const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
  return data ? Number(data) : DEFAULT_BUDGET;
}

export function saveBudget(budget) {
  localStorage.setItem(STORAGE_KEYS.BUDGET, budget.toString());
}

/**
 * Calculates current real balance for each wallet (Initial Balance + Incomes - Expenses)
 */
export function calculateWalletBalances(wallets, cashflow) {
  return wallets.map(wallet => {
    let currentBalance = wallet.initialBalance || 0;

    cashflow.forEach(item => {
      // Check if transaction matches this wallet by ID or legacy account name
      if (item.walletId === wallet.id || item.account === wallet.name) {
        if (item.type === 'income') {
          currentBalance += item.amount;
        } else if (item.type === 'expense') {
          currentBalance -= item.amount;
        }
      }
    });

    return {
      ...wallet,
      currentBalance
    };
  });
}

// Backup & Data Export Utilities
export function exportDataToJSON() {
  const data = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    wallets: loadWallets(),
    cashflow: loadCashflow(),
    investments: loadInvestments(),
    budget: loadBudget()
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MoneyMonitor_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCashflowToCSV() {
  const cashflow = loadCashflow();
  const wallets = loadWallets();
  const headers = ['ID', 'Tipe', 'Kategori', 'Nominal (IDR)', 'Tanggal', 'Catatan', 'Tempat Penyimpanan'];
  
  const rows = cashflow.map(c => {
    const w = wallets.find(wal => wal.id === c.walletId);
    const walletName = w ? w.name : (c.account || 'Umum');
    return [
      c.id,
      c.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      `"${c.category}"`,
      c.amount,
      c.date,
      `"${c.note || ''}"`,
      `"${walletName}"`
    ];
  });
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MoneyMonitor_Cashflow_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function resetAllDataToSample() {
  saveWallets(SAMPLE_WALLETS);
  saveCashflow(SAMPLE_CASHFLOW);
  saveInvestments(SAMPLE_INVESTMENTS);
  saveBudget(DEFAULT_BUDGET);
  window.location.reload();
}
