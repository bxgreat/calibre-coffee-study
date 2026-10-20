/*
  Admin menu lewat Google Sheets. Pemilik kedai mengubah harga, ketersediaan, dan menu di spreadsheet; situs membaca
  salinan CSV-nya. Panduan: ADMIN_MENU.md, contoh kolom: docs/menu-template.csv.

  Aturan:
  - Hanya baris yang punya kolom "harga" (rupiah bulat) dianggap harga resmi. Tanpa harga, item tetap memakai harga contoh bawaan.
  - status "habis" menonaktifkan tombol pesan, "sembunyi" menyembunyikan item.
  - Baris dengan id baru menambah menu (wajib: id, nama, kategori, harga).
  - Hasil terakhir disimpan di localStorage supaya situs tetap benar saat Sheets gagal dimuat atau sinyal buruk.
  - Data dari Sheets selalu diperlakukan sebagai teks, tidak pernah sebagai HTML.
*/
(function () {
  "use strict";
  const M = window.CALIBRE_MENU, D = window.CALIBRE;
  if (!M || !D) return;
  const KEY = "calibre:sheet:v1";
  const cfg = D.sheet || {};
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (_) { return null; } };

  function parseCsv(t) {
    const rows = []; let row = [], f = "", q = false;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && t[i + 1] === "\n") i++; row.push(f); f = ""; if (row.some((x) => x.trim())) rows.push(row); row = []; }
      else f += c;
    }
    row.push(f); if (row.some((x) => x.trim())) rows.push(row);
    const head = (rows.shift() || []).map((h) => h.trim().toLowerCase());
    return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
  }

  // Terapkan baris ke M.items. Mengembalikan jumlah perubahan.
  function apply(rows) {
    const kat = new Set(M.kategori.map((k) => k.id));
    let n = 0;
    rows.forEach((r) => {
      const id = (r.id || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
      if (!id) return;
      if (id === "suasana") { if (/^(tenang|sedang|ramai)$/i.test(r.status || "")) D.suasana = { status: r.status.toLowerCase(), catatan: (r.deskripsi || "").slice(0, 80), contoh: false }; return; }
      const rp = parseInt((r.harga || "").replace(/[^\d]/g, ""), 10);
      const ada = rp >= 1000 && rp <= 5000000;
      let it = M.items.find((x) => x.id === id);
      if (!it) {
        if (!r.nama || !kat.has(r.kategori) || !ada) return;
        it = { id, art: "cup", harga: [rp / 1000, rp / 1000], nama: r.nama, kategori: r.kategori, status: "terkini", deskripsi: r.deskripsi || "", varian: [], foto: null, sumber: [], baru: true };
        M.items.push(it);
      }
      if (r.nama) it.nama = r.nama;
      if (r.deskripsi) it.deskripsi = r.deskripsi;
      if (r.kategori && kat.has(r.kategori)) it.kategori = r.kategori;
      if (ada) { it.resmi = true; it.contoh = false; it.rp = rp; it.harga = [rp / 1000, rp / 1000]; }
      it.habis = /^(habis|kosong)$/i.test(r.status || "");
      it.sembunyi = /^sembunyi$/i.test(r.status || "");
      if (r.varian) it.varian = r.varian.split("|").map((v) => v.trim()).filter(Boolean);
      if (r.foto && /^(assets\/|https:\/\/)/.test(r.foto)) it.foto = { src: r.foto, w: 800, h: 600, alt: it.nama, kredit: "Foto: milik Calibre Coffee Roasters" };
      if (r.asam || r.body || r.manis) { const c = (v) => Math.max(1, Math.min(5, parseInt(v, 10) || 3)); it.profil = { asam: c(r.asam), body: c(r.body), manis: c(r.manis), notes: (r.notes || "").split("|").map((x) => x.trim()).filter(Boolean).slice(0, 5), contoh: false }; }
      if (r.tag) it.tag = r.tag.split("|").map((x) => x.trim().slice(0, 24)).filter(Boolean).slice(0, 5);
      if (r.label) it.label = r.label.slice(0, 24); // mis. Terlaris, Pilihan barista
      n++;
    });
    M.items = M.items.filter((x) => !x.sembunyi);
    M.sheetAktif = n > 0;
    return n;
  }

  const cached = read();
  if (cached && Array.isArray(cached.rows)) apply(cached.rows);

  if (!cfg.csvUrl) return;
  const maxAge = (cfg.cacheMenit || 10) * 60000;
  if (cached && Date.now() - cached.t < maxAge) return;
  fetch(cfg.csvUrl, { cache: "no-store" })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then((t) => {
      const rows = parseCsv(t);
      if (!rows.length) return;
      const same = cached && JSON.stringify(cached.rows) === JSON.stringify(rows);
      try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), rows })); } catch (_) {}
      if (!same) { apply(rows); window.dispatchEvent(new CustomEvent("calibre:menu")); }
    })
    .catch(() => { /* gagal: tetap memakai cache atau data bawaan */ });
})();
