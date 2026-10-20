/*
  Tambahan v7:
  - Tema musiman (CALIBRE.tema) berupa pita ucapan; default mati.
  - Banner "studi desain" yang dapat ditutup.
  - Metadata per halaman (deskripsi, og:title) mengikuti rute.
  - Tombol "Hapus semua data saya di browser ini".
  - Analitik opsional yang menghormati Do Not Track / Global Privacy Control; default MATI (tanpa permintaan jaringan).
*/
(function () {
  "use strict";
  const { $, $$, store, toast } = window.UI;
  const D = window.CALIBRE;
  if (!D) return;

  /* ---------- Tema musiman ---------- */
  const tb = $("[data-tema-banner]");
  if (D.tema && D.temaTeks && D.temaTeks[D.tema] && tb) {
    document.documentElement.dataset.tema = D.tema;
    tb.textContent = D.temaTeks[D.tema];
    tb.hidden = false;
  }

  /* ---------- Banner studi desain ---------- */
  const studi = $("[data-studi]");
  if (studi) {
    if (store.get("calibre:studi-tutup", false)) studi.hidden = true;
    $("[data-studi-tutup]", studi).addEventListener("click", () => { studi.hidden = true; store.set("calibre:studi-tutup", true); });
  }

  /* ---------- Metadata per halaman ---------- */
  const META = {
    beranda: "Studi desain profil Calibre Coffee Roasters, kedai kopi di Ketabang, Surabaya: menu bersumber, jam buka, rute, dan pesanan lewat WhatsApp.",
    cerita: "Cerita dan suasana Calibre Coffee Roasters di Jl. Walikota Mustajab, Surabaya: atap kaca, kayu, dan tanaman. Rancangan studi desain.",
    menu: "Katalog menu Calibre Coffee Roasters dengan sumber, status, dan harga. Cari, filter, simpan favorit, dan pesan lewat WhatsApp.",
    kunjungi: "Alamat, jam buka, kontak, dan rute Google Maps ke Calibre Coffee Roasters, Jl. Walikota Mustajab, Ketabang, Surabaya.",
    info: "Fasilitas yang disebut sumber, pertanyaan umum, serta transparansi data, privasi, dan status proyek studi desain Calibre.",
    pesan: "Checkout bertahap Calibre: data pemesan, pilihan pembayaran, kode pesanan, dan pengiriman ke WhatsApp. Tidak memproses pembayaran."
  };
  const desc = $('meta[name="description"]');
  const ogt = $('meta[property="og:title"]');
  const ogd = $('meta[property="og:description"]');
  window.addEventListener("routechange", (e) => {
    const r = e.detail.route;
    if (desc && META[r]) desc.setAttribute("content", META[r]);
    if (ogd && META[r]) ogd.setAttribute("content", META[r]);
    if (ogt) ogt.setAttribute("content", document.title);
  });

  /* ---------- Hapus semua data saya ---------- */
  const hapus = $("[data-hapus-data]");
  if (hapus) hapus.addEventListener("click", () => {
    if (!window.confirm("Hapus favorit, keranjang, riwayat pesanan, dan pengaturan yang tersimpan di browser ini? Tindakan ini tidak bisa dibatalkan.")) return;
    try {
      Object.keys(window.localStorage).filter((k) => k.indexOf("calibre:") === 0).forEach((k) => window.localStorage.removeItem(k));
    } catch (_) { /* penyimpanan tidak tersedia */ }
    toast("Data di browser ini dihapus. Memuat ulang.");
    setTimeout(() => window.location.reload(), 900);
  });
  const kp = $("[data-kontak-proyek]");
  if (kp) kp.textContent = D.kontakProyek || "Belum diisi. Pembuat proyek: isi CALIBRE.kontakProyek di js/data.js sebelum situs dibagikan.";

  /* ---------- Analitik opsional (default mati) ---------- */
  const A = D.analitik || {};
  const dnt = navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
  if (A.penyedia && A.kode && !dnt) {
    const path = () => (location.hash || "#/").replace(/^#m\//, "#/menu/");
    if (A.penyedia === "goatcounter") {
      window.goatcounter = { no_onload: true };
      const s = document.createElement("script");
      s.async = true; s.src = "https://gc.zgo.at/count.js";
      s.setAttribute("data-goatcounter", `https://${A.kode}.goatcounter.com/count`);
      s.onload = () => { const c = () => window.goatcounter && window.goatcounter.count && window.goatcounter.count({ path: "/" + path().replace(/^#\/?/, "") }); c(); window.addEventListener("routechange", c); };
      document.head.appendChild(s);
    } else if (A.penyedia === "plausible") {
      const s = document.createElement("script");
      s.defer = true; s.src = "https://plausible.io/js/script.manual.js"; s.setAttribute("data-domain", A.kode);
      s.onload = () => { const c = () => window.plausible && window.plausible("pageview", { u: location.origin + "/" + path().replace(/^#\/?/, "") }); c(); window.addEventListener("routechange", c); };
      document.head.appendChild(s);
    }
  }
})();
