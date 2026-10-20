# BENCHMARK_DAN_FITUR.md: pembanding, resume fitur, dan kelebihan

Dokumen ini membandingkan situs studi Calibre dengan praktik situs dan aplikasi kedai kopi lain. Sumber pembanding adalah artikel dan halaman publik (diperiksa 20 Okt 2026), sebagian berupa blog agensi atau unggahan pengguna, jadi diperlakukan sebagai pendapat, bukan standar. Untuk bukti utama, buka situs aslinya.

## 1. Pembanding

| Pembanding | Yang dikenal dari sumber | Padanan di situs ini |
|---|---|---|
| Blue Bottle (luar negeri) | Tata letak minimalis, profil rasa dan roast per produk, kuis pemilihan produk ([ulasan](https://boostifythemes.com/best-shopify-coffee-shop-websites/), [daftar](https://mycodelesswebsite.com/coffee-shop-websites/)) | Profil rasa (bar dan tasting notes), "Tanya barista" 3 pertanyaan |
| Stumptown (luar negeri) | Desain bercerita, halaman produk dengan asal dan catatan rasa, lokator kedai terpisah dari toko ([ulasan](https://boostifythemes.com/best-shopify-coffee-shop-websites/)) | Halaman Cerita bersumber, halaman Kunjungi terpisah dari Pesan |
| Starbucks (aplikasi) | Favorit dan pesan ulang, kustomisasi langkah demi langkah, reward di alur pesan ([Built In](https://builtin.com/design-ux/starbucks-mobile-loyalty-rewards-order-payment), [studi kasus](https://medium.com/@the_manifest/the-success-of-starbucks-app-a-case-study-f0af6709004d)) | "Pesan lagi favoritmu", kustomisasi minuman, voucher |
| Fore Coffee (Indonesia) | Ambil sendiri atau antar, poin dan voucher, langganan ([Fore](https://fore.coffee/ngopi-jadi-praktis-dengan-aplikasi-fore-coffee/), unggahan pengguna) | Dine-in/pick-up, voucher. Voucher dan langganan belum ada |
| Kopi Kenangan dan Janji Jiwa (Indonesia) | Aplikasi loyalitas, pickup dan delivery, notifikasi pesanan siap, outlet terdekat, pembayaran e-wallet ([Kompas](https://www.kompas.com/food/read/2020/09/17/181100075/pesan-kopi-dan-toast-janji-jiwa-kini-lebih-mudah-seperti-apa), [Suara](https://www.suara.com/lifestyle/2020/09/16/170932/janji-jiwa-rilis-aplikasi-khusus-ini-keuntungannya)) | Pick-up, status pesanan langsung. Notifikasi dan e-wallet dalam aplikasi butuh backend |
| Panduan umum situs kedai 2026 | Jam dan lokasi di depan, menu sebagai teks HTML (bukan PDF/gambar), pemesanan di domain sendiri, label alergen, aksesibilitas, cepat di ponsel ([ringkasan](https://qrolic.com/blog/coffee-shop-website-essential-features/), [panduan aksesibilitas](https://ratedwithai.com/blog/coffee-shop-ada-compliance-2026)) | Semua terpenuhi kecuali pemesanan di domain sendiri (memakai WhatsApp) |

Catatan: untuk Fore dan Tuku hasil pencarian terbatas dan sebagian dari unggahan pengguna; untuk Onyx tidak ada sumber yang membahas situsnya, jadi tidak dibandingkan.

## 2. Resume fitur (v1 sampai v10)

**Konten dan identitas:** 6 halaman (Beranda, Cerita, Menu, Kunjungi, Info, Pesan) dengan transisi tirai kopi; palet dari logo; Bahasa Indonesia; setiap fakta bersumber (SOURCES.md, IMAGE_SOURCES.md).
**Menu:** 32 item data-driven; cari, filter kategori dan status, urut harga; favorit; balik kartu (sumber dan status); detail dengan tautan langsung `#m/<id>`; bagikan; cetak; profil rasa; tag alergen; "Tanya barista".
**Pesan:** keranjang; kustomisasi suhu, level es, extra shot, oat milk dengan gelas SVG dan harga bergulir; saran pasangan; dine-in (`?table=08`) atau pick-up dengan jam; checkout 4 langkah dengan ringkasan; 5 preferensi pembayaran; kirim ke WhatsApp; riwayat; pesan lagi favorit; voucher; bayar online.
**Pembayaran online:** backend Midtrans siap (`server/`), harga dihitung ulang di server; belum aktif sampai akun merchant Calibre ada.
**Admin:** Google Sheets untuk harga, habis/sembunyi, label, tag, profil rasa, suasana, menu baru; `tools/sync-menu.js` menyelaraskan data.
**Pengalaman:** landing page; tema siang/malam otomatis; hero 3D dengan mode Es/Panas (dimatikan di perangkat lemah); jelajahi ruang dengan titik interaktif; pill suasana; efek gerak yang bisa dimatikan.
**Teknis dan etika:** PWA (service worker, bisa dipasang); axe 0 pelanggaran; satu `h1` per halaman; keyboard dan pembaca layar; `noindex` dan banner studi; opsi hapus data saya; analitik default mati; JSON-LD.

## 3. Kelebihan dibanding situs kedai biasa

1. **Jujur soal data.** Setiap menu, fasilitas, dan foto menyebut sumber dan tanggalnya; foto referensi diberi label; harga dan profil rasa contoh ditandai. Kebanyakan situs kedai tidak menunjukkan asal informasinya.
2. **Bisa dipakai tanpa backend.** Pemesanan lewat WhatsApp sesuai kebiasaan kedai kecil di Indonesia, tanpa biaya gateway, dan jalur pembayaran online sudah disiapkan untuk nanti.
3. **Dikelola pemilik sendiri.** Harga dan ketersediaan diubah di spreadsheet, tanpa menyentuh kode.
4. **Pengalaman setara aplikasi.** Kustomisasi, pesan ulang, voucher, dan tanya barista ada di situs web biasa tanpa unduhan.
5. **Aksesibel dan ringan.** Lolos audit otomatis, bisa dipakai dengan keyboard, mendukung gerak dikurangi, dan 3D tidak dimuat di perangkat lemah atau mode hemat data.
6. **Privasi.** Data pesanan dan favorit hanya di browser pengunjung; analitik mati secara bawaan; ada tombol hapus data.
7. **Desain berkarakter.** Tema waktu siang/malam mengikuti suasana kaca dan lampu kedai, bukan templat generik.

## 4. Pembaruan v11 dan sisa kekurangan

Ditambahkan: notifikasi pesanan siap (status langsung, toast, getar, notifikasi browser), voucher, paket langganan (konsep), bayar di dalam situs lewat Midtrans Snap, panel kasir, dan versi bahasa Inggris. Backend pesanan, status, dan voucher sudah diuji end-to-end secara lokal (16 pemeriksaan). Jalur Midtrans dan Upstash Redis ditulis tetapi belum dijalankan terhadap layanan aslinya karena butuh akun.

Belum ada: Web Push saat tab ditutup, penukaran voucher per minuman dan langganan berulang yang otomatis, pembatasan sekali pakai voucher, terjemahan deskripsi menu dan FAQ, serta penyimpanan permanen status pesanan. Harga, foto produk, dan profil rasa asli masih menunggu Calibre. Belum diuji di Safari, Firefox, dan perangkat nyata (lihat TESTING.md).

## 5. Perbandingan ulang dengan beranda situs sungguhan (20 Okt 2026)

Berbeda dari bagian 1 (artikel dan ulasan), bagian ini berdasarkan isi beranda yang dibuka langsung. Blue Bottle menolak akses otomatis (403), Anomali hanya mengembalikan satu kata (halaman dirender JavaScript), dan Arabica dialihkan ke domain lain, jadi ketiganya tidak dibandingkan.

| Situs | Yang terlihat di beranda | Padanan di situs ini |
|---|---|---|
| [Onyx Coffee Lab](https://onyxcoffeelab.com) (AS) | Mega-menu dengan kartu promo, pencarian, login, keranjang; blok langganan; profil petani; produk unggulan dengan catatan rasa; tautan lompat ke konten | Dropdown Menu dan Info; profil rasa dan catatan rasa; langganan hanya konsep; belum ada profil asal biji |
| [Intelligentsia](https://www.intelligentsia.com) (AS) | Menu utama dengan submenu; keranjang geser (drawer) dengan indikator gratis ongkir dan saran produk; "Welcome Back" yang dipersonalisasi; langganan tiga langkah; lapisan pencarian dengan saran | Saran pasangan di checkout; "Pesan lagi favoritmu"; saran pencarian cepat. **Belum ada keranjang geser** |
| [Starbucks Indonesia](https://www.starbucks.co.id) | Mega-menu bersarang, "Looking for..." per niat, pencari kopi, Find A Store di header, sertifikat Halal dan ISO di footer | Dropdown bersarang, "Tanya barista", rute di halaman Kunjungi. **Belum ada sertifikasi atau lencana kepercayaan** (data halal hanya dari agregator) |
| [Kopi Kenangan](https://www.kopikenangan.com) | Order, VIP, About; submenu; ikon keranjang dengan penghitung; banner promo bulanan; tautan outlet terdekat; kanal pengaduan WhatsApp; umpan Instagram; navigasi ponsel berlipat | Keranjang bertanda angka; menu ponsel akordeon; kontak WhatsApp. **Belum ada banner promo, umpan Instagram, berita** |
| [Fore Coffee](https://fore.coffee) | Tombol Download App berulang, pemilih bahasa (EN, SG, ID), banner promo, kampanye referral berpoin, berita, testimoni mitra | Tombol bahasa EN/ID; pasang PWA. **Belum ada promo, berita, referral** |

### Kesimpulan jujur
- **Sesuai untuk tujuannya.** Situs jaringan besar adalah corong menuju aplikasi (unduh aplikasi, poin, promo). Situs ini melayani kedai tunggal yang menerima pesanan lewat WhatsApp, jadi tidak perlu meniru corong aplikasi. Pola yang memang relevan sudah ada: mega-menu, menu ponsel berlipat, pemilih bahasa, lompat ke konten, saran personal, pencari rekomendasi.
- **Lebih unggul:** sumber dan tanggal pada tiap menu dan foto, aksesibilitas terukur (axe 0), pesan tanpa unduh aplikasi, kustomisasi minuman di web, dikelola pemilik lewat spreadsheet. Situs pembanding yang dibuka tidak menampilkan hal serupa.
- **Tertinggal:** keranjang geser (drawer) seperti Intelligentsia; pencarian dari header (Onyx, Intelligentsia); banner promo dan berita (Fore, Kopi Kenangan); lencana kepercayaan di footer (Starbucks, Kopi Kenangan); umpan Instagram; profil asal biji dan petani (Onyx); pendaftaran email. Sebagian butuh data atau izin Calibre (promo, sertifikasi, foto Instagram, asal biji), sebagian murni pekerjaan antarmuka (keranjang geser, pencarian header).
