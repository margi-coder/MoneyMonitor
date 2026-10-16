# 💎 MoneyMonitor

> **Smart Cashflow & Multi-Asset Live Market Portfolio Tracker**  
> Aplikasi web modern untuk pencatatan keuangan pribadi, cashflow harian, serta manajemen portofolio investasi multi-aset dengan valuasi harga pasar realtime (online).

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Fitur Utama (Key Features)

### 1. 📊 Manajemen Cashflow (Pemasukan & Pengeluaran)
- **Pencatatan Cepat & Terstruktur**: Catat setiap transaksi pemasukan (*income*) dan pengeluaran (*expense*) lengkap dengan nominal, kategori, tanggal, catatan, dan tempat penyimpanan.
- **Kategori Komprehensif**:
  - *Pemasukan*: Gaji Utama, Bonus & Freelance, Dividen Investasi, Penjualan Aset, Hadiah & Lainnya.
  - *Pengeluaran*: Makanan & Minuman, Tagihan & Utilitas, Transportasi, Belanja & Lifestyle, Hiburan & Hobi, Kesehatan, Pendidikan, dll.
- **Target Anggaran Bulanan (Monthly Budget Tracker)**: Pantau batas pengeluaran bulanan dengan *visual progress bar* yang berubah warna secara dinamis (hijau, kuning, merah) sesuai persentase pemakaian.
- **Filter & Pencarian Cepat**: Filter transaksi berdasarkan rentang waktu, tipe transaksi (Semua, Pemasukan, Pengeluaran), kategori, serta pencarian kata kunci secara realtime.
- **Riwayat & Aksi Transaksi**: Hapus transaksi kapan saja dengan pemulihan saldo otomatis.

---

### 2. 🏦 Custom Tempat Penyimpanan Saldo (Wallets / Kas)
- **Multi-Kategori Likuiditas**:
  - 🏛 **Tabungan Bank**: BCA Utama Payroll, Mandiri Tabungan, BRI BritAma, dll.
  - 📱 **E-Money / Digital Wallets**: GoPay, OVO, ShopeePay, DANA, dll.
  - 💵 **Cash / Uang Tunai**: Dompet Saku Harian, Brankas Cash Rumah, dll.
- **Otomatisasi Saldo (Auto-Sync Balance)**:
  - Setiap **Pengeluaran** akan **memotong saldo** dari tempat penyimpanan yang dipilih secara otomatis.
  - Setiap **Pemasukan** akan **menambah saldo** ke tempat penyimpanan yang dipilih secara otomatis.
  - Menghapus transaksi akan mengembalikan (*revert*) perubahan saldo pada tempat penyimpanan terkait.
- **Pengelolaan Fleksibel**: Bebas menambah tempat penyimpanan baru, menentukan saldo awal (*initial balance*), mengubah nama, dan menghapus wallet sesuai kebutuhan rekening nyata Anda.

---

### 3. 📈 Portofolio Investasi Multi-Aset dengan Harga Pasar Live (Online API)
Valuasi aset investasi Anda dihitung secara otomatis mengikuti harga pasar terkini dari sumber API publik terpercaya:

| Kelas Aset | Contoh Instrumen | Sumber / Mekanisme Harga |
| :--- | :--- | :--- |
| **🥇 Emas & Perak** | Emas Batangan Antam, Perak Murni 999 | Kuotasi harga spot global (XAU & XAG) dikonversi per gram dalam IDR |
| **🇮🇩 Saham Indonesia (IDX)** | `BBCA.JK`, `BBRI.JK`, `TLKM.JK`, `ASII.JK`, `GOTO.JK`, `AMMN.JK` | Kuotasi harga saham Bursa Efek Indonesia (BEI) via Yahoo Finance live feeds |
| **🇺🇸 Saham US (Wall Street)** | `NVDA`, `AAPL`, `TSLA`, `MSFT`, `GOOGL`, `AMZN` | Harga bursa AS dalam USD dikonversi otomatis ke IDR via kurs terkini |
| **⚡ Cryptocurrency** | `BTC`, `ETH`, `SOL`, `BNB`, `XRP`, `DOGE` | Harga realtime via **CoinGecko API** dalam USD & IDR beserta perubahan 24 jam |
| **📜 Obligasi / SBN** | SBN Ritel ORI023, Sukuk SR019, FR0091, US Treasury | Nilai par obligasi dan kalkulator kupon yield tahunan |
| **💱 Forex (Valuta Asing)** | `USD/IDR`, `EUR/IDR`, `SGD/IDR`, `JPY/IDR`, `AUD/IDR` | Kurs valas realtime via **Open Exchange Rates API** |

- **Kalkulasi Otomatis**:
  - **Nilai Saat Ini (*Current Market Value*)** = Jumlah Unit &times; Harga Pasar Terkini.
  - **Unrealized Gain / Loss** = Nilai Saat Ini &minus; Total Modal (*Cost Basis*).
  - **Persentase Profit / Loss (%)**.
- **Tombol Refresh Live Market**: Sinkronisasi harga pasar kapan saja dengan indikator waktu pembaruan terakhir.
- **Edit & Hapus Posisi**: Rincian jumlah unit, harga beli, kode ticker, dan instansi broker dapat disunting kapan saja.

---

### 4. 🧭 Dashboard Ringkasan & Analisis Finansial
- **Total Net Worth Realtime**: Menggabungkan total seluruh saldo kas likuid (Tabungan + E-Money + Cash) ditambah nilai pasar portofolio investasi terkini.
- **Visualisasi Interaktif (Chart.js)**:
  - *Donut Chart*: Komposisi alokasi kekayaan (Tabungan, E-Money, Cash, Emas, Saham, Crypto, Obligasi, Forex).
  - *Bar Chart*: Rasio perbandingan pemasukan vs pengeluaran bulanan.
- **Live Ticker Running Bar**: Ticker harga pasar live berjalan di bagian header aplikasi.
- **Indikator Kesehatan Finansial**:
  - *Savings Rate (%)*: Persentase sisa tabungan terhadap total pemasukan.
  - *Rasio Alokasi Investasi (%)*: Porsi kekayaan bersih yang berada di aset produktif.
  - *Proyeksi Net Worth Masa Depan*: Simulasi akumulasi kekayaan 1 tahun, 3 tahun, dan 5 tahun berdasarkan compounding tahunan rata-rata 8% p.a.

---

### 5. 🔒 Privasi Data & Fitur Backup / Restore
- **100% Client-Side (Offline-First)**: Seluruh data keuangan, catatan kas, dan portofolio disimpan secara lokal di peramban (`localStorage`). Tidak ada data pribadi atau finansial yang dikirim ke server backend mana pun.
- **Ekspor Full Backup (JSON)**: Unduh seluruh database aplikasi dalam 1 file JSON untuk pencadangan aman.
- **Ekspor Cashflow (CSV / Excel)**: Ekspor riwayat pemasukan dan pengeluaran ke format CSV yang kompatibel dengan Microsoft Excel atau Google Sheets.
- **Impor & Restore**: Pulihkan data cadangan kapan saja dengan memilih file backup JSON.
- **Reset ke Data Sampel Realistis**: Opsi memuat contoh data simulasi Indonesia untuk pengujian fitur instan.

---

## 🛠 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan Glassmorphic Dark Mode Design
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Market Data APIs**:
  - [CoinGecko API](https://www.coingecko.com/en/api) (Crypto Live Rates)
  - [Open Exchange Rates API](https://open.er-api.com/) (Forex & Spot Metals)
  - [Yahoo Finance Feed Proxies](https://finance.yahoo.com/) (IDX & US Stocks)

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### Prasyarat:
- [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)
- [Git](https://git-scm.com/)

### Langkah Instalasi:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/margi-coder/MoneyMonitor.git
   cd MoneyMonitor
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka peramban Anda di **`http://localhost:5173`**.

4. **Build untuk Production**:
   ```bash
   npm run build
   ```
   File hasil kompilasi yang siap di-deploy akan berada di folder `dist/`.

---

## 📁 Struktur Direktori Proyek

```text
MoneyMonitor/
├── public/                 # Aset statis & favicon
├── src/
│   ├── assets/             # Gambar & ikon SVG
│   ├── components/         # Komponen UI Modular
│   │   ├── AnalyticsView.jsx       # Laporan analisis & proyeksi net worth
│   │   ├── CashflowView.jsx        # Manajemen pemasukan & pengeluaran
│   │   ├── DashboardView.jsx       # Ringkasan statistik & visual chart
│   │   ├── Header.jsx              # Navbar & live market ticker
│   │   ├── InvestmentView.jsx      # Portofolio multi-aset & edit investasi
│   │   ├── SettingsView.jsx        # Backup, ekspor/impor JSON & CSV
│   │   ├── Sidebar.jsx             # Navigasi tab utama
│   │   └── WalletManagerModal.jsx  # Modal manajemen tempat penyimpanan
│   ├── services/           # Logika Bisnis & Komunikasi API
│   │   ├── marketApi.js            # Engine fetching harga pasar online
│   │   └── storage.js              # Manajemen LocalStorage & kalkulasi saldo
│   ├── utils/              # Helper formatters (IDR, USD, tanggal, %, dll.)
│   ├── App.jsx             # Root Component & State Management
│   ├── index.css           # Styling dasar, glassmorphism, & tema gelap
│   └── main.jsx            # Entry point React
├── index.html              # Template HTML utama
├── package.json            # Daftar dependensi & script proyek
├── vite.config.js          # Konfigurasi Vite & Tailwind plugin
└── README.md               # Dokumentasi proyek
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT**. Silakan gunakan, pelajari, dan modifikasi sesuai kebutuhan Anda.

---

<p align="center">
  Dibuat dengan ❤️ oleh <a href="https://github.com/margi-coder"><strong>margi-coder</strong></a>
</p>
