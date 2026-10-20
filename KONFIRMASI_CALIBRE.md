# KONFIRMASI_CALIBRE.md: daftar yang perlu dikonfirmasi ke Calibre

Situs ini adalah **rancangan studi desain independen**. Dokumen ini membantu pembuat proyek menghubungi Calibre Coffee Roasters (WhatsApp 0812-2941-8452, Instagram @calibrecoffeeroasters) untuk memastikan informasi dan meminta izin. Isi kolom "Jawaban" lalu perbarui `js/data.js`, `js/menu-data.js`, dan SOURCES.md.

## Pesan yang bisa disalin (WhatsApp atau DM Instagram)

> Halo Kak, saya [nama], mahasiswa/pembuat proyek studi desain website untuk Calibre Coffee Roasters (bukan website resmi, belum dipublikasikan). Boleh minta bantuan konfirmasi beberapa hal supaya informasinya benar?
> 1) Daftar menu dan harga terbaru (boleh foto papan menu atau PDF).
> 2) Apakah ada Wi-Fi, colokan, dan parkir? Apakah kartu, QRIS, dan e-wallet diterima?
> 3) Jam buka pada hari libur nasional.
> 4) Apakah Kakak berkenan menerima pesanan lewat WhatsApp dari website ini (format pesan seperti di draft)?
> 5) Bolehkah saya memakai foto dari Instagram/Google Maps Calibre, atau Kakak bisa kirim foto resmi? Dan bolehkah nama serta logo dipakai di situs studi ini?
> Terima kasih banyak, Kak.

## Daftar pertanyaan

| # | Pertanyaan | Mengapa penting | Jawaban |
|---|---|---|---|
| 1 | Daftar menu aktif beserta nama resmi, varian, dan **harga resmi** | 22 dari 32 menu hanya bersumber papan 2019; semua harga di situs adalah tebakan | |
| 2 | Apakah "Spaghetti Pedas Cakalang" nama resmi? Apakah "kentang" di ulasan = Parmesan Truffle Fries atau Calibre Ultimate Fries? | Nama dari ulasan, belum pasti | |
| 3 | Item yang tidak ada lagi: V60, Piccolo, French Vanilla, Ice Chocolate, Spaghetti Primavera, Burrito, Belgian Waffle? | Daftar "arsip penelitian" | |
| 4 | Wi-Fi, colokan, parkir, take away, ruang merokok | Hanya dari ulasan dan agregator | |
| 5 | Metode pembayaran: tunai, kartu, QRIS, transfer, e-wallet (mana yang diterima) | Label "belum dikonfirmasi" pada checkout | |
| 6 | Jam buka hari libur nasional dan nomor (031) 545-4801 masih aktif? | Jadwal reguler saja | |
| 7 | Bersedia menerima pesanan lewat WhatsApp dari situs ini, dan format pesan yang disukai | Fitur pesan mengirim ke nomor kedai | |
| 8 | **Izin foto**: foto Calibre (Maps/Instagram/blog) boleh dipakai? Atau foto resmi untuk menu dan suasana | Semua foto kedai masih milik pihak ketiga tanpa izin tertulis | |
| 9 | Izin memakai nama "Calibre", tulisan CALIBRE pada gelas 3D, dan logo resmi | Saat ini identitas tipografis konsep | |
| 10 | Bersedia video pendek suasana (untuk slot `CALIBRE.video`)? | Slot sudah siap, belum ada video | |

## Setelah ada izin tertulis

1. Ganti harga perkiraan dengan harga resmi (`harga` di `js/menu-data.js`), ubah label "perkiraan" di `menu.js`, `order.js`, `checkout.js`, dan `index.html`.
2. Ganti foto referensi dengan foto resmi (hapus `referensi: true`), perbarui IMAGE_SOURCES.md.
3. Hapus `<meta name="robots" content="noindex, nofollow">` di `index.html` hanya jika Calibre menyetujui situs dipublikasikan, dan ubah banner studi sesuai kesepakatan.
4. Isi `CALIBRE.kontakProyek` di `js/data.js`.
