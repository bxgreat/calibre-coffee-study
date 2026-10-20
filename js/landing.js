/*
  Intro saat memasuki situs (menggantikan halaman landing). Urutan sekitar 3,6 detik: gelas digambar, kopi dituang, huruf
  CALIBRE muncul, penghitung 0 sampai 100 persen, lalu layar menutup seperti iris dan situs terbuka. Bisa dilewati kapan
  saja (tombol Lewati intro, Escape, atau Enter).
  Tampil sekali per sesi browser, hanya di alamat dasar. Tidak tampil untuk tautan langsung (#/menu, #m/<id>), ?langsung,
  ?table atau ?kode, pengguna yang meminta gerak dikurangi, atau saat Efek gerak dimatikan. Kelas html.landing-on dipasang
  dari skrip kecil di <head> supaya situs tidak sempat berkedip sebelum intro tampil.
*/
(function () {
  "use strict";
  const el = document.querySelector("[data-landing]");
  const root = document.documentElement;
  if (!el) return;
  const KEY = "calibre:masuk";
  const rest = Array.from(document.body.children).filter((n) => n !== el && n.tagName !== "SCRIPT");
  const TOTAL = 3300; // ms sampai penghitung mencapai 100

  function selesai() {
    root.classList.remove("landing-on");
    rest.forEach((n) => n.removeAttribute("inert"));
    el.hidden = true;
  }
  if (!root.classList.contains("landing-on")) { selesai(); return; }

  rest.forEach((n) => n.setAttribute("inert", ""));
  const skip = el.querySelector("[data-landing-first]");
  if (skip) skip.focus({ preventScroll: true });
  const num = el.querySelector("[data-intro-n]"), bar = el.querySelector("[data-intro-bar]");
  let done = false, tick = 0, t0 = 0, timers = [];

  function masuk(hash) {
    if (done) return;
    done = true;
    clearInterval(tick); timers.forEach(clearTimeout);
    try { sessionStorage.setItem(KEY, "1"); } catch (_) {}
    if (hash && hash !== "#/" && location.hash !== hash) location.hash = hash;
    rest.forEach((n) => n.removeAttribute("inert"));
    root.classList.remove("landing-on");
    el.classList.add("is-out");
    timers.push(setTimeout(() => { el.hidden = true; }, 1200));
    const h = document.querySelector("[data-page]:not([hidden]) h1");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }

  // penghitung 0 -> 100 dengan percepatan lembut; berbasis waktu nyata, jadi tetap benar saat tab di latar
  const ease = (p) => 1 - Math.pow(1 - p, 2.2);
  function frame() {
    const p = Math.min(1, (Date.now() - t0) / TOTAL), v = Math.round(ease(p) * 100);
    if (num) num.textContent = String(v);
    if (bar) bar.style.transform = "scaleX(" + ease(p).toFixed(3) + ")";
    if (p >= 1) { clearInterval(tick); timers.push(setTimeout(() => masuk("#/"), 350)); }
  }
  function mulai() { t0 = Date.now(); el.classList.add("is-play"); tick = setInterval(frame, 40); frame(); }
  mulai();

  el.addEventListener("click", (e) => { const b = e.target.closest("[data-landing-go]"); if (b) masuk(b.dataset.landingGo); });
  el.addEventListener("keydown", (e) => { if (e.key === "Escape" || e.key === "Enter") { if (!e.target.closest("[data-lang]")) masuk("#/"); } });
})();
