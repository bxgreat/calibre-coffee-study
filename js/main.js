/*
  Interaksi umum halaman: slot data, navigasi (ponsel dan penanda bagian aktif), jadwal dan status buka,
  fasilitas, FAQ, dialog sumber, tombol kembali ke atas.
  Menu, galeri, pesanan, dan efek ada di berkas terpisah.
*/
(function () {
  "use strict";
  const { $, $$, esc, openDialog } = window.UI;
  const D = window.CALIBRE;
  if (!D) return;

  const ambil = (jalur) => jalur.split(".").reduce((o, k) => (o == null ? undefined : o[k]), D);

  /* ---------- Isi slot data (teks dan href) ---------- */
  $$("[data-text]").forEach((el) => {
    const v = ambil(el.dataset.text);
    if (v != null) el.textContent = v;
  });
  $$("[data-href]").forEach((el) => {
    const v = ambil(el.dataset.href);
    if (v) el.setAttribute("href", v);
  });

  /* ---------- Navigasi ponsel ---------- */
  const toggle = $("[data-nav-toggle]");
  const nav = $("[data-nav]");
  const navLabel = $("[data-nav-label]");

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    navLabel.textContent = open ? "Tutup" : "Jelajah";
    document.documentElement.classList.toggle("nav-open", open);
    if (open) $("[data-header]").classList.remove("is-hidden");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); toggle.focus(); }
    });
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("is-open") && !e.target.closest(".site-header")) setNav(false);
    });
    window.matchMedia("(min-width: 900px)").addEventListener("change", (mq) => { if (mq.matches) setNav(false); });
  }

  /* ---------- Indikator geser pada navigasi desktop dan bar yang bersembunyi saat scroll turun ---------- */
  const navList = $("[data-nav-list]");
  const ind = $("[data-nav-ind]");
  const header = $("[data-header]");
  const navLinks = $$(".nav__link");
  function placeInd(a) {
    if (!ind || !a || getComputedStyle(ind).display === "none") return;
    const li = a.parentElement;
    ind.style.setProperty("--ix", li.offsetLeft + "px");
    ind.style.setProperty("--iw", li.offsetWidth + "px");
    ind.classList.add("is-on");
  }
  function resetInd() {
    const cur = $('.nav__link[aria-current="page"]');
    if (cur) placeInd(cur); else if (ind) ind.classList.remove("is-on");
  }
  navLinks.forEach((a) => {
    a.addEventListener("mouseenter", () => placeInd(a));
    a.addEventListener("focus", () => placeInd(a));
  });
  if (navList) {
    navList.addEventListener("mouseleave", resetInd);
    navList.addEventListener("focusout", (e) => { if (!navList.contains(e.relatedTarget)) resetInd(); });
  }
  window.addEventListener("routechange", () => { resetInd(); if (header) header.classList.remove("is-hidden"); });
  window.addEventListener("resize", resetInd);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resetInd);
  resetInd();

  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (!header || document.documentElement.classList.contains("nav-open")) return;
    if (y > 260 && y > lastY + 10 && !header.contains(document.activeElement)) header.classList.add("is-hidden");
    else if (y < lastY - 6 || y < 120) header.classList.remove("is-hidden");
    lastY = y;
  }, { passive: true });

  /* ---------- Jadwal dan status buka ---------- */
  const jadwalBody = $("[data-jadwal] tbody");
  const statusEl = $("[data-status-buka]");
  const keMenit = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const titik = (hhmm) => hhmm.replace(":", ".");

  // Waktu sekarang di Asia/Jakarta: { hari: 0..6, menit: 0..1439 } atau null jika tidak didukung
  function sekarangWIB() {
    try {
      const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
      const p = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
      const hari = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
      const jam = Number(p.hour) % 24;
      const menit = Number(p.minute);
      if (hari < 0 || Number.isNaN(jam) || Number.isNaN(menit)) return null;
      return { hari, menit: jam * 60 + menit };
    } catch (_) { return null; }
  }
  const kini = sekarangWIB();

  if (jadwalBody) {
    jadwalBody.innerHTML = D.jadwal.map((j, i) => {
      const today = kini && kini.hari === i;
      return `<tr${today ? ' class="is-today"' : ""}><td>${j.hari}${today ? '<span class="hari-ini">hari ini</span>' : ""}</td><td>${titik(j.buka)}–${titik(j.tutup)}</td></tr>`;
    }).join("");
  }
  // Stiker dan ringkasan jam buka di hero (dari jadwal reguler yang sama)
  const stiker = $("[data-buka-sticker]");
  const ringkas = $("[data-buka-ringkas]");
  if (kini && (stiker || ringkas)) {
    const j0 = D.jadwal[kini.hari];
    const b0 = keMenit(j0.buka), t0 = keMenit(j0.tutup);
    const bukaSekarang = kini.menit >= b0 && kini.menit < t0;
    const pendek = bukaSekarang ? `Jadwal: buka sampai ${titik(j0.tutup)} WIB` : (kini.menit < b0 ? `Jadwal: buka ${titik(j0.buka)} WIB` : "Jadwal: sudah tutup");
    if (stiker) { stiker.textContent = pendek; stiker.classList.toggle("is-buka", bukaSekarang); }
    if (ringkas) ringkas.textContent = `${pendek}. Hari libur bisa berbeda.`;
    const tb = $("[data-tile-buka]");
    if (tb) tb.textContent = `${pendek}. Plus rute dan kontak.`;
  }

  if (statusEl && kini) {
    const j = D.jadwal[kini.hari];
    const buka = keMenit(j.buka), tutup = keMenit(j.tutup);
    let teks;
    if (kini.menit >= buka && kini.menit < tutup) teks = `Menurut jadwal reguler, sekarang buka sampai pukul ${titik(j.tutup)} WIB.`;
    else if (kini.menit < buka) teks = `Menurut jadwal reguler, sekarang tutup. Buka hari ini pukul ${titik(j.buka)} WIB.`;
    else { const besok = D.jadwal[(kini.hari + 1) % 7]; teks = `Menurut jadwal reguler, sekarang tutup. Buka lagi ${besok.hari} pukul ${titik(besok.buka)} WIB.`; }
    statusEl.textContent = `${teks} Hari libur bisa berbeda.`;
    statusEl.hidden = false;
  }

  /* ---------- Tile Beranda ---------- */
  const tArt = $("[data-tile-art]");
  if (tArt && window.Art) tArt.innerHTML = window.Art.svg("glass:latte", "");
  const tMenu = $("[data-tile-menu]");
  if (tMenu && window.CALIBRE_MENU) tMenu.textContent = String(window.CALIBRE_MENU.items.length);

  /* ---------- Ilustrasi cadangan hero (tampil bila WebGL tidak ada) ---------- */
  const heroArt = $("[data-hero-art]");
  if (heroArt && window.Art) heroArt.innerHTML = window.Art.svg("glass:latte", "");

  /* ---------- Fasilitas ---------- */
  const JENIS = { pemilik: "Pemilik usaha", media: "Media", ulasan: "Ulasan pengunjung", agregator: "Agregator" };
  const fas = $("[data-fasilitas]");
  if (fas) {
    fas.innerHTML = D.fasilitas.map((f) => `
      <li><span class="fasilitas__jenis">${esc(JENIS[f.jenis] || "")}</span>${esc(f.teks)}<span class="fasilitas__sumber">Sumber: ${esc(f.sumber)}</span></li>`).join("");
  }

  /* ---------- FAQ ---------- */
  const faq = $("[data-faq]");
  if (faq) {
    faq.innerHTML = D.faq.map((f) => `
      <details><summary>${esc(f.tanya)}</summary><p class="faq__jawab">${esc(typeof f.jawab === "function" ? f.jawab(D) : f.jawab)}</p></details>`).join("");
  }

  /* ---------- Dialog sumber & catatan ---------- */
  const sumber = $("[data-sumber]");
  const bukaSumber = $("[data-open-sumber]");
  if (sumber && bukaSumber) {
    $("[data-sumber-list]", sumber).innerHTML = D.sumber.map((s) => `
      <li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.judul)}</a>
        <small>Dipakai untuk: ${esc(s.dipakai)}</small><small>Diperiksa: ${esc(s.diperiksa)}</small></li>`).join("");
    bukaSumber.addEventListener("click", () => {
      if (!openDialog(sumber, bukaSumber, "[data-sumber-close]")) window.location.href = "SOURCES.md";
    });
    $("[data-sumber-close]", sumber).addEventListener("click", () => sumber.close());
  }

  /* ---------- Kembali ke atas ---------- */
  const totop = $("[data-totop]");
  if (totop) {
    const cek = () => { totop.hidden = window.scrollY < 900; };
    window.addEventListener("scroll", cek, { passive: true });
    cek();
    totop.addEventListener("click", () => window.scrollTo({ top: 0 }));
  }
})();
