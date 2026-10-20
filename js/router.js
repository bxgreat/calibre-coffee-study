/*
  Router halaman (hash) dengan animasi tirai saat pindah halaman.
  Rute: #/ (beranda), #/cerita, #/menu, #/kunjungi, #/info, #/pesan.
  Tautan lama (#menu, #faq, ...) dan tautan menu langsung (#m/<id>) dipetakan ke halaman yang sesuai.
  Dengan prefers-reduced-motion atau efek dimatikan, halaman berganti seketika tanpa tirai.
*/
(function () {
  "use strict";
  const { $, $$ } = window.UI;
  const pages = $$("[data-page]");
  if (!pages.length) return;

  const LABEL = { beranda: "Beranda", cerita: "Cerita", menu: "Menu", kunjungi: "Kunjungi", info: "Info", pesan: "Pesan" };
  const LEGACY = { "#atas": "beranda", "#cerita": "cerita", "#menu": "menu", "#kunjungi": "kunjungi", "#fasilitas": "info", "#faq": "info", "#tentang": "info" };
  const curtain = $("[data-curtain]");
  const curtainLabel = $("[data-curtain-label]");
  const live = $("[data-route-live]");
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  let current = null;
  let busy = false;
  let queued = null;

  function fromHash() {
    const h = location.hash || "";
    if (/^#m\//.test(h)) return "menu";
    if (LEGACY[h]) return LEGACY[h];
    const m = h.match(/^#\/([a-z]*)/);
    const r = m ? (m[1] || "beranda") : "beranda";
    return LABEL[r] ? r : "beranda";
  }

  const animate = () => !mqReduce.matches && !(window.FX && !window.FX.enabled()) && curtain;

  function swap(route) {
    pages.forEach((p) => { p.hidden = p.dataset.page !== route; });
    current = route;
    document.title = (route === "beranda" ? "" : LABEL[route] + " | ") + "Calibre Coffee Roasters, Surabaya (Studi Desain)";
    $$("[data-spy]").forEach((a) => { if (a.dataset.spy === route) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    document.documentElement.dataset.route = route;
    window.scrollTo(0, 0);
    const page = pages.find((p) => p.dataset.page === route);
    page.classList.remove("is-entering");
    void page.offsetWidth;
    page.classList.add("is-entering");
    if (window.FX && window.FX.refresh) window.FX.refresh(page);
    if (window.Expand) window.Expand.update();
    window.dispatchEvent(new CustomEvent("routechange", { detail: { route } }));
    if (live) live.textContent = `Halaman ${LABEL[route]}`;
    const hd = page.querySelector("h1, h2");
    if (hd) { hd.setAttribute("tabindex", "-1"); hd.focus({ preventScroll: true }); }
  }

  function go(route, instant) {
    if (route === current) return;
    if (instant || !animate() || current === null) { swap(route); return; }
    if (busy) { queued = route; return; }
    busy = true;
    curtainLabel.textContent = LABEL[route];
    curtain.classList.remove("is-out");
    curtain.classList.add("is-on");
    setTimeout(() => {
      swap(route);
      curtain.classList.add("is-out");
      setTimeout(() => {
        curtain.classList.remove("is-on", "is-out");
        busy = false;
        if (queued && queued !== current) { const q = queued; queued = null; go(q); } else queued = null;
      }, 820);
    }, 850);
  }

  window.addEventListener("hashchange", () => go(fromHash()));
  swap(fromHash());                       // muat awal: tanpa tirai
  if (!location.hash) history.replaceState(null, "", "#/");
  window.Router = { go: (r) => { location.hash = r === "beranda" ? "#/" : "#/" + r; }, current: () => current };
})();
