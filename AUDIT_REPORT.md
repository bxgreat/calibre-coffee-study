# AUDIT_REPORT.md: v1 ke v2

Tanggal: 19 Oktober 2026. Pengujian dilakukan di browser bawaan Claude desktop (Chromium) dengan server `python -m http.server`.
Hanya yang tercantum di bagian "Hasil pengujian" yang benar-benar dijalankan.

## 1. Ringkasan perubahan

| Aspek | v1 | v2 |
|---|---|---|
| Menu | 14 baris, tanpa kartu, hanya filter 3 kategori | **32 item**, 7 kategori, pencarian, filter kategori + status, urut A-Z/Z-A, favorit, detail, bagikan, tautan langsung, cetak |
| Bukti menu | Label sumber per baris | Label sumber + **status** (Terkini 7, Historis 22, Belum pasti 3) + tanggal periksa + arsip item yang tidak ditemukan |
| Foto menu | 2 foto dengan 3 hidangan sekaligus | 2 potongan foto yang cocok per hidangan, 30 placeholder berlabel jujur |
| Galeri | 9 foto, grid sama rata, filter tidak ada | 9 foto unik, **grid editorial** (unggulan, tinggi, lebar, baku), filter Interior/Eksterior/Coffee/Food, lightbox dengan geser sentuh |
| Pesan | Tidak ada | **Daftar pesanan** yang dikirim ke WhatsApp Calibre (tanpa pembayaran, tanpa harga) |
| Efek | Hover dan buka-tutup saja | Adegan **3D biji kopi (Three.js)**, tilt 3D kartu dan foto, reveal 3D, judul per kata, parallax, ticker, magnet tombol, progres scroll; bisa dimatikan |
| Navigasi ponsel | Menu hamburger | Menu hamburger + **bar aksi bawah** (Menu, Rute, Hubungi, Pesanan) + tombol kembali ke atas |
| Navigasi desktop | Tautan statis | + penanda bagian aktif |
| Format gambar | JPEG, 4,3 MB | WebP, sekitar 3,4 MB, `srcset` |
| Fasilitas | 5 butir | 8 butir, masing-masing menyebut jenis sumber (pemilik, media, ulasan, agregator) |
| FAQ | 4 pertanyaan | 6 (ditambah cara memesan dan arti label status) |

## 2. Audit fitur v1 (sebelum)

| Fitur | Status v1 |
|---|---|
| Nav desktop, hamburger ponsel, sticky header | Ada, berfungsi |
| Filter menu (3 kategori) | Ada |
| Pencarian menu | **Tidak ada** |
| Detail menu | **Tidak ada** |
| Favorit | **Tidak ada** |
| Bagikan menu / tautan langsung | **Tidak ada** |
| Pengurutan | **Tidak ada** |
| Galeri + lightbox | Ada (tanpa filter, tanpa geser sentuh, tanpa transisi) |
| Status buka/tutup | Ada (WIB, dengan catatan hari libur) |
| Peta + rute + telepon + WhatsApp + Instagram | Ada |
| Accordion FAQ | Ada |
| Bar aksi ponsel, kembali ke atas, penanda nav aktif | **Tidak ada** |
| Versi cetak menu | **Tidak ada** |
| Pesan | **Tidak ada** |
| Kritik visual | Placeholder tidak ada; kartu menu tidak ada; foto menu tidak sesuai produk; garis kiri berwarna pada catatan menu (diganti kotak berbingkai) |

## 3. Keputusan yang berbeda dari brief (dan alasannya)

| Brief | Keputusan | Alasan |
|---|---|---|
| Kategori "Signature Coffee" | **Tidak dibuat** | Tidak ada sumber yang menandai item mana pun sebagai signature. Calibre Latte masuk Espresso Based |
| Foto setiap menu | 2 foto + 30 placeholder berlabel | Foto lain tidak tersedia secara sah atau tidak bisa dipastikan produknya. Brief melarang memaksakan foto umum |
| Galeri 15 sampai 25 foto | 9 | Lihat IMAGE_SOURCES.md. Jumlah bukan alasan memakai foto tanpa izin atau tanpa kecocokan |
| Pengurutan harga | **Tidak ada** | Harga tidak ada, sesuai aturan brief |
| Pilihan varian | Hanya Teh Panas dan Teh Dingin | Hanya itu yang disebut papan menu. Opsi panas/dingin lain tidak terverifikasi |
| QR code ke katalog | **Tidak dibuat** | Situs belum punya alamat publik; QR ke localhost menyesatkan. Versi cetak daftar menu dibuat sebagai gantinya |
| Pengurutan "terlaris" | Tidak dibuat | Tidak ada data penjualan |
| "Menu beli" (permintaan tambahan) | Daftar pesanan via WhatsApp | Brief melarang keranjang/pembayaran palsu tanpa backend. WhatsApp Calibre adalah integrasi nyata yang sudah terverifikasi; kedai yang mengonfirmasi harga dan stok |
| "Efek 3D dan banyak efek" (permintaan tambahan) | Dikerjakan, dengan batas | Dial MOTION naik dari 1 ke 3 atas permintaan pemilik (tercatat di SKILL.md). Efek tidak menutupi informasi, mati otomatis dengan `prefers-reduced-motion`, bisa dimatikan lewat footer |

## 4. Hasil pengujian (benar-benar dijalankan)

**Lingkungan:** Chromium di pane browser Claude desktop. Catatan penting: pane berstatus *hidden* (`document.visibilityState = "hidden"`), sehingga transisi CSS, `requestAnimationFrame`, dan `IntersectionObserver` tidak berjalan seperti di jendela yang terlihat. Karena itu efek reveal dan penanda nav aktif **tidak dapat dibuktikan di sini**, dan tangkapan layar reveal sering menampilkan keadaan awal.

| Area | Hasil |
|---|---|
| Konsol browser | Tidak ada error atau peringatan |
| Gambar | 0 gambar rusak; semua `.webp` termuat (diperiksa `complete && naturalWidth > 0`). Satu `<img src="">` kosong pada lightbox ditemukan lalu diganti GIF transparan |
| Overflow horizontal | Tidak ada di 360, 390, 740 (lebar pane), 1440; juga dengan efek aktif |
| Katalog | 32 kartu; 3 kolom di 1440, 2 kolom di 740, 1 kolom di 390; 7 judul kelompok kategori |
| Pencarian | "pasta" → 1 hasil; "xyzzy" → keadaan kosong dengan tombol reset; tombol hapus muncul dan mengosongkan; pencarian tetap bekerja setelah filter kategori ("kopi" + Manual Brew → 5 item) |
| Filter status | "Terkini" → 7 item |
| Pengurutan | A-Z mulai "Aeropress Coffee"; Z-A mulai "Waffle"; "Per kategori" kembali ke kelompok |
| Favorit | Hati diklik → `aria-pressed="true"`, tersimpan di `localStorage`, bertahan setelah muat ulang, tampilan "Favorit Saya" menampilkan item yang disimpan; keadaan kosong informatif |
| Detail | Terbuka dengan foto/placeholder, status, sumber bertautan, varian; Escape menutup dan mengembalikan fokus; hash `#m/<id>` diperbarui dan dikembalikan ke `#menu` |
| Tautan langsung | Memuat `#m/waffle` membuka detail Waffle |
| Bagikan | `navigator.share` tidak ada di pane → jalur cadangan. Salin ke clipboard **ditolak** di pane ini, jadi cadangan terakhir `prompt` ditambahkan; belum diuji ulang setelah itu |
| Escape pada drawer pesanan | Tombol Escape sungguhan menutup drawer; fokus awal pada tombol Tutup |
| Pesanan | Tambah, varian (Teh Panas → English Breakfast), ubah jumlah, hapus; jumlah tampil di header/bar ponsel dan bertahan setelah muat ulang; pesan WhatsApp tersusun benar (nama, cara menikmati, catatan) dan tautan mengarah ke `wa.me/6281229418452`; tidak ada total harga |
| Galeri | Filter Interior 6, Coffee 3, Semua 9; lightbox: klik, panah kiri/kanan, tombol Berikutnya/Sebelumnya, geser sentuh (simulasi pointer), putar kembali dari 9 ke 1, Escape, fokus kembali ke thumbnail, kredit dan indikator "Foto n dari 9" |
| Grid galeri 1440 | 12 kolom; unggulan 1240x458, tinggi 405x662, baku 405x349, lebar 823x349, empat foto 301x458 |
| Efek | Tombol footer mengubah kelas `fx`, label, `aria-pressed`, dan tersimpan; saat mati semua elemen reveal terlihat; tilt kartu mengatur `--rx/--ry` (4 derajat) dan reset saat pointer keluar; kanvas 3D tampil dengan biji kopi; tidak ada loop saat efek mati |
| Cetak | Tombol memanggil `window.print()` dan mengisi daftar 32 item dalam 7 kategori (tampilan cetak CSS tidak diperiksa secara visual) |
| Responsif | Header desktop: nav + tombol Pesanan; ponsel: hamburger + bar aksi 4 tombol |
| axe-core 4.9.1 (WCAG 2.0/2.1 A, AA, best practice) | **0 pelanggaran**, 55 aturan lolos. 3 item "incomplete": kontras caption galeri di atas gradien (diperkuat lalu), figcaption hero tertimpa kanvas, dan satu `aria-label` pada `span` (dihapus) |
| Kontras warna dihitung | arang/krem 11,98; teks sekunder/krem 7,21 dan /krem-2 6,45; zaitun/krem 6,07; krem/zaitun 6,07; hijau lembut/arang 8,05; krem/tanah 4,84 (placeholder frappe/pastry); tanah/krem-2 4,33 hanya untuk kicker 24 px |

**Tidak diuji:** Safari, Firefox, perangkat iOS/Android sungguhan, pembaca layar sungguhan, tampilan cetak secara visual, `navigator.share` di perangkat yang mendukungnya, performa di perangkat lemah (WebGL + efek), penanda nav aktif dan reveal di jendela yang terlihat, kecocokan WhatsApp dengan aplikasi terpasang.

## 5. Daftar yang belum dapat diverifikasi

**Menu (butuh konfirmasi kedai):**
- Harga semua menu dan ketersediaan saat ini.
- 22 item berstatus Historis (hanya terbaca pada papan menu Maret 2019) dan 3 item Belum pasti (Cappuccino, Iced Latte, Green Tea Latte).
- Nama resmi "Spaghetti Pedas Cakalang" (ditulis seperti pada ulasan) dan apakah "Kentang Goreng" di ulasan = Parmesan Truffle Fries / Calibre Ultimate Fries.
- Item yang diminta tetapi tidak ditemukan (arsip penelitian): V60, Piccolo Latte, French Vanilla, Ice Chocolate, Spaghetti Primavera, Burrito, Belgian Waffle.
- Papan menu yang lebih baru: foto menu di Google Maps tidak dapat dibuka tanpa login.

**Foto:** izin penggunaan semua foto; foto resmi Calibre untuk menggantikan; foto produk untuk 30 menu.

**Fasilitas:** Wi-Fi, colokan, parkir, take away, kartu kredit, halal (agregator/ulasan, bukan pemilik); detail "smoking room".

**Lain-lain:** nomor (031) 545-4801, logo resmi, jam hari libur.


---

# Tambahan v3 (permintaan pemilik proyek)

## Perubahan dan keputusan

| Permintaan | Keputusan | Catatan |
|---|---|---|
| Harga kira-kira | Dikerjakan, berlabel "≈" + penjelasan "tebakan perancang, bukan harga resmi" di kartu, detail, pesanan, FAQ, cetak | Dasar tebakan di `menu-data.js`: kisaran Rp25-50 rb per orang (GoPay, Maps), harga papan 2019 naik 15-30%, jenis hidangan. **Tidak ada satu pun harga yang terverifikasi**; sebagian pernyataan di bagian 1-5 di atas ("harga tidak ditampilkan") digantikan oleh bagian ini |
| Gambar dari Pinterest | **Ditolak** | Ketentuan Pinterest, hak cipta, bukan foto Calibre. Diganti 12 jenis ilustrasi vektor orisinal |
| Pilihan pembayaran | Preferensi dalam pesan WhatsApp | Tidak ada payment gateway; kasir/QRIS/transfer-e-wallet ditentukan kedai. Ketersediaan QRIS dan transfer tidak terverifikasi |
| Hapus "Ruang" dan gambarnya | Dikerjakan | Galeri, lightbox, nav, 6 foto dihapus; 3 foto kedai dipertahankan di Cerita sebagai kolase |
| Desain per halaman | Ditafsirkan sebagai tiap bagian dirancang berbeda | Situs tetap satu halaman. Jika yang dimaksud halaman terpisah (multi-page), beri tahu |
| Hero baru, 3D bukan biji kopi | Gelas es kopi berlapis 3D + stiker + badge | Cairan berlapis, es batu, sedotan, sleeve CALIBRE; drag untuk memutar; cadangan SVG bila WebGL gagal |
| Efek lebih banyak, target remaja sampai kantoran | Ditambah | Lihat README; semua mati dengan `prefers-reduced-motion` atau tombol footer |

## Hasil pengujian v3 (benar-benar dijalankan)

Lingkungan sama (pane hidden: transisi, rAF, IntersectionObserver tidak berjalan).

| Area | Hasil |
|---|---|
| Konsol | Tanpa error di 390 px dan desktop |
| Kartu dan ilustrasi | 32 kartu, 32 ilustrasi; 18 varian ilustrasi dirender di lembar kontak sementara dan semuanya terbaca |
| Harga perkiraan | Urut termurah mulai Kopi Tubruk (≈ Rp 25-35 rb); termahal Spaghetti Pedas Cakalang (≈ Rp 50-65 rb); detail menampilkan penjelasan tebakan |
| Total pesanan | 3 Teh Panas + 3 Waffle + 2 Aglio Olio + 1 Calibre Latte = Rp 320-435 rb, cocok dengan hitungan manual |
| Pembayaran | 3 opsi, pilihan tersimpan, masuk ke pesan WhatsApp bersama perkiraan total |
| WhatsApp | Tautan ke `wa.me/6281229418452`, pesan benar |
| Efek | Klik tambah: 12 partikel + 1 titik terbang + penghitung `bump`; favorit: 9 partikel hati; partikel dibersihkan setelah animasi |
| 3D | Gelas tampil di hero (tangkapan layar), fallback SVG diuji tidak aktif karena WebGL tersedia |
| Overflow | Tidak ada di 390 px dengan efek aktif; bagian bawah halaman tidak melebihi lebar |
| axe-core 4.9.1 | **0 pelanggaran**, 51 aturan lolos; 15 kontras "incomplete" (teks di atas gradien/kanvas) |
| Dihapus | `#ruang`, `[data-galeri]`, `gallery.js`, `beans3d.js`, foto galeri: tidak ada lagi di proyek |

**Tidak diuji:** loop animasi pada jendela yang terlihat, drag pada gelas 3D dengan sentuhan nyata, Safari/Firefox, perangkat nyata, pembaca layar, performa di perangkat lemah (WebGL + banyak efek), tampilan cetak visual, bagian Menu dan Kunjungi pada 1440 px setelah desain ulang (hero dan Cerita dicek: grid 2 kolom, kolase 3 polaroid, katalog 3 kolom, tanpa overflow).

## Risiko desain yang perlu Anda putuskan

- Bayangan keras (stiker, harga, polaroid) dan banyak gerak adalah pilihan gaya untuk target muda; jika terasa terlalu ramai, matikan efek di footer atau minta versi lebih tenang.
- Harga perkiraan bisa terbaca sebagai harga asli oleh pengunjung walau diberi label. Ganti dengan harga resmi secepatnya.

## Tambahan: pembuka scroll-expansion

Diuji (desktop 1024 px dan ponsel 390 px): kemajuan `--p` 0 / 0,5 / 1 menghasilkan foto 300x400 / 629x530 / 959x660 px (desktop) dan 240x320 / 371x726 px (ponsel); judul memudar menjadi 0, keterangan muncul di akhir; tanpa overflow dan tanpa error konsol; efek dimatikan memberi mode statis (tinggi 978 px, foto penuh, keterangan terlihat). Tidak diuji: scroll sungguhan dengan jari/roda di jendela terlihat, Safari/Firefox.


---

# Tambahan v4

| Permintaan | Hasil |
|---|---|
| Pisah per halaman + animasi pindah | 6 halaman via router hash; tirai 5 pita; back/forward, deep link `#m/<id>`, judul tab, fokus dan live region |
| Pembayaran lebih lengkap dan canggih | Checkout 5 langkah, validasi, slot waktu dari jadwal buka, 5 metode bayar (+ sub-pilihan bank/e-wallet), kode pesanan, status, cetak ringkasan, riwayat. **Bukan pembayaran sungguhan** (butuh gateway + merchant + backend) |
| Foto real untuk referensi | 30 foto Wikimedia Commons berlisensi bebas dengan atribusi (bukan Pinterest/Google). Dipilih secara visual dari kandidat; kecocokan berupa jenis hidangan, bukan menu persis |

Diuji (390 px dan 740 px, efek aktif dan mati):
- Pindah halaman: kelas tirai `is-on` pada 100/500 ms, halaman berganti sekitar 680 ms (`is-out`), tirai bersih sekitar 1,4 detik; back mengembalikan Beranda; `#m/waffle` membuka halaman Menu dan detail Waffle.
- Checkout: validasi kosong (nama, HP), pilihan metode wajib, sub-pilihan wajib (bank), centang pemahaman wajib; slot waktu "Secepatnya / Hari ini 15.30 WIB"; pesan WhatsApp lengkap (kode, item, nama, HP, cara menikmati, waktu, pembayaran, perkiraan total) ke `wa.me/6281229418452`; riwayat tersimpan; status "dikonfirmasi" dapat ditandai; cetak ringkasan memanggil `window.print`; "Pesan lagi" mengisi ulang keranjang.
- Foto: 32 kartu berfoto (30 referensi + 2 Calibre 2019), 0 gambar rusak.
- axe-core 4.9.1 pada 6 halaman: **0 pelanggaran** setelah memperbaiki h1 per halaman, urutan heading, kontras tombol riwayat, dan landmark `aside`. Tanpa overflow di 390 px. Konsol bersih.

Tidak diuji: pembayaran/WhatsApp pada perangkat sungguhan (tab WhatsApp tidak dibuka saat uji), animasi tirai pada jendela yang terlihat (hanya kelas dan waktu), Safari/Firefox, pembaca layar, tampilan cetak ringkasan secara visual, tata letak desktop 1440 px untuk halaman Beranda/Pesan setelah v4.

Risiko: foto referensi CC BY-SA mewajibkan atribusi (tersedia); beberapa foto kurang cocok dengan menu (mis. "Froot Loops Blast Frappe" memakai frappe krim kocok); "Teh Panas" memakai teh susu. Ganti dengan foto Calibre bila ada izin.

## Tambahan v5

Diuji (390 px dan 900/1280 px): judul pembuka "Calibre Coffee Roasters"; navbar desktop (pil, indikator berpindah ke `li` yang disorot: ix 90 px, lebar 79 px) dan CTA disembunyikan di 900-1099 px agar tidak terlipat; menu ponsel (tertutup: `visibility hidden`, terbuka: tautan opasitas 1, label "Tutup", `aria-expanded=true`, kunci scroll `html.nav-open`, tanpa overflow); transisi gelombang: `is-on` (0-850 ms) lalu halaman berganti, `is-out`, bersih pada ~1,7 detik, menu ponsel menutup dan kunci scroll dilepas; axe-core 0 pelanggaran di Beranda, Cerita, Menu, Pesan.
Tidak diuji: tampilan visual gelombang dan gelembung saat bergerak (pane tersembunyi tidak merender transisi; hanya urutan kelas dan waktu), perilaku bersembunyi navbar saat scroll sungguhan, Safari/Firefox (kompatibilitas `clip-path` dan properti `translate`/`scale`).

## Tambahan v6 (navbar)

Pengukuran desktop 1100 px: menu tepat di tengah bar (selisih 0 px), keempat elemen sejajar vertikal (selisih 0 px), jarak tepi kiri 16 px dan kanan 14 px, radius 16/12/12 px, latar arang, tautan aktif hijau lembut. Ponsel 390 px: bar 370x68, tombol Jelajah 100x44, logo di atas overlay, tanpa overflow; axe-core 0 pelanggaran (menu terbuka dan tertutup). Temuan selama pengujian: CSS lama tertahan di cache browser, diatasi dengan parameter versi pada berkas lokal. Tidak diuji: penilaian visual desktop dari tangkapan layar (pane mengecilkan tampilan 1100 px sehingga hanya diukur lewat dimensi), Safari/Firefox.

## Tambahan v7

Diuji: uji mandiri `tests/smoke.html` **23 lulus, 0 gagal** (setelah memperbaiki satu uji yang terkontaminasi data tersimpan); Three.js tidak dimuat sampai hero terlihat dan dimuat otomatis (1 tag skrip), tombol Es/Panas mengubah `aria-pressed` dan tampilan (mode Panas terlihat: kopi berbusa dan uap, tanpa es/sedotan); kartu dibalik menampilkan sumber ("Ulasan pengunjung di Google Maps") dan memberi `inert` pada sisi depan; `srcset` 400/800 terpasang; JSON-LD valid (`CafeOrCoffeeShop`), `robots noindex`, deskripsi dan `og:title` berubah per halaman; banner studi tertutup dan tersimpan; "Hapus data" menghapus 5 kunci `calibre:*` menjadi 0; axe-core 0 pelanggaran pada Beranda, Menu, dan Info.
Temuan: `IntersectionObserver` tidak terkirim di pane tersembunyi sehingga Three.js tidak mulai; ditambah pemicu cadangan (cek posisi hero setelah 1,2 detik dan saat pindah ke Beranda).
Tidak diuji: Safari/Firefox/perangkat nyata (daftar di TESTING.md), pembaca layar, kinerja pada jaringan lambat, tampilan visual balik kartu 3D, slot video (tanpa berkas), analitik (dinonaktifkan), tema musiman (dinonaktifkan).
