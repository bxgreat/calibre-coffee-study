# PROMOSI.md: narasi promosi kelebihan website Calibre

Dasar: BENCHMARK_DAN_FITUR.md (pembanding dan resume fitur) dan hasil uji yang tercatat di TESTING.md. Setiap klaim di bawah ditandai **Terbukti** (sudah diuji), **Contoh** (berfungsi tetapi datanya contoh), atau **Siap, belum live** (kode ada, butuh akun atau data kedai).

## 1. Kalimat inti
> Website kedai kopi yang jujur soal datanya, bisa dipakai pesan hari ini lewat WhatsApp, dan sudah siap naik kelas ke pembayaran online, status pesanan langsung, dan voucher.

Pilihan tagline:
- "Kopi baik, informasi jujur."
- "Dari menu sampai meja, tanpa unduh aplikasi."
- "Satu situs: pesan, bayar, pantau, nikmati."

## 2. Narasi promosi (±250 kata)
Kebanyakan website kedai kopi berhenti di foto cantik dan PDF menu. Website Calibre ini dirancang untuk benar-benar dipakai.

Pengunjung bisa mencari dan menyaring 34 menu, membaca profil rasa, mengatur minuman sendiri (suhu, level es, extra shot, oat milk) sambil melihat gelas dan harga berubah, lalu memesan lewat WhatsApp dalam empat langkah. Bingung memilih? "Tanya barista" memberi dua rekomendasi dari tiga pertanyaan. Pesanan favorit bisa diulang dengan satu ketukan, tanpa login.

Bagi kedai, semua diatur dari spreadsheet: harga, stok habis, label "Terlaris", bahkan suasana kedai. Tidak perlu programmer untuk mengganti harga latte. Untuk langkah berikutnya, backend sudah disiapkan: pesanan masuk ke panel kasir, status "Siap diambil" muncul langsung di layar pembeli, voucher dihitung di server, dan pembayaran online (QRIS, Virtual Account, e-wallet, kartu) lewat Midtrans.

Yang membedakan: kejujuran. Setiap menu, fasilitas, dan foto menyebut sumber dan tanggalnya. Foto referensi diberi label, harga contoh ditandai, dan data pengunjung tidak meninggalkan browser mereka. Situs ini lolos audit aksesibilitas otomatis, tersedia dalam Bahasa Indonesia dan Inggris, dapat dipasang seperti aplikasi, dan tetap ringan di HP sederhana karena efek 3D otomatis dimatikan di sana.

Desainnya mengikuti karakter tempatnya: siang bernuansa atap kaca yang terang, malam berubah menjadi roastery yang hangat.

## 3. Enam keunggulan dan buktinya

| # | Keunggulan | Bukti | Status |
|---|---|---|---|
| 1 | **Transparan dan bersumber.** Menu, fasilitas, dan foto menyebut sumber, tanggal, dan lisensi; yang belum pasti diberi label | SOURCES.md, IMAGE_SOURCES.md, label di kartu menu | Terbukti |
| 2 | **Bisa dipakai tanpa backend.** Pesan lewat WhatsApp, 4 langkah, total dan voucher dihitung, riwayat dan pesan ulang | Smoke test 23/23, alur diuji di Chrome | Terbukti |
| 3 | **Dikelola pemilik sendiri.** Harga, stok habis, label, tag alergen, profil rasa, suasana dari Google Sheets | Diuji dengan data tiruan (harga, habis, menu baru, HTML di-escape) | Terbukti (sheet asli belum dipasang) |
| 4 | **Pengalaman setara aplikasi.** Kustomisasi minuman dengan harga bergulir, profil rasa, tanya barista, pesan lagi favorit, PWA | Diuji di Chrome desktop dan layar 375 px | Terbukti; profil rasa dan harga tambahan **Contoh** |
| 5 | **Inklusif dan ringan.** axe 0 pelanggaran di semua halaman (siang dan malam, ID dan EN), bisa dengan keyboard, mendukung gerak dikurangi, 3D mati di perangkat lemah atau hemat data | Audit axe-core 4.9.1; logika 3D diperiksa sintaks (belum di perangkat low-end nyata) | Terbukti; 3D low-end **belum diuji nyata** |
| 6 | **Siap berkembang ke transaksi penuh.** Panel kasir, status pesanan langsung, notifikasi siap, voucher server, pembayaran online multi-metode | Backend 23 pemeriksaan lulus lokal; alur bayar penuh lulus di mode simulasi | Backend **Terbukti lokal**; Midtrans asli **Siap, belum live** |

## 4. Perbandingan jujur

| Aspek | Situs kedai umum | Aplikasi besar (Starbucks, Fore, Kopi Kenangan, Janji Jiwa) | Situs Calibre ini |
|---|---|---|---|
| Menu berupa teks, bisa dicari | Sering PDF atau gambar | Ya | Ya, plus filter, favorit, cetak |
| Sumber informasi ditampilkan | Hampir tidak pernah | Tidak | **Ya, di setiap item** |
| Kustomisasi minuman | Jarang | Ya | Ya (suhu, es, tambahan) |
| Perlu unduh aplikasi dan buat akun | Tidak ada fitur | Ya | **Tidak perlu** |
| Pemilik ubah harga sendiri | Perlu pengembang | Lewat sistem pusat | **Ya, lewat Google Sheets** |
| Pembayaran dalam aplikasi, poin, langganan otomatis | Tidak ada | **Ya, matang** | Belum live (Midtrans siap; langganan hanya konsep) |
| Notifikasi saat tab ditutup | Tidak ada | **Ya** | Belum (butuh Web Push) |
| Jaringan outlet, ribuan gerai, promo harian | Tidak | **Ya** | Tidak relevan untuk satu kedai |
| Privasi | Beragam | Akun dan pelacakan | **Data di browser, analitik mati bawaan** |

Intinya: situs ini tidak mengalahkan aplikasi jaringan besar dalam skala dan sistem poin. Keunggulannya untuk kedai mandiri: murah dipasang, jujur, mudah dirawat pemilik, dan tetap terasa modern.

## 5. Caption singkat (media sosial)
- "Menu bersumber, harga bisa diubah dari spreadsheet, pesan lewat WhatsApp dalam 4 langkah. Itu website Calibre. #CalibreCoffee #DesainWeb"
- "Atur kopimu sendiri: suhu, es, extra shot. Lihat gelas dan harganya berubah langsung."
- "Siang terang seperti atap kaca, malam hangat seperti roastery. Website yang ikut jam kamu."
- "Bahasa Indonesia atau English, satu ketukan."

## 6. Naskah presentasi 60 detik
"Website kedai biasanya cantik tapi tidak berfungsi. Kami membuat yang sebaliknya, untuk Calibre Coffee Roasters Surabaya. Pengunjung mencari menu, melihat profil rasa, mengatur minumannya, lalu memesan lewat WhatsApp. Pemilik mengganti harga dari Google Sheets tanpa programmer. Setiap informasi menyebut sumbernya, jadi pengunjung tahu mana yang pasti dan mana yang belum. Situs lolos audit aksesibilitas, tersedia dalam dua bahasa, dan bisa dipasang seperti aplikasi. Backend untuk pesanan, status langsung, voucher, dan pembayaran online multi-metode sudah disiapkan dan diuji lokal; tinggal akun gateway dan data resmi dari Calibre. Ini rancangan studi desain independen, jadi harga dan beberapa konten masih contoh."

## 7. Jangan diklaim (belum benar)
- Jangan menyebut ini situs resmi Calibre atau sudah disetujui Calibre (izin belum ada; situs `noindex` dan berlabel studi).
- Jangan menyebut harga, foto produk, atau profil rasa sebagai data asli: semuanya masih contoh atau foto referensi.
- Jangan menyebut pembayaran online "sudah live" atau "sudah memproses uang": yang teruji hanya simulasi. Midtrans asli belum dijalankan.
- Jangan menyebut sudah diuji di semua browser dan perangkat: yang diuji baru Chrome (desktop dan layar 375 px). Safari, Firefox, dan perangkat nyata belum.
- Jangan menyebut notifikasi muncul saat tab ditutup: itu butuh Web Push yang belum dibuat.
- Jangan menyebut langganan otomatis: paket langganan hanya konsep yang dikelola manual lewat WhatsApp.
