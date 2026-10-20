/*
  Voucher. Definisi ada di CALIBRE.voucher (js/data.js): { kode, jenis: "persen"|"nominal", nilai, min, maks, sampai, contoh }.
  Browser menghitung potongan untuk tampilan; bila backend dipasang, server menghitung ulang dari server/voucher.json
  (dihasilkan oleh tools/sync-menu.js dari definisi yang sama) sehingga potongan tidak bisa dipalsukan.
  Voucher bawaan adalah CONTOH untuk rancangan studi desain, ditandai di layar.
*/
(function () {
  "use strict";
  const { store } = window.UI;
  const D = window.CALIBRE;
  const KEY = "calibre:voucher:v1";
  const find = (k) => (D.voucher || []).find((v) => v.kode === String(k || "").trim().toUpperCase());
  const idr = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");

  function hitung(v, total) {
    if (!v) return { ok: false, pesan: "Kode voucher tidak dikenal." };
    if (v.sampai && new Date() > new Date(v.sampai + "T23:59:59+07:00")) return { ok: false, pesan: "Voucher sudah kedaluwarsa." };
    if (v.min && total < v.min) return { ok: false, pesan: "Minimal belanja " + idr(v.min) + " untuk voucher ini." };
    let potong = v.jenis === "persen" ? Math.floor(total * v.nilai / 100) : v.nilai;
    if (v.maks) potong = Math.min(potong, v.maks);
    return { ok: true, potong: Math.min(potong, total) };
  }

  const kode = () => { const s = store.get(KEY, null); return s && find(s.kode) ? s.kode : ""; };
  window.Voucher = {
    kode,
    def: () => find(kode()),
    // Potongan (rupiah) untuk total tertentu; 0 bila voucher tidak berlaku.
    potong: (total) => { const v = find(kode()); if (!v || total == null) return 0; const h = hitung(v, total); return h.ok ? h.potong : 0; },
    pakai(k, total) {
      const v = find(k);
      const h = hitung(v, total == null ? 0 : total);
      if (!h.ok) return h;
      store.set(KEY, { kode: v.kode });
      return { ok: true, pesan: `Voucher ${v.kode} dipakai: potongan ${idr(h.potong)}${v.contoh ? " (voucher contoh)" : ""}.`, potong: h.potong };
    },
    hapus() { store.set(KEY, null); },
    idr
  };
})();
