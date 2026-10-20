# PEMBAYARAN.md: pembayaran online sungguhan

## Status
Kode sudah siap, tetapi **belum aktif**. Situs statis tidak boleh memegang kunci rahasia gateway, jadi pembayaran memakai backend kecil (`server/`) dan akun merchant milik Calibre. Tanpa itu, checkout tetap memakai WhatsApp dan tombol "Bayar online" tidak tampil.

## Yang harus disiapkan (tidak bisa saya buatkan)
1. **Akun merchant atas nama Calibre** di Midtrans (atau Xendit). Pendaftaran butuh dokumen usaha, rekening, dan verifikasi; pencairan dana masuk ke rekening kedai. Jangan memakai akun pribadi untuk menerima uang kedai.
2. **Persetujuan tertulis Calibre** untuk menerima pesanan online lewat situs ini.
3. **Harga resmi** per menu di `server/harga-resmi.json`. Server menolak menu tanpa harga resmi, sehingga harga tebakan tidak pernah ditagihkan.
4. Hosting backend (Vercel/Netlify Functions gratis cukup untuk uji).

## Alur teknis
Browser (`js/checkout.js`) kirim `{kode, nama, hp, items[id,varian,qty]}` ke `/api/charge` → server hitung total dari `harga-resmi.json` → panggil Midtrans Snap → kembalikan `redirect_url` → pembeli bayar di halaman Midtrans (QRIS, VA bank, GoPay, kartu, dll. sesuai yang diaktifkan di dashboard) → Midtrans memanggil `/api/webhook` (tanda tangan SHA-512 diverifikasi) → status lunas dicatat.

## Pasang (mode uji/sandbox dulu)
Environment variable di hosting: `MIDTRANS_SERVER_KEY` (kunci sandbox `SB-Mid-server-...`), `ALLOWED_ORIGIN` (domain situs), opsional `FINISH_URL`, `MIDTRANS_PRODUCTION=true` hanya saat siap live. Lalu di `js/data.js`:

```js
pembayaran: { penyedia: "midtrans", endpoint: "https://<domain-backend>/api/charge" },
```

Uji dengan kartu/QRIS sandbox dari dokumentasi Midtrans. Kunci tidak pernah ditulis di repositori.

## Belum ada (perlu dibangun saat live)
Penyimpanan status pesanan di database (TODO di `webhook.js`), halaman status setelah bayar, pemberitahuan ke kedai, kebijakan refund, dan persetujuan syarat pembayaran. Hapus `noindex` dan banner studi hanya atas izin Calibre.

## v11: pesanan, status langsung, notifikasi, voucher, bayar di situs

### Yang sudah dibuat dan diuji lokal
`server/` kini punya `api/order.js` (mencatat pesanan), `api/status.js` (status untuk pembeli, ubah status untuk kedai), `api/voucher.js`, `api/charge.js` (Midtrans Snap, menghitung ulang harga dan voucher), `api/webhook.js` (status bayar), dan `dev-server.js` untuk uji lokal. Uji end-to-end: `node tools/uji-backend.js` (16 pemeriksaan: total dihitung server, voucher, menu tanpa harga ditolak, otorisasi token, status).

Jalankan lokal:
```bash
node tools/sync-menu.js --contoh      # hanya untuk uji; muat harga dan voucher contoh
ADMIN_TOKEN=rahasia123 ALLOWED_ORIGIN=http://localhost:8791 node server/dev-server.js
node tools/uji-backend.js
```
Lalu isi `CALIBRE.backend.endpoint = "http://127.0.0.1:8793"` di `js/data.js` untuk mencoba status langsung di browser, dan buka `kasir.html` untuk mengubah status (Diproses, Siap, Selesai, Batal). Setelah selesai uji, jalankan `node tools/sync-menu.js` tanpa `--contoh` agar harga contoh tidak ikut ke server.

### Alur
1. Pembeli menekan Kirim ke WhatsApp. Situs juga mencatat pesanan ke backend (bila `backend.endpoint` diisi), kode `CLB-YYMMDD-XXXX`.
2. Kasir membuka `kasir.html`, memasukkan alamat backend dan `ADMIN_TOKEN`, lalu mengubah status. Pembeli yang membiarkan halaman Pesan terbuka melihat timeline berubah tiap 12 detik, dan mendapat toast, getar, serta notifikasi browser saat status "Siap diambil" (bila diizinkan).
3. Pembayaran online: tombol Bayar online memanggil `/api/charge`. Bila `pembayaran.clientKey` diisi, jendela Midtrans Snap terbuka di dalam situs (`snap.pay`); bila kosong, pembeli diarahkan ke halaman Midtrans. Webhook memperbarui status bayar (lunas, gagal).

### Penyimpanan
Produksi memakai Upstash Redis (REST): isi `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN`. Tanpa itu, server memakai memori (hanya uji lokal). Pesanan dihapus otomatis setelah 3 hari. Data pribadi (nama, HP) hanya dikirim bila backend dipasang, dan situs memberi tahu pembeli di langkah Konfirmasi.

### Variabel environment
`ADMIN_TOKEN` (panjang dan acak), `ALLOWED_ORIGIN` (domain situs), `MIDTRANS_SERVER_KEY`, `MIDTRANS_PRODUCTION=true` (hanya saat live), `FINISH_URL` (opsional), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

### Belum teruji
Pemanggilan Midtrans (sandbox maupun live), jendela Snap, webhook asli, dan Upstash Redis sungguhan: semuanya butuh akun yang belum ada. Kode jalur itu sudah ditulis tetapi tidak dijalankan terhadap layanan aslinya. Notifikasi browser (Notification API) belum dicoba dengan izin sungguhan; toast dan timeline sudah diuji. Notifikasi saat tab ditutup memerlukan Web Push (VAPID) dan belum dibuat.

### Voucher
Definisi di `CALIBRE.voucher` (js/data.js). Voucher bawaan (KOPIBARU 10 persen maks Rp20.000 min Rp50.000; NGOPIHEMAT Rp10.000 min Rp75.000) adalah contoh. `node tools/sync-menu.js` menyalin voucher non-contoh ke `server/voucher.json`; server menghitung ulang potongan sehingga tidak bisa dipalsukan dari browser. Voucher belum dibatasi sekali pakai per pelanggan (butuh akun atau penyimpanan di server).

### Paket langganan
Dua paket konsep (Paket Ngopi 10, Paket Kerja 20) tampil sebagai kategori di katalog dan masuk keranjang seperti menu biasa. Penukaran voucher per minuman, masa berlaku, dan pembayaran berulang belum ada; kedai harus menyetujui syaratnya dan mengelolanya secara manual lewat WhatsApp.

## Mencoba Midtrans sandbox (langkah singkat)
1. Daftar gratis di <https://dashboard.sandbox.midtrans.com>. Sandbox langsung aktif tanpa dokumen usaha.
2. Buka Settings > Access Keys, salin **Server Key** (`SB-Mid-server-...`) dan **Client Key** (`SB-Mid-client-...`). Server Key bersifat rahasia: hanya masuk ke `server/.env`, tidak pernah ke `js/data.js`. Client Key memang publik.
3. Salin `server/.env.example` menjadi `server/.env`, isi `MIDTRANS_SERVER_KEY` dan `ADMIN_TOKEN`.
4. Terminal 1: `node tools/sync-menu.js --contoh` lalu `node server/dev-server.js` (otomatis membaca `server/.env`).
5. Di `js/data.js`:
   ```js
   pembayaran: { penyedia: "midtrans", endpoint: "http://127.0.0.1:8793/api/charge", terkonfirmasi: [], clientKey: "SB-Mid-client-ISI_DI_SINI", produksi: false },
   backend: { endpoint: "http://127.0.0.1:8793" },
   ```
6. Terminal 2: `python -m http.server 8791`, buka `http://localhost:8791`, pesan sesuatu sampai langkah Konfirmasi, centang persetujuan, lalu klik **Bayar online**. Jendela Snap terbuka; bayar dengan kartu uji Midtrans (mis. `4811 1111 1111 1114`, CVV `123`, OTP `112233`; periksa dokumentasi Midtrans untuk daftar terbaru) atau simulator QRIS/GoPay.
7. Webhook tidak bisa menjangkau `localhost`. Untuk melihat status berubah menjadi lunas, buka server lewat tunnel (mis. ngrok) dan isi **Payment Notification URL** di dashboard sandbox dengan `https://<tunnel>/api/webhook`. Tanpa itu, pembayaran tetap berhasil di Snap tetapi status bayar di panel kasir tidak ikut berubah.
8. Setelah uji: jalankan `node tools/sync-menu.js` (tanpa `--contoh`) dan kosongkan lagi `clientKey` bila akan dibagikan.

Kode jalur Midtrans ini sudah ditulis tetapi belum pernah dijalankan terhadap sandbox asli; kemungkinan perlu penyesuaian kecil saat pertama dicoba.

## v12: bayar online dengan banyak metode, mode simulasi
- Di langkah Pembayaran muncul metode **Bayar online sekarang** (hanya bila `CALIBRE.pembayaran.endpoint` diisi). Klik **Bayar online** di langkah Konfirmasi membuka gateway; metode yang tampil di sana mengikuti akun Midtrans: QRIS, Virtual Account (BCA, BNI, BRI, Mandiri, Permata), GoPay, ShopeePay, kartu kredit atau debit, dan gerai (Indomaret, Alfamart). Aktifkan atau matikan metode di dashboard Midtrans (Settings > Payment), atau batasi dari server dengan `PAYMENT_METHODS` (nilai `enabled_payments` Midtrans dipisah koma; periksa dokumentasi Midtrans untuk nilai yang berlaku).
- Setelah bayar, pembeli kembali ke `index.html?langsung&kode=...#/pesan` dan langsung melihat status "pembayaran lunas" (diambil dari backend).
- **Mode simulasi** (tanpa akun, tanpa uang): isi `PAYMENT_MODE=simulasi` di `server/.env`, lalu di `js/data.js` isi `pembayaran.endpoint = "http://127.0.0.1:8793/api/charge"` dan `backend.endpoint = "http://127.0.0.1:8793"`. Tombol Bayar online mengarah ke `bayar-simulasi.html` (13 metode contoh, ditandai SIMULASI), dan pembayaran dianggap lunas setelah dikonfirmasi di halaman itu. Endpoint `/api/simulasi` menolak semua permintaan bila mode simulasi tidak aktif. Mode ini hanya untuk uji dan demo; jangan diaktifkan di produksi.
- Uji backend: `SIM=1 node tools/uji-backend.js` (23 pemeriksaan, termasuk jalur simulasi, dengan server berjalan memakai `PAYMENT_MODE=simulasi`).
- Sistem stempel/loyalitas sudah dihapus.
