# DEPLOY.md: hosting gratis

## Yang sudah berjalan
Situs statis ini dihosting gratis di **GitHub Pages**: <https://bxgreat.github.io/calibre-coffee-study/>
Kode sumber lengkap: <https://github.com/bxgreat/calibre-coffee-study> (cabang `main`). Situs publik berasal dari cabang `gh-pages`, yang berisi hanya hasil `tools/build-static.js` (tanpa `server/`, `tools/`, `tests/`, `kasir.html`, dan `bayar-simulasi.html`).

## Memperbarui situs
Setelah mengubah berkas:
```bash
git add -A && git commit -m "ubah ..." && git push        # simpan sumber ke main
bash tools/deploy-pages.sh                                 # bangun dist/ dan terbitkan ke gh-pages
```
Perubahan tampil sekitar satu menit kemudian. Jika browser masih menampilkan versi lama, tekan Ctrl+Shift+R (service worker memakai jaringan lebih dulu, jadi biasanya cepat).

## Alternatif gratis lain (pakai folder `dist/`)
Jalankan `node tools/build-static.js`, lalu:
- **Cloudflare Pages**: Workers & Pages > Create > Pages > Upload assets, unggah folder `dist/`. Berkas `_headers` terbaca otomatis.
- **Netlify**: unggah folder `dist/` di app.netlify.com/drop. `_headers` terbaca.
- **Vercel**: `vercel dist --prod` (CLI sudah terpasang di komputer ini; perlu `vercel login`).

## Yang perlu diketahui
- Situs berstatus **studi desain** dan berlabel `noindex` (meta dan `robots.txt`): mesin pencari diminta tidak mengindeksnya. Alamat tetap bisa dibuka siapa pun yang punya tautannya.
- Foto referensi dari Wikimedia Commons dicantumkan lengkap dengan kredit dan lisensi (IMAGE_SOURCES.md). Tiga foto kedai (interior, fasad, atap kaca, 2019) berasal dari pihak ketiga dan **belum ada izin tertulis** dari pemiliknya; lihat KONFIRMASI_CALIBRE.md. Bila diminta, hapus dari repositori dan jalankan `deploy-pages.sh` lagi.
- Hosting statis tidak menjalankan `server/`. Pesanan, status langsung, voucher server, dan pembayaran online baru berfungsi bila backend dihosting terpisah (lihat PEMBAYARAN.md). Bawaannya semuanya mati sehingga pemesanan lewat WhatsApp tetap berjalan.
- Domain sendiri (mis. `calibre.id`) tidak gratis; GitHub Pages mendukung domain kustom lewat berkas `CNAME`.
- Repositori bersifat publik (syarat GitHub Pages gratis). Jangan commit `server/.env` atau kunci apa pun; `.gitignore` sudah mengecualikannya.
