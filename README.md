# Calibre Coffee Roasters, Surabaya: website profil v3 (studi desain)

Website satu halaman untuk anak remaja, mahasiswa, sampai pekerja kantoran yang mencari tempat nongkrong, kerja santai, atau meeting di Calibre
(Jl. Walikota Mustajab, Ketabang, Surabaya): menu berilustrasi dengan harga perkiraan, jam buka, rute Google Maps, dan daftar pesanan lewat WhatsApp.

**Rancangan untuk tugas / studi desain. Konsep independen, bukan website resmi usaha.**

Dokumen: [SOURCES.md](SOURCES.md), [IMAGE_SOURCES.md](IMAGE_SOURCES.md), [AUDIT_REPORT.md](AUDIT_REPORT.md).

## Menjalankan

```bash
cd "C:\Davin Project\Web\CoffeShop"
```

```bash
python -m http.server 8791
```

Buka `http://localhost:8791` di Chrome. Hentikan dengan `Ctrl + C`. Peta, font, dan Three.js (gelas 3D) butuh internet.
Konfigurasi pratinjau app desktop: `.claude/launch.json` (nama `calibre`).

## Yang berubah di v3 (atas permintaan pemilik proyek)

| Permintaan | Hasil |
|---|---|
| Harga kira-kira | Setiap menu punya **harga perkiraan** (rentang, ribu rupiah) berlabel "≈", dengan penjelasan bahwa itu tebakan perancang, bukan harga resmi. Ada urut perkiraan termurah/termahal dan perkiraan total di pesanan |
| Gambar dari Pinterest | **Tidak dilakukan** (ketentuan Pinterest, hak cipta, dan bukan foto Calibre). Diganti 12 jenis **ilustrasi vektor orisinal** untuk 32 menu |
| Pilihan pembayaran di pesanan | Pilihan bayar (kasir, QRIS, transfer/e-wallet) masuk ke pesan WhatsApp sebagai preferensi. **Tidak ada pemrosesan uang** di situs; kedai mengonfirmasi metode yang tersedia |
| Hapus "Ruang" | Bagian galeri, lightbox, tautan nav, dan 6 foto yang hanya dipakai di sana dihapus |
| Desain per halaman | Tiap bagian punya bahasa visual sendiri: hero panggung 3D, Cerita kolase polaroid + stiker, Menu bergaya poster dengan kartu berilustrasi, Kunjungi gelap dengan peta |
| Dashboard awal baru, 3D bukan biji kopi | Hero baru: **gelas es kopi berlapis 3D** (bisa diputar dengan drag), stiker lokasi/jam, badge berputar, spotlight yang mengikuti kursor |
| Efek animasi lebih banyak | Judul masuk per kata, kata latar raksasa dengan parallax horizontal, ledakan konfeti saat favorit/tambah/pesan, titik terbang ke keranjang, penghitung membal, uap/tetesan/gelembung pada ilustrasi, stiker muncul membal dan melayang, ticker, tilt 3D kartu, magnet tombol |

## Fitur

- **Menu:** 32 item, 7 kategori, status (Terkini 7, Historis 22, Belum pasti 3), pencarian, filter kategori dan status, urut A-Z/Z-A/harga perkiraan, favorit (localStorage), detail dengan tautan langsung `#m/<id>`, bagikan, cetak, arsip penelitian.
- **Pesanan:** jumlah, varian, nama, cara menikmati, pilihan pembayaran, catatan, perkiraan total, kirim ke `wa.me/6281229418452` atau salin.
- **Info:** jadwal per hari (WIB) dan status buka dari jadwal reguler, peta, rute, telepon, WhatsApp, Instagram, fasilitas bersumber, FAQ.
- **Navigasi:** header sticky + penanda bagian aktif, hamburger ponsel, bar aksi bawah (Menu, Rute, Hubungi, Pesanan), kembali ke atas, progres scroll.
- **Efek** mati otomatis dengan `prefers-reduced-motion` dan bisa dimatikan lewat tombol "Efek gerak" di footer. Tanpa JavaScript/WebGL, konten tetap terlihat dan gelas 3D diganti ilustrasi SVG.

## Struktur berkas

```
index.html          struktur halaman
css/styles.css      token, komponen, bagian, dialog, efek, responsif, cetak
js/data.js          data usaha: alamat, kontak, jam, fasilitas, FAQ, sumber
js/menu-data.js     DATA MENU: id, art, harga perkiraan, nama, kategori, deskripsi, status, varian, foto, sumber, arsip
js/art.js           ilustrasi vektor menu (12 jenis)
js/ui.js            helper bersama
js/order.js         pesanan, pembayaran, perkiraan total, pesan WhatsApp
js/menu.js          katalog, detail, favorit, bagikan, cetak
js/main.js          navigasi, jadwal dan status buka, fasilitas, FAQ, dialog sumber
js/fx.js            efek gerak
js/cup3d.js         adegan 3D gelas es kopi (Three.js r128 dari cdnjs)
assets/img/         3 foto kedai + 2 potongan foto hidangan (WebP)
.agents/skills/calibre-ui-ux-anti-slop/SKILL.md   skill kustom proyek
```

## Memperbarui data

Menu di `js/menu-data.js`:

```js
{ id: "nama-unik", art: "glass:latte", harga: [35, 45], nama: "Nama Menu", kategori: "espresso",
  status: "terkini", deskripsi: "Hanya yang dikatakan sumber.", varian: [], foto: null, sumber: ["gopay"] }
```

`art` memilih ilustrasi: `cup`, `glass:latte|choco|matcha|avo|tea|velvet`, `frappe:mango|loops`, `dripper`, `press`, `pasta`, `fries`, `snack`, `toast`, `croissant`, `waffle`, `soup`.
`harga` adalah perkiraan [terendah, tertinggi] dalam ribu rupiah. **Ganti dengan harga resmi begitu Calibre memberikannya** dan ubah label "perkiraan" di `menu.js`, `order.js`, dan `index.html`.

## Skill

Skill umum antislop (inti, ui, copywriting, layoutmobile) dibaca dan diterapkan. Skill kustom proyek `calibre-ui-ux-anti-slop` diperbarui untuk v3.
Dial: **ENERGY 3 / RHYTHM 3 / MOTION 3** (override gerak disengaja atas permintaan pemilik).

## Keterbatasan

- Harga hanya perkiraan; 22 dari 32 menu hanya bersumber dokumentasi 2019; ilustrasi bukan foto menu asli.
- Tidak ada pembayaran sungguhan; QRIS/transfer/e-wallet adalah preferensi yang harus dikonfirmasi kedai.
- Foto kedai (3) dan potongan hidangan (2) milik pihak ketiga tanpa izin tertulis.
- Animasi bergerak, penanda nav aktif, dan reveal tidak dapat dibuktikan berjalan di pane browser tersembunyi (kanvas 3D dan fungsi terbukti). Belum diuji di Safari, Firefox, perangkat sungguhan, dan pembaca layar.
- Kecocokan "cocok untuk nongkrong/kerja santai/meeting" berasal dari judul GoPay dan topik ulasan Maps, bukan klaim pemilik.

## Pembuka scroll-expansion (port dari komponen React)

Bagian `[data-expand]` (antara ticker dan Cerita): foto atap kaca kecil membesar sampai memenuhi layar saat scroll, judul "Atap kaca. / Cahaya siang." terbelah ke kiri-kanan, latar fasad memudar, lalu keterangan muncul.
Kode: `js/expand.js` + blok "Pembuka" di `css/styles.css`. Dibuat vanilla karena situs ini statis (tanpa Next.js/React/Tailwind/TypeScript/shadcn/framer-motion), dan berbeda dari komponen asli:
memakai `position: sticky` tanpa `preventDefault` pada wheel/touch (scroll tidak dikunci), statis bila `prefers-reduced-motion` atau efek dimatikan, dan memakai foto Calibre sendiri (bukan Unsplash/foto stok).


## v4: halaman terpisah, checkout bertahap, foto referensi

- **Halaman terpisah** dengan router hash (`js/router.js`): Beranda `#/`, Cerita `#/cerita`, Menu `#/menu`, Kunjungi `#/kunjungi`, Info `#/info`, Pesan `#/pesan`. Pindah halaman memakai **animasi tirai** 5 pita warna dengan nama halaman, lalu halaman baru masuk. Tombol back/forward browser, tautan menu langsung (`#m/<id>`), judul tab, fokus ke judul halaman, dan pengumuman `aria-live` bekerja. Tanpa efek atau dengan `prefers-reduced-motion`, halaman berganti seketika.
- **Checkout** (`js/checkout.js`): Keranjang, Data pemesan (validasi nama dan nomor HP, jam ambil dari jadwal buka, nomor meja), Pembayaran (tunai, kartu, QRIS, transfer bank, e-wallet dengan sub-pilihan), Konfirmasi (ringkasan, perkiraan total, centang pemahaman, kode pesanan), Selesai (status, cetak ringkasan, salin pesan, kirim ulang) dan **riwayat** pesanan di browser dengan "Pesan lagi". **Tidak ada uang yang diproses**: pembayaran online sungguhan butuh payment gateway (Midtrans/Xendit), akun merchant Calibre, dan backend. Semua metode adalah pilihan yang dikirim lewat WhatsApp dan berlabel "belum dikonfirmasi kedai".
- **Foto menu**: 30 foto referensi berlisensi dari Wikimedia Commons (bukan Pinterest), berlabel "Foto referensi, bukan menu Calibre"; lihat IMAGE_SOURCES.md.

## v5: nama kedai pada pembuka, transisi "kopi dituang", navbar baru

- Judul pada pembuka scroll-expansion kini **"Calibre / Coffee Roasters"** (sebelumnya "Atap kaca. Cahaya siang."); keterangan foto tetap menjelaskan atap kaca.
- **Transisi halaman**: tiga gelombang berlapis (tanah, zaitun, arang) bergelombang naik dari bawah menutup layar sambil gelembung naik dan nama halaman muncul ("Menuju Menu"), halaman berganti, lalu gelombang terus naik membuka halaman baru. Total sekitar 1,7 detik; tanpa efek atau dengan `prefers-reduced-motion`, berganti seketika.
- **Navbar**: bar melayang bergaya stiker (bingkai arang + bayangan keras), logo cangkir kecil yang berputar saat disorot, pil navigasi dengan **indikator hijau yang meluncur** ke tautan yang disorot/aktif, bersembunyi saat scroll turun dan muncul saat scroll naik, tombol Pesanan dengan penghitung. Di ponsel: tombol "Jelajah" membuka **menu layar penuh** dengan reveal melingkar dari tombol, tautan Anton bernomor 01 sampai 05 yang masuk bertahap, tombol Temukan Kami, dan alamat; Escape atau klik tautan menutupnya.

## v6: navbar dirapikan

Navbar didesain ulang agar seimbang: bar gelap (arang) dengan bayangan keras hijau lembut, tata letak tiga zona (merek di kiri, menu tepat di tengah, aksi di kanan), satu bahasa radius (bar 16 px, tombol dan indikator 12 px), tinggi semua elemen 44 px dan sejajar vertikal. Menu berupa teks terang dengan indikator tipis yang meluncur; halaman aktif berwarna hijau lembut. Aksi kanan: "Temukan Kami" (outline, mulai 1100 px) dan "Pesanan" (hijau lembut dengan penghitung). Di ponsel: bar yang sama dengan tombol "Jelajah" hijau; logo tetap terlihat di atas menu layar penuh. Semua berkas lokal di `index.html` kini memakai `?v=` agar browser tidak menampilkan CSS/JS lama dari cache; naikkan angkanya setiap mengubah berkas.

## v7: gerak, teknis, etika

**Tampilan dan gerak**
- Gelas 3D punya mode **Es / Panas** (tombol di bawah gelas): Panas menghilangkan es dan sedotan, mengganti isi menjadi kopi berbusa, dan menambah uap.
- **Kartu menu bisa dibalik**: tekan label status (mis. "Terkini") untuk melihat sumber nama menu, tanggal, kredit foto, dan catatan harga; tombol "Kembali ke kartu".
- **Skeleton dan fade** pada foto menu (kilau saat memuat, muncul halus setelah termuat).
- **Tema musiman** opsional lewat `CALIBRE.tema` (`ramadan`, `natal`, `kemerdekaan`) di `js/data.js`: pita ucapan di atas halaman; default mati.
- **Slot video** `CALIBRE.video` untuk pembuka Cerita (diputar hanya bila gerak diizinkan); belum ada video karena butuh izin dan materi dari Calibre.
- Kursor kustom sengaja tidak dibuat (merusak aksesibilitas).

**Teknis**
- Foto kartu memakai `srcset` 400/800 px (total foto kartu 1,5 MB menjadi 0,4 MB pada ponsel). **Three.js (~600 KB) dimuat hanya saat hero terlihat**, dengan `preconnect` ke cdnjs.
- **Uji mandiri** `tests/smoke.html` (23 pemeriksaan) dan panduan uji perangkat nyata di [TESTING.md](TESTING.md).
- **SEO**: deskripsi dan `og:title` mengikuti halaman, data terstruktur `CafeOrCoffeeShop` (alamat, telepon, jam, koordinat, Instagram; semua dari sumber), **`noindex, nofollow` aktif** karena ini rancangan studi dan bukan situs resmi. `sitemap.xml` tidak dibuat: situs memakai rute hash dan domain belum ada. Catatan: pratinjau WhatsApp/Facebook membaca meta statis, bukan yang diperbarui JavaScript.
- **Analitik opsional** (`CALIBRE.analitik`, GoatCounter atau Plausible): default mati dan tidak ada permintaan jaringan; bila diaktifkan, menghormati Do Not Track dan Global Privacy Control.

**Konten dan etika**
- Banner "Rancangan studi desain, bukan situs resmi" (dapat ditutup), bagian **Transparansi** di halaman Info (apa ini, batasan, privasi, koreksi/penghapusan konten), dan tombol **"Hapus semua data saya di browser ini"**.
- [KONFIRMASI_CALIBRE.md](KONFIRMASI_CALIBRE.md): pesan siap kirim dan 10 pertanyaan untuk Calibre (harga resmi, menu aktif, Wi-Fi/parkir/pembayaran, jam libur, izin foto dan nama/logo, video).
- Isi `CALIBRE.kontakProyek` sebelum situs dibagikan agar pemilik konten bisa meminta koreksi.

## v8: admin menu, checkout baru, landing
- **Landing page** (`js/landing.js`): tampil sekali per sesi di alamat dasar; tautan langsung (`#/menu`, `#m/<id>`) atau `?langsung` melewatinya.
- **Admin menu via Google Sheets** (`js/sheet.js`, `ADMIN_MENU.md`, `docs/menu-template.csv`): harga asli, habis/sembunyi, label, menu baru. Kosong secara bawaan (`CALIBRE.sheet.csvUrl`).
- **Checkout**: ringkasan pesanan di samping, kartu metode bayar berikon, alur 3 langkah, total pasti bila semua item berharga asli. Pembayaran online sungguhan: `PEMBAYARAN.md`.

## v9: tema waktu, kustomisasi, ruang, bantu pilih
- **Tema Glasshouse** (`js/waktu.js`): siang 06.00-17.30 krem hangat, malam espresso dengan aksen amber; tombol Tema di footer (otomatis, terang, gelap).
- **Panel detail menu**: profil rasa (`js/profil.js`), kustomisasi suhu, level es, extra shot, oat milk dengan gelas SVG dan harga bergulir (`js/custom.js`).
- **Jelajahi ruangnya** dan pill suasana di Kunjungi (`js/ruang.js`); keterangan hanya dari sumber tercatat.
- **Tanya barista** (`js/finder.js`), saran pasangan di checkout, mode dine-in (`?table=08`) atau pick-up, dan "Pesan lagi favoritmu" (`js/racikan.js`).
- **3D hemat**: perangkat 2 inti atau kurang, memori 2 GB atau kurang, hemat data, 2G, atau gerak dikurangi memakai ilustrasi SVG dan tidak mengunduh Three.js.

## v11: backend pesanan, voucher, langganan, bahasa Inggris
- **Backend** (`server/`): pesanan, status (diterima, diproses, siap, selesai), voucher, Midtrans Snap, webhook; `node tools/uji-backend.js` (16 pemeriksaan). Panel kasir: `kasir.html`. Rincian: PEMBAYARAN.md.
- **Notifikasi pesanan siap**: status langsung di halaman Pesan (polling 12 detik), toast, getar, Notification API.
- **Voucher** (`js/voucher.js`) dan **paket langganan** (kategori di katalog); semuanya contoh sampai disetujui kedai.
- **Bahasa Inggris** (`js/i18n.js`, tombol EN/ID): antarmuka diterjemahkan; deskripsi menu dan catatan sumber tetap Indonesia.

## v16: navbar ponsel dropdown, hosting
- Navbar ponsel: satu dropdown (akordeon Menu dan Info, aksi WhatsApp, Telepon, bahasa, tema); bar aksi bawah dihapus; tombol Pesanan ada di header.
- Audit tata letak ponsel: `tests/audit-mobile.js` (overflow, target sentuh, teks kecil).
- Hosting gratis di GitHub Pages: lihat DEPLOY.md.
