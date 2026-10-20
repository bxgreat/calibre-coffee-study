# ADMIN_MENU.md: kelola menu lewat Google Sheets

Pemilik atau karyawan kedai mengubah harga, ketersediaan, dan menu di spreadsheet. Situs membaca salinannya, jadi tidak perlu menyentuh kode atau mengunggah ulang situs.

## Pasang (sekali, sekitar 5 menit)
1. Buka Google Sheets, buat sheet baru, lalu impor `docs/menu-template.csv` (File > Import > Upload). Baris pertama (judul kolom) jangan diubah.
2. Isi baris untuk setiap menu. Kunci pencocokan adalah kolom `id`, sama dengan `id` di `js/menu-data.js` (mis. `calibre-latte`, `waffle`).
3. File > Share > Publish to web > pilih sheet tersebut > format **CSV** > Publish. Salin tautannya.
4. Tempel tautan itu di `js/data.js`:
   ```js
   sheet: { csvUrl: "https://docs.google.com/spreadsheets/d/e/....../pub?output=csv", cacheMenit: 10 },
   ```
5. Selesai. Perubahan di sheet muncul di situs dalam sekitar 10 menit (Google menyegarkan tautan publikasi secara berkala).

## Kolom
| Kolom | Isi | Keterangan |
|---|---|---|
| `id` | kode menu | wajib; huruf kecil, angka, tanda minus |
| `nama` | nama tampil | wajib untuk menu baru |
| `kategori` | `espresso`, `manual`, `noncoffee`, `frappe`, `main`, `bites`, `pastry` | wajib untuk menu baru |
| `harga` | rupiah bulat, mis. `38000` | **satu-satunya cara menjadikan harga "asli"**. Kosong = tetap memakai perkiraan |
| `status` | `ada`, `habis`, `sembunyi` | `habis` mematikan tombol pesan; `sembunyi` menyembunyikan menu |
| `varian` | pisahkan dengan `\|`, mis. `Panas\|Es` | opsional |
| `label` | mis. `Terlaris`, `Pilihan barista` | opsional, tampil sebagai lencana di kartu |
| `deskripsi` | satu kalimat | opsional |
| `foto` | `assets/...` atau `https://...` | opsional; hanya foto milik kedai |

Menu baru (id yang belum ada di situs) wajib punya `nama`, `kategori`, dan `harga`.

## Cara kerja dan keamanan
- Harga di sheet menandai item sebagai harga asli: label "≈ perkiraan" hilang untuk item itu, total di checkout tampil pasti (Rp 76.000), dan kartu memakai lencana hitam. Item tanpa harga tetap berlabel perkiraan.
- Teks dari sheet selalu ditampilkan sebagai teks biasa (tidak dijalankan sebagai HTML).
- Hasil terakhir disimpan di browser pengunjung. Jika Google tidak bisa dijangkau, situs memakai simpanan itu atau data bawaan.
- Sheet yang dipublikasikan bisa dibaca siapa pun yang punya tautannya. Jangan taruh data rahasia di sheet itu.
- Pembayaran online (lihat `PEMBAYARAN.md`) tidak membaca sheet ini. Salin harga resmi yang sama ke `server/harga-resmi.json` (rupiah, per id dan varian) supaya tagihan sama dengan tampilan.

## Batas
Sheet tidak mengubah foto dan deskripsi berumur panjang secara otomatis; untuk itu tetap edit `js/menu-data.js`. Hapus `noindex` dan label studi hanya atas izin Calibre.

## Tambahan v9
- **Kolom profil rasa** (`asam`, `body`, `manis` = 1 sampai 5; `notes` dipisah `|`) menimpa profil contoh di panel detail menu kopi.
- **Baris `suasana`**: `status` = `tenang`, `sedang`, atau `ramai`, `deskripsi` = keterangan singkat. Tampil sebagai pill di beranda dan halaman Kunjungi; tanpa baris ini tampil contoh bertanda "(contoh)".
- **Harga tambahan** (extra shot, oat milk) ada di `CALIBRE.opsi` di `js/data.js`; ganti dengan harga kedai.
- **Sinkron data**: jalankan `node tools/sync-menu.js` setelah mengubah `js/menu-data.js` atau `CALIBRE.opsi`. Skrip menulis ulang `server/harga-resmi.json` (hanya harga yang bukan contoh) dan `docs/menu-template.csv`. `node tools/sync-menu.js --cek` gagal bila keduanya tidak sama dengan sumber, cocok dipasang di pemeriksaan sebelum rilis. Harga di Google Sheets tidak otomatis masuk ke `harga-resmi.json`; salin ke `js/menu-data.js` (atau isi `rp`) lalu jalankan skrip.
