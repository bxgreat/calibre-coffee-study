# TESTING.md: cara menguji situs

## 1. Uji otomatis mandiri (smoke test)

Jalankan server (`python -m http.server 8791` di folder proyek), lalu buka **`http://localhost:8791/tests/smoke.html`** di browser yang ingin diuji (Chrome, Safari, Firefox, atau HP di jaringan yang sama via alamat IP komputer) dan tekan "Jalankan uji". Uji memuat situs di iframe dan memeriksa 23 hal: modul termuat, 32 kartu menu, gambar tidak rusak, satu `h1` per halaman, tanpa scroll horizontal, pindah ke 6 halaman, tombol kembali, tautan menu langsung `#m/<id>`, pencarian, favorit, balik kartu, keranjang dan perkiraan total, validasi checkout, status jadwal, localStorage, pengaturan efek, dan WebGL. Hasil LULUS/GAGAL tampil di halaman dan lingkungan browser dicatat.
Keterbatasan: tidak menguji tampilan visual, animasi, atau pembukaan WhatsApp.

Hasil terakhir (Chrome di pane Claude, 19 Okt 2026, setelah v8): **23 lulus, 0 gagal**. Smoke test memakai `?langsung` agar landing tidak menghalangi. Tambahan v8 yang diuji manual di Chrome: data Sheets tiruan (harga asli, habis, label, menu baru, HTML di-escape), checkout langkah 3 di desktop dan 375 px (tanpa overflow), axe 0 pelanggaran pada landing dan langkah pembayaran.

## 2. Daftar uji manual di perangkat nyata

Centang di setiap perangkat. Catat versi OS dan browser.

| Perangkat / browser | Beranda: gelas 3D tampil, tombol Es/Panas | Navbar (desktop) / menu Jelajah (ponsel) | Transisi halaman | Menu: cari, filter, balik kartu, favorit | Checkout sampai WhatsApp terbuka | Scroll-expansion di Cerita | Tidak ada scroll horizontal |
|---|---|---|---|---|---|---|---|
| iPhone Safari | | | | | | | |
| Android Chrome | | | | | | | |
| Desktop Safari | | | | | | | |
| Desktop Firefox | | | | | | | |
| Desktop Chrome / Edge | | | | | | | |

Tambahan: nyalakan "Kurangi gerakan" di pengaturan sistem lalu pastikan tirai, reveal, dan parallax mati; uji dengan keyboard saja (Tab, Enter, Escape) di menu, checkout, dan dialog; uji dengan pembaca layar (VoiceOver atau TalkBack) minimal pada halaman Menu dan Pesan; uji koneksi lambat (throttling "Slow 4G") untuk skeleton dan pemuatan Three.js; cetak daftar menu (`Ctrl+P` dari tombol "Cetak daftar menu").

## 3. Audit aksesibilitas otomatis

Di konsol browser pada setiap halaman:

```js
const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js'; s.onload = async () => console.log((await axe.run()).violations); document.head.appendChild(s);
```

Terakhir: 0 pelanggaran pada Beranda, Cerita, Menu, Kunjungi, Info, dan Pesan (axe-core 4.9.1).
