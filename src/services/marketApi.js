// Market API Service for Live Online Prices & Intelligent Fallbacks

// Default Real-World Baseline Prices
export const DEFAULT_MARKET_PRICES = {
  // Gold & Silver (in IDR per gram / USD per oz)
  'GOLD_IDR': 1485000,      // Emas Antam IDR / gram
  'SILVER_IDR': 18500,      // Perak IDR / gram
  'XAU_USD': 2420.50,       // Gold USD/oz
  'XAG_USD': 28.75,         // Silver USD/oz

  // Forex (Rate to IDR)
  'USD_IDR': 16250,
  'EUR_IDR': 17650,
  'SGD_IDR': 12100,
  'JPY_IDR': 105.5,
  'AUD_IDR': 10700,

  // Crypto (in USD & IDR)
  'BTC': { usd: 67500, idr: 1096875000, change24h: 2.45 },
  'ETH': { usd: 3480, idr: 56550000, change24h: -1.12 },
  'SOL': { usd: 182, idr: 2957500, change24h: 5.80 },
  'BNB': { usd: 585, idr: 9506250, change24h: 0.90 },
  'XRP': { usd: 0.61, idr: 9912, change24h: 3.15 },
  'DOGE': { usd: 0.135, idr: 2193, change24h: -0.45 },

  // Saham Indonesia (IDX - in IDR)
  'BBCA.JK': { price: 6450, change24h: 0.50, name: 'Bank Central Asia Tbk' },
  'BBRI.JK': { price: 3920, change24h: -0.25, name: 'Bank Rakyat Indonesia Tbk' },
  'TLKM.JK': { price: 2750, change24h: 0.35, name: 'Telkom Indonesia Tbk' },
  'ASII.JK': { price: 4950, change24h: 1.02, name: 'Astra International Tbk' },
  'GOTO.JK': { price: 54, change24h: 3.85, name: 'GoTo Gojek Tokopedia Tbk' },
  'AMMN.JK': { price: 11450, change24h: -1.50, name: 'Amman Mineral Internasional Tbk' },

  // Saham US (in USD)
  'NVDA': { price: 190.01, change24h: 3.15, name: 'NVIDIA Corporation' },
  'AAPL': { price: 224.30, change24h: 0.85, name: 'Apple Inc.' },
  'TSLA': { price: 218.80, change24h: -2.30, name: 'Tesla, Inc.' },
  'MSFT': { price: 428.10, change24h: 1.10, name: 'Microsoft Corporation' },
  'GOOGL': { price: 175.40, change24h: 0.45, name: 'Alphabet Inc.' },
  'AMZN': { price: 184.20, change24h: 1.75, name: 'Amazon.com Inc.' },

  // Obligasi & Government Bonds
  'SBN_ORI023': { price: 100.0, couponPct: 5.90, name: 'ORI023-T3 (SBN Ritel)' },
  'SBN_SR019': { price: 100.25, couponPct: 6.10, name: 'Sukuk Ritel SR019' },
  'FR0091': { price: 101.50, couponPct: 6.375, name: 'Obligasi Negara FR0091' },
  'US_TREASURY_10Y': { price: 99.80, couponPct: 4.25, name: 'US Treasury 10-Year' }
};

// Cache for fetched prices
let cachedPrices = { ...DEFAULT_MARKET_PRICES };
let lastFetchTime = null;

/**
 * Fetch real-world live stock price from Yahoo Finance
 */
async function fetchStockFromYahoo(symbol) {
  try {
    const formattedSymbol = symbol.toUpperCase().trim();
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta && meta.regularMarketPrice) {
        const prevClose = meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice;
        const changePct = prevClose ? ((meta.regularMarketPrice - prevClose) / prevClose) * 100 : 0;
        return {
          price: meta.regularMarketPrice,
          change24h: Number(changePct.toFixed(2)),
          currency: meta.currency || (formattedSymbol.endsWith('.JK') ? 'IDR' : 'USD')
        };
      }
    }
  } catch (e) {
    // CORS or Timeout fallback
  }
  return null;
}

/**
 * Fetch live rates from public APIs (Exchange rates, Crypto, Stock APIs)
 */
export async function fetchLiveMarketPrices() {
  const updated = { ...cachedPrices };
  let isLive = false;

  try {
    // 1. Fetch Forex & Gold rates from open.er-api.com
    const forexRes = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(4000) });
    if (forexRes.ok) {
      const data = await forexRes.json();
      if (data.rates && data.rates.IDR) {
        const usdIdr = data.rates.IDR;
        updated['USD_IDR'] = usdIdr;
        if (data.rates.EUR) updated['EUR_IDR'] = Math.round(usdIdr / data.rates.EUR);
        if (data.rates.SGD) updated['SGD_IDR'] = Math.round(usdIdr / data.rates.SGD);
        if (data.rates.JPY) updated['JPY_IDR'] = Number((usdIdr / data.rates.JPY).toFixed(2));
        if (data.rates.AUD) updated['AUD_IDR'] = Math.round(usdIdr / data.rates.AUD);
        
        // Calculate Gold & Silver IDR based on XAU/XAG global rates
        if (data.rates.XAU) {
          const goldUsdOz = 1 / data.rates.XAU;
          updated['XAU_USD'] = Number(goldUsdOz.toFixed(2));
          // 1 troy oz = 31.1035 grams
          updated['GOLD_IDR'] = Math.round((goldUsdOz / 31.1035) * usdIdr);
        }
        if (data.rates.XAG) {
          const silverUsdOz = 1 / data.rates.XAG;
          updated['XAG_USD'] = Number(silverUsdOz.toFixed(2));
          updated['SILVER_IDR'] = Math.round((silverUsdOz / 31.1035) * usdIdr);
        }
        isLive = true;
      }
    }
  } catch (err) {
    console.warn('Forex API fetch fallback triggered:', err.message);
  }

  try {
    // 2. Fetch Crypto Prices from CoinGecko
    const cryptoRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple,dogecoin&vs_currencies=usd,idr&include_24hr_change=true',
      { signal: AbortSignal.timeout(4000) }
    );
    if (cryptoRes.ok) {
      const cData = await cryptoRes.json();
      const mapping = {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        solana: 'SOL',
        binancecoin: 'BNB',
        ripple: 'XRP',
        dogecoin: 'DOGE'
      };

      for (const [cgId, symbol] of Object.entries(mapping)) {
        if (cData[cgId]) {
          updated[symbol] = {
            usd: cData[cgId].usd,
            idr: cData[cgId].idr || Math.round(cData[cgId].usd * updated['USD_IDR']),
            change24h: Number((cData[cgId].usd_24h_change || 0).toFixed(2))
          };
        }
      }
      isLive = true;
    }
  } catch (err) {
    console.warn('Crypto API fetch fallback triggered:', err.message);
  }

  // 3. Fetch Stock Live Prices for active symbols
  const stockSymbolsToFetch = ['BBCA.JK', 'BBRI.JK', 'TLKM.JK', 'NVDA', 'AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN'];
  for (const sym of stockSymbolsToFetch) {
    const liveStock = await fetchStockFromYahoo(sym);
    if (liveStock) {
      updated[sym] = {
        ...updated[sym],
        price: liveStock.price,
        change24h: liveStock.change24h
      };
      isLive = true;
    }
  }

  cachedPrices = updated;
  lastFetchTime = new Date().toISOString();

  return {
    prices: cachedPrices,
    lastUpdated: lastFetchTime,
    isLive
  };
}

/**
 * Get current unit price in IDR for any asset
 */
export function getAssetUnitPriceInIDR(asset, prices = cachedPrices) {
  const usdIdr = prices['USD_IDR'] || 16250;

  switch (asset.type) {
    case 'GOLD':
      return prices['GOLD_IDR'] || 1485000;
    case 'SILVER':
      return prices['SILVER_IDR'] || 18500;
    case 'FOREX': {
      const pairKey = `${asset.symbol}_IDR`;
      return prices[pairKey] || 1;
    }
    case 'CRYPTO': {
      const cryptoData = prices[asset.symbol];
      if (cryptoData) {
        return cryptoData.idr || Math.round(cryptoData.usd * usdIdr);
      }
      return (asset.customPrice || asset.buyPrice || 1);
    }
    case 'STOCK_INDO': {
      const stockKey = asset.symbol.endsWith('.JK') ? asset.symbol : `${asset.symbol}.JK`;
      const stock = prices[stockKey] || prices[asset.symbol];
      return stock ? stock.price : asset.buyPrice;
    }
    case 'STOCK_US': {
      const stock = prices[asset.symbol];
      const priceUsd = stock ? stock.price : (asset.buyPriceUsd || 100);
      return Math.round(priceUsd * usdIdr);
    }
    case 'BOND': {
      const bond = prices[asset.symbol] || { price: 100 };
      const pricePct = (bond.price || 100) / 100;
      return Math.round((asset.buyPrice || 1000000) * pricePct);
    }
    default:
      return asset.buyPrice || 0;
  }
}
