/*
  Navbar yang lebih hidup (desktop): ikon pada tiap menu, warna aksen berbeda per halaman (lewat :has di CSS), chip status
  buka/tutup yang selalu terbaca, bar kemajuan scroll, dan mode ringkas saat halaman digulir. Semua murni tampilan; tautan
  dan perilaku navigasi tetap dari main.js. Dimuat sebelum main.js supaya penanda indikator menghitung lebar yang sudah
  termasuk ikon.
*/
(function () {
  "use strict";
  const header = document.querySelector("[data-header]");
  if (!header) return;
  const D = window.CALIBRE;

  const P = {
    cerita: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z M8 8h7 M8 12h7",
    menu: "M5 9h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z M16 11h1.5a2 2 0 0 1 0 4H16 M8 4v2 M12 4v2",
    kunjungi: "M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.700-6 10-6 10z M12 8.500a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5z",
    pesan: "M6 8h12l-1 11H7z M9 8V7a3 3 0 0 1 6 0v1",
    info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 11v5 M12 7.500v.01"
  };
  header.querySelectorAll(".nav__link[data-spy]").forEach((a) => {
    if (a.querySelector(".nav__ico")) return;
    const d = P[a.dataset.spy]; if (!d) return;
    a.insertAdjacentHTML("afterbegin", `<svg class="nav__ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`);
  });

  /* ---------- Chip status buka/tutup (WIB) ---------- */
  const tools = header.querySelector(".site-header__tools");
  const chip = document.createElement("span");
  chip.className = "hdr-status"; chip.setAttribute("data-hdr-status", ""); chip.hidden = true;
  if (tools) tools.insertBefore(chip, tools.firstChild);
  const mm = (s) => { const p = s.split(":").map(Number); return p[0] * 60 + p[1]; };
  const jam = (s) => s.replace(":", ".");
  function status() {
    if (!D || !D.jadwal) return;
    let n;
    try {
      const f = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
      const p = Object.fromEntries(f.formatToParts(new Date()).map((x) => [x.type, x.value]));
      n = { hari: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), menit: (Number(p.hour) % 24) * 60 + Number(p.minute) };
    } catch (_) { return; }
    if (n.hari < 0) return;
    const h = D.jadwal[n.hari], buka = n.menit >= mm(h.buka) && n.menit < mm(h.tutup);
    chip.hidden = false;
    chip.classList.toggle("is-open", buka);
    if (buka) chip.innerHTML = `<i aria-hidden="true"></i>Buka · tutup ${jam(h.tutup)}`;
    else {
      const besok = n.menit >= mm(h.tutup), hh = D.jadwal[(n.hari + (besok ? 1 : 0)) % 7];
      chip.innerHTML = `<i aria-hidden="true"></i>Tutup · buka ${jam(hh.buka)}${besok ? " besok" : ""}`;
    }
  }
  status(); setInterval(status, 60000);


  /* ---------- Dropdown (desktop): Menu per kategori, Info per bagian. Pola disclosure: tautan induk tetap berfungsi, tombol panah membuka panel ---------- */
  const mq = window.matchMedia("(min-width: 900px)");
  const CHEV = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg>';
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const panels = [];

  function katMenu() {
    const M = window.CALIBRE_MENU;
    if (!M) return "";
    const n = (id) => M.items.filter((i) => i.kategori === id).length;
    return `<a class="dd__a dd__a--all" href="#/menu" data-kat="semua"><span>Semua menu</span><small>${M.items.length}</small></a>` +
      M.kategori.filter((k) => n(k.id)).map((k) => `<a class="dd__a" href="#/menu" data-kat="${esc(k.id)}"><i class="dd__dot dd__dot--${esc(k.id)}" aria-hidden="true"></i><span>${esc(k.label)}</span><small>${n(k.id)}</small></a>`).join("") +
      `<button type="button" class="dd__a dd__a--aksi" data-dd-finder><span>Bingung pilih? Tanya barista</span></button>`;
  }
  const INFO = '<a class="dd__a dd__a--rich" href="#fasilitas"><span class="dd__t"><b>Fasilitas</b><em>AC, Wi-Fi, parkir, dari sumber</em></span></a>' +
    '<a class="dd__a dd__a--rich" href="#faq"><span class="dd__t"><b>Pertanyaan umum</b><em>Jam buka, cara pesan, kontak</em></span></a>' +
    '<a class="dd__a dd__a--rich" href="#tentang"><span class="dd__t"><b>Transparansi</b><em>Sumber data dan privasi</em></span></a>';

  function pasang(spy, id, html) {
    const link = header.querySelector('.nav__link[data-spy="' + spy + '"]');
    if (!link || link.parentElement.querySelector(".nav__caret")) return;
    const li = link.parentElement;
    li.classList.add("has-dd");
    li.insertAdjacentHTML("beforeend", `<button type="button" class="nav__caret" aria-expanded="false" aria-controls="${id}" aria-label="Buka submenu">${CHEV}</button><div class="dd" id="${id}" hidden>${html}</div>`);
    const btn = li.querySelector(".nav__caret"), box = li.querySelector(".dd");
    let t = 0;
    const set = (on) => { clearTimeout(t); box.hidden = !on; btn.setAttribute("aria-expanded", String(on)); li.classList.toggle("is-dd-open", on); };
    const p = { li, btn, box, set };
    panels.push(p);
    btn.addEventListener("click", () => { const on = box.hidden; panels.forEach((x) => x.set(false)); set(on); });
    li.addEventListener("mouseenter", () => { if (mq.matches && window.matchMedia("(hover: hover)").matches) { clearTimeout(t); panels.forEach((x) => x !== p && x.set(false)); set(true); } });
    li.addEventListener("mouseleave", () => { t = setTimeout(() => set(false), 180); });
    li.addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) { e.stopPropagation(); set(false); btn.focus(); } });
    li.addEventListener("focusout", (e) => { if (!li.contains(e.relatedTarget)) set(false); });
    box.addEventListener("click", (e) => {
      const a = e.target.closest("a, button"); if (!a) return;
      set(false);
      const nv = document.querySelector(".nav.is-open"), tg = document.querySelector("[data-nav-toggle]");
      if (nv && tg) tg.click();
      if (a.matches("[data-dd-finder]")) { location.hash = "#/menu"; setTimeout(() => { const f = document.querySelector("[data-finder-open]"); if (f) f.click(); }, 900); return; }
      if (a.dataset.kat !== undefined && window.Menu && window.Menu.filter) window.Menu.filter(a.dataset.kat);
    });
  }
  pasang("menu", "dd-menu", katMenu());
  pasang("info", "dd-info", INFO);
  window.addEventListener("calibre:menu", () => { const b = document.querySelector("#dd-menu"); if (b) b.innerHTML = katMenu(); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".has-dd")) panels.forEach((x) => x.set(false)); });
  window.addEventListener("routechange", () => panels.forEach((x) => x.set(false)));

  /* ---------- Ringkas saat digulir + kemajuan scroll ---------- */
  let tk = 0;
  function upd() {
    tk = 0;
    const y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-scrolled", y > 12);
    header.style.setProperty("--sp", h > 0 ? Math.min(1, y / h).toFixed(3) : "0");
  }
  window.addEventListener("scroll", () => { if (!tk) tk = setTimeout(upd, 16); }, { passive: true });
  window.addEventListener("routechange", () => setTimeout(upd, 80));
  upd();
})();
