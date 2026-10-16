import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CashflowView } from './components/CashflowView';
import { InvestmentView } from './components/InvestmentView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { WalletManagerModal } from './components/WalletManagerModal';
import { 
  loadCashflow, saveCashflow, 
  loadInvestments, saveInvestments, 
  loadWallets, saveWallets,
  loadBudget, saveBudget,
  calculateWalletBalances
} from './services/storage';
import { fetchLiveMarketPrices, DEFAULT_MARKET_PRICES } from './services/marketApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Application Data States
  const [cashflow, setCashflow] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [budget, setBudget] = useState(8500000);

  // Live Market Prices State
  const [liveData, setLiveData] = useState({
    prices: DEFAULT_MARKET_PRICES,
    lastUpdated: null,
    isLive: false
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Wallet Manager Modal State
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Initial Data Load
  useEffect(() => {
    setCashflow(loadCashflow());
    setInvestments(loadInvestments());
    setWallets(loadWallets());
    setBudget(loadBudget());
    handleRefreshPrices();

    // Periodic Market Prices Auto-Sync (every 60 seconds)
    const interval = setInterval(() => {
      handleRefreshPrices(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshPrices = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const data = await fetchLiveMarketPrices();
      setLiveData(data);
    } catch (e) {
      console.error('Market sync error:', e);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  // Calculate Realtime Wallet Balances (Initial Balance + Incomes - Expenses)
  const calculatedWallets = calculateWalletBalances(wallets, cashflow);

  // Wallet Handlers
  const handleAddWallet = (newWallet) => {
    const updated = [...wallets, newWallet];
    setWallets(updated);
    saveWallets(updated);
  };

  const handleDeleteWallet = (id) => {
    if (wallets.length <= 1) {
      alert('Minimal harus ada 1 tempat penyimpanan saldo.');
      return;
    }
    const updated = wallets.filter(w => w.id !== id);
    setWallets(updated);
    saveWallets(updated);
  };

  // Cashflow Handlers
  const handleAddTransaction = (newTransaction) => {
    const updated = [newTransaction, ...cashflow];
    setCashflow(updated);
    saveCashflow(updated);
  };

  const handleDeleteTransaction = (id) => {
    const updated = cashflow.filter(item => item.id !== id);
    setCashflow(updated);
    saveCashflow(updated);
  };

  const handleUpdateBudget = (newBudget) => {
    setBudget(newBudget);
    saveBudget(newBudget);
  };

  // Investment Handlers
  const handleAddInvestment = (newInvestment) => {
    const updated = [newInvestment, ...investments];
    setInvestments(updated);
    saveInvestments(updated);
  };

  const handleUpdateInvestment = (updatedAsset) => {
    const updated = investments.map(item => item.id === updatedAsset.id ? { ...item, ...updatedAsset } : item);
    setInvestments(updated);
    saveInvestments(updated);
  };

  const handleDeleteInvestment = (id) => {
    const updated = investments.filter(item => item.id !== id);
    setInvestments(updated);
    saveInvestments(updated);
  };

  const handleImportData = (data) => {
    if (data.wallets) {
      setWallets(data.wallets);
      saveWallets(data.wallets);
    }
    if (data.cashflow) {
      setCashflow(data.cashflow);
      saveCashflow(data.cashflow);
    }
    if (data.investments) {
      setInvestments(data.investments);
      saveInvestments(data.investments);
    }
    if (data.budget) {
      setBudget(data.budget);
      saveBudget(data.budget);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header 
        liveData={liveData} 
        onRefresh={() => handleRefreshPrices(false)} 
        isRefreshing={isRefreshing} 
      />

      {/* Navigation Tabs */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            cashflow={cashflow}
            investments={investments}
            wallets={calculatedWallets}
            liveData={liveData}
            onOpenCashflowModal={() => setActiveTab('cashflow')}
            onOpenInvestmentModal={() => setActiveTab('investment')}
            onOpenWalletManager={() => setShowWalletModal(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'cashflow' && (
          <CashflowView
            cashflow={cashflow}
            wallets={calculatedWallets}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            budget={budget}
            onUpdateBudget={handleUpdateBudget}
            onOpenWalletManager={() => setShowWalletModal(true)}
          />
        )}

        {activeTab === 'investment' && (
          <InvestmentView
            investments={investments}
            liveData={liveData}
            onRefreshMarket={() => handleRefreshPrices(false)}
            isRefreshing={isRefreshing}
            onAddInvestment={handleAddInvestment}
            onUpdateInvestment={handleUpdateInvestment}
            onDeleteInvestment={handleDeleteInvestment}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            cashflow={cashflow}
            investments={investments}
            liveData={liveData}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Wallet Manager Modal */}
      {showWalletModal && (
        <WalletManagerModal
          wallets={calculatedWallets}
          onClose={() => setShowWalletModal(false)}
          onAddWallet={handleAddWallet}
          onDeleteWallet={handleDeleteWallet}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>MoneyMonitor &copy; {new Date().getFullYear()} - Smart Cashflow & Multi-Asset Live Market Portfolio Tracker</p>
        <p className="mt-1 text-[11px] text-slate-600">Dukungan Penyimpanan: Tabungan Bank, E-Money, Cash | Aset: Emas, Perak, Saham Indo, Saham US, Crypto, Obligasi, Forex</p>
      </footer>
    </div>
  );
}
