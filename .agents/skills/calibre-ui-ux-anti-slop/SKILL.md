---
name: calibre-ui-ux-anti-slop
description: Aturan visual, konten, aksesibilitas, interaksi, dan pemeriksaan kualitas khusus untuk website profil Calibre Coffee Roasters (Surabaya). Skill kustom proyek; melengkapi skill umum antislop, antislop-ui, antislop-copywriting, dan antislop-layoutmobile yang sudah terpasang di lingkungan.
---

# calibre-ui-ux-anti-slop

Skill kustom untuk proyek ini. Dibuat 19 Oktober 2026 dari brief tugas "website profil Calibre Coffee Roasters".
Skill umum `antislop` (inti), `antislop-ui`, `antislop-copywriting`, dan `antislop-layoutmobile`
sudah ada di lingkungan Antigravity/Claude dan tetap berlaku. Skill ini hanya menambahkan
keputusan yang spesifik untuk Calibre: identitas visual, sumber data, struktur halaman, dan daftar uji.

Makna "anti-slop" di proyek ini: desain yang punya identitas sendiri, keputusan visual yang bisa
dijelaskan satu baris, konten yang bersumber, dan interaksi yang berguna bagi pengunjung kedai.

## Design Read (dial antislop)

Dibaca sebagai: halaman profil satu-layar untuk calon pengunjung kedai kopi di Surabaya,
bahasa visual editorial hangat-industrial (beton, kayu, rangka hitam, kaca, tanaman).

- v1: dial ENERGY 2 / RHYTHM 3 / MOTION 1.
- **v2 (19 Okt 2026): ENERGY 3 / RHYTHM 3 / MOTION 3.** Pemilik proyek meminta "efek 3D dan banyak efek".
  Ini override MOTION yang disengaja (R-37: pola diminta pemilik, dicatat di sini, bukan dibuang diam-diam).
  Batasnya: efek tidak menyembunyikan informasi, objek 3D relevan (biji kopi), mati otomatis dengan
  `prefers-reduced-motion`, bisa dimatikan pengunjung (tombol footer), dan tanpa JavaScript semua konten tetap terlihat.
- RHYTHM 3: tiap bagian punya komposisi berbeda (hero asimetris, cerita dua kolom + foto bertingkat, katalog berkelompok, galeri editorial 12 kolom, lokasi gelap dengan peta).

## Identitas visual

Palet (variabel CSS, jangan tambah warna inti lain):

| Token | Nilai | Peran |
|---|---|---|
| `--krem` | `#EEECE3` | latar utama |
| `--arang` | `#292C25` | teks utama, latar bagian gelap |
| `--zaitun` | `#525B3E` | teks sekunder kuat, tombol primer, garis aktif |
| `--hijau-lembut` | `#BDC89E` | latar blok ringan, penanda kategori aktif |
| `--tanah` | `#995432` | aksen tunggal: tautan penting, penanda, satu kata italic |

Aturan aksen: `--tanah` dipakai hemat (tautan, satu penanda per layar). Kontras teks minimal 4,5:1
(teks normal) dan 3:1 (teks besar). Jangan memakai teks `--hijau-lembut` di atas `--krem`.

Tipografi:
- Judul: Anton (fallback: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif), huruf kapital, `line-height` 0,92 sampai 1, ukuran dengan `clamp()`.
- Isi: DM Sans 16 sampai 18 px di desktop, minimal 16 px di ponsel. Catatan kecil minimal 14 px.
- Aksen: Instrument Serif italic, hanya untuk satu frasa pendek per bagian.
- Tidak lebih dari tiga keluarga huruf dan tiga ketebalan.

Komposisi:
- Editorial: hierarki jelas, ruang kosong terukur, garis pembatas tipis 1 px `--arang` dengan opasitas.
- Sudut komponen 0 sampai 4 px. Tidak ada bentuk pil kecuali penanda filter kecil.
- Foto kedai berukuran besar dengan `width`/`height` eksplisit dan `aspect-ratio`.
- Bayangan hanya pada elemen yang benar-benar melayang: menu ponsel dan lightbox.

Dilarang: gradasi ungu-biru, glassmorphism, blob, grid latar, kartu seragam untuk semua bagian,
emoji sebagai identitas, animasi scroll-jacking, foto stok atau foto AI yang dipresentasikan sebagai Calibre,
ikon/panah/tombol tanpa fungsi, teks promosi panjang, em dash (gunakan koma, titik, titik dua, atau kurung).

## Konten dan sumber

- Semua data usaha (nama, alamat, telepon, jam, tautan) berasal dari `js/data.js` dan tercatat di `SOURCES.md` dengan URL, tanggal sumber, dan tanggal pemeriksaan.
- Harga tampil hanya jika sumbernya jelas dan cukup baru. Jika tidak, kolom harga dihilangkan dan ditampilkan satu catatan: "Hubungi kedai untuk informasi harga dan ketersediaan terbaru."
- Menu dari dokumentasi lama diberi label "Pilihan menu dari dokumentasi sebelumnya" beserta tahun sumbernya.
- Tidak ada label bestseller/signature, rating, jumlah ulasan, testimoni, atau fasilitas tanpa sumber. Jika rating dipakai, cantumkan sumber dan tanggal pemeriksaan; jangan memberi kesan data langsung.
- Bedakan informasi pemilik usaha (profil Maps, Instagram) dari ulasan pengunjung. Data yang bertentangan dibandingkan tanggal dan asalnya.
- Foto hanya dari lokasi Calibre yang benar, dengan kredit pengunggah/sumber dan tahun di `SOURCES.md` serta alt text sesuai isi gambar. Watermark dipertahankan.
- Status "Buka sekarang" hanya boleh tampil jika dihitung dari jadwal reguler dalam zona waktu Asia/Jakarta dan disertai catatan bahwa hari libur bisa berbeda.

## Struktur halaman (satu halaman)

Header (CALIBRE / COFFEE ROASTERS, nav: Cerita, Menu, Ruang, Kunjungi, tombol "Temukan Kami" ke Google Maps)
-> Hero "KOPI BAIK. JEDA SEJENAK." -> Cerita "KACA, KAYU, DAN SECANGKIR KOPI." -> Menu "PILIH TEMAN JEDAMU."
-> Galeri "TINGGAL SEDIKIT LAMA." -> Kunjungi "JALAN KE SINI. DUDUK SEJENAK." -> Fasilitas (opsional, hanya yang bersumber)
-> Pertanyaan umum (accordion) -> Footer (identitas, tautan, Instagram, Google Maps, "Sumber & Catatan", penanda proyek studi).

Setiap tautan nav menuju `id` yang ada. Header sticky memakai `scroll-margin-top` pada setiap bagian agar judul tidak tertutup.

## Interaksi dan aksesibilitas

- Semua tombol punya tindakan nyata (anchor ke bagian yang ada, buka/tutup komponen, `tel:`, `https:`, `mailto:`).
- Filter menu: tombol dengan `aria-pressed`, penanda kategori aktif tidak bergantung warna saja (teks tetap, garis bawah/latar), jumlah item mengikuti data, status kosong punya teks.
- Menu ponsel: tombol berlabel "Menu", `aria-expanded`, tertutup oleh Escape dan oleh klik tautan.
- Lightbox: `<dialog>` dengan tombol tutup, Escape, navigasi panah kiri/kanan, fokus terkunci di dalam dialog, dan fokus dikembalikan ke thumbnail yang membukanya.
- Accordion: `<details>/<summary>` asli agar dapat dioperasikan keyboard tanpa JavaScript.
- Target sentuh minimal 44 x 44 px dengan jarak antar target.
- Fokus keyboard terlihat (outline 2 px `--tanah` dengan offset), tidak pernah `outline: none` tanpa pengganti.
- Hormati `prefers-reduced-motion: reduce` dengan mematikan transisi dan smooth scroll.
- Foto di bawah hero memakai `loading="lazy"` dan `decoding="async"`; hero memakai `fetchpriority="high"`.
- Tidak ada scroll horizontal pada 360, 390, 768, 1440 px. Judul display tidak terpotong dan tidak bertabrakan.

## Pemeriksaan sebelum selesai

1. Jalankan situs lewat server statis dan buka di browser.
2. Klik setiap kontrol: nav desktop, nav ponsel buka/tutup, "Temukan Kami", "Jelajahi Menu", "Kenali Calibre", semua filter menu, setiap thumbnail galeri (buka, panah, Escape, fokus kembali), setiap accordion, `tel:`, WhatsApp, Instagram, rute Maps, "Sumber & Catatan".
3. Periksa lebar 1440, 768, 390, 360 px: tanpa scroll horizontal, judul utuh, tombol terjangkau.
4. Periksa konsol browser tanpa error dan semua aset dimuat (status 200).
5. Periksa kontras pasangan warna yang dipakai pada teks.
6. Cocokkan kembali alamat, jam, telepon, dan tautan di hero, Kunjungi, FAQ, footer, dan `SOURCES.md`.
7. Laporkan hasilnya apa adanya, termasuk yang tidak diuji.


## Tambahan v2: katalog, pesanan, efek

Katalog menu
- Kartu hanya dipakai pada katalog (pola berulang memang dibutuhkan untuk dipindai); bagian lain tidak diseragamkan menjadi kartu.
- Setiap item punya `status` (terkini / historis / belum). Terkini hanya jika nama disebut sumber bertanggal 12 bulan terakhir. Label memakai teks + bentuk, tidak hanya warna.
- Item yang diminta tetapi tidak ditemukan masuk `arsip`, bukan katalog. Jangan memakai nama dari brief tanpa bukti.
- Tidak ada kategori "Signature" tanpa sumber yang menandai item sebagai signature. Tidak ada pengurutan harga atau "terlaris".
- Foto produk hanya jika foto memuat satu produk yang jelas dan cocok dengan sumber. Selain itu placeholder tipografis berlabel "Foto menu belum tersedia", dibuat ringkas agar tidak menyaingi kartu berfoto.
- Pencarian, filter, urutan, favorit (localStorage dengan try/catch), detail dengan tautan langsung `#m/<id>`, bagikan (Web Share + cadangan), dan cetak harus benar-benar berfungsi.

Pesanan
- Hanya integrasi nyata: pesan WhatsApp ke nomor yang terverifikasi pada profil Maps. Tanpa pembayaran, tanpa total, tanpa harga rekaan; selalu ada catatan bahwa kedai yang mengonfirmasi.

Efek
- Aktif hanya lewat kelas `html.fx`; semua reveal memakai kelas `.is-in` dan tidak pernah membiarkan konten tersembunyi tanpa JavaScript.
- Tilt, parallax, magnet hanya untuk pointer mouse; sentuh tetap statis. Parallax memakai properti `translate` agar tidak bentrok dengan `transform` reveal.
- Adegan 3D: Three.js terpin (r128 dari cdnjs), berhenti saat hero tidak terlihat atau tab tersembunyi, satu frame statis saat efek dimatikan, kanvas disembunyikan bila WebGL tidak ada. Objek tidak boleh menimpa teks atau keterangan foto.
- Pengujian: pane browser tersembunyi tidak menjalankan transisi, rAF, atau IntersectionObserver. Verifikasi layout dengan efek dimatikan, lalu verifikasi efek lewat nilai gaya, dan catat apa yang tidak dapat dibuktikan.

## Tambahan v3 (permintaan pemilik, 19 Okt 2026)

- Target audiens diperluas: remaja, mahasiswa, pekerja kantoran. Nada boleh lebih santai dan visual lebih berani, tetapi klaim tetap bersumber ("cocok untuk" hanya dari judul GoPay dan topik ulasan Maps).
- Harga **perkiraan** boleh tampil atas permintaan pemilik, wajib berlabel "≈" dan "perkiraan perancang, bukan harga resmi" di kartu, detail, pesanan, FAQ, dan cetak. Ganti dengan harga resmi begitu tersedia.
- Gambar produk: **jangan** mengambil dari Pinterest atau situs lain tanpa izin. Pakai ilustrasi orisinal buatan sendiri (`js/art.js`), dilabeli generik. Foto asli hanya bila ada izin.
- Pembayaran: hanya preferensi dalam pesan WhatsApp; tidak ada pemrosesan uang, tidak ada nomor rekening atau QRIS rekaan.
- Bagian "Ruang" (galeri) dihapus atas permintaan; tiap bagian halaman punya komposisi sendiri (hero panggung 3D, kolase polaroid, poster menu, kunjungi gelap).
- Motif stiker (bayangan keras 2 sampai 3 px, rotasi kecil, bingkai arang) dipakai konsisten pada stiker hero, tile fakta, harga, dan polaroid; itu satu-satunya penggunaan bayangan keras selain panel melayang.
- 3D hero: gelas es kopi (bukan biji kopi). Efek tambahan harus mati dengan `prefers-reduced-motion` dan tombol footer.


## Tambahan v4 (permintaan pemilik, 19 Okt 2026)

- Situs dipisah menjadi halaman (router hash) dengan animasi tirai; tiap halaman punya satu `h1`. Tirai dan transisi hanya aktif dengan `html.fx`.
- Foto menu: hanya dari sumber berlisensi bebas yang dapat diverifikasi (Wikimedia Commons: CC0, domain publik, CC BY, CC BY-SA) dengan atribusi di UI dan di IMAGE_SOURCES.md, berlabel "Foto referensi, bukan menu Calibre". Jangan mengambil dari Pinterest, Google Images, atau situs tanpa lisensi jelas.
- Checkout boleh "lengkap dan canggih" selama tidak berpura-pura memproses uang: tidak ada QRIS, rekening, atau status bayar palsu. Semua metode berlabel belum dikonfirmasi kedai, ada peringatan penipuan, dan status riwayat dicatat sendiri oleh pengunjung.

## Tambahan v5
- Navbar: bar melayang bermotif stiker, indikator geser, sembunyi saat scroll turun (tidak saat fokus di dalam bar atau menu terbuka), menu ponsel layar penuh dengan reveal melingkar dan kunci scroll.
- Transisi halaman "kopi dituang": gelombang berlapis dari palet; hanya dengan `html.fx`; fallback seketika. Judul pembuka memakai nama kedai.

## Tambahan v7
- Etika: situs tetap berlabel studi (banner dapat ditutup + bagian Transparansi), `noindex` sampai ada izin Calibre, data pengguna hanya di localStorage dengan tombol hapus, analitik default mati dan menghormati DNT/GPC.
- Performa: foto kartu `srcset` 400/800, Three.js dimuat hanya saat hero terlihat dengan fallback SVG, skeleton dan fade gambar.
- Kartu menu yang dibalik memakai `inert` pada sisi tersembunyi agar fokus keyboard tidak masuk ke sisi yang tak terlihat.
- Tanpa kursor kustom dan tanpa video otomatis bersuara; video opsional hanya bila gerak diizinkan.
