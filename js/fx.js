/*
  Lapisan efek gerak. Atas permintaan pemilik proyek (dial MOTION 3, lihat SKILL.md):
  judul terbelah per kata, reveal bergaya 3D saat scroll, tilt 3D pada kartu dan foto, foto hero yang
  mengikuti pointer, parallax foto, tombol magnet, dan bilah progres scroll.

  Semua efek:
  - mati otomatis bila sistem meminta prefers-reduced-motion: reduce;
  - bisa dimatikan pengunjung lewat tombol "Efek gerak" di footer (disimpan di localStorage);
  - tidak menyembunyikan informasi: tanpa JavaScript, kelas "fx" tidak pernah dipasang dan semua konten terlihat.
*/
(function () {
  "use strict";
  const { $, $$, store } = window.UI;
  const root = document.documentElement;
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");

  let pref = store.get("calibre:fx", true) !== false;
  const subs = [];
  const enabled = () => pref && !mqReduce.matches;
  const FX = { enabled, onChange: (fn) => subs.push(fn), refresh: () => {}, pointer: { x: 0, y: 0 } };
  window.FX = FX;

  const btn = $("[data-fx-toggle]");
  function apply() {
    const on = enabled();
    root.classList.toggle("fx", on);
    if (btn) {
      btn.setAttribute("aria-pressed", String(on));
      btn.disabled = mqReduce.matches;
      btn.textContent = mqReduce.matches ? "Efek gerak: mati (pengaturan sistem)" : `Efek gerak: ${on ? "aktif" : "mati"}`;
    }
    if (!on) {
      $$("[data-parallax], [data-parallax-x], [data-magnet]").forEach((el) => { el.style.translate = ""; });
      $$("[data-tilt]").forEach(resetTilt);
    }
    subs.forEach((fn) => fn(on));
  }
  if (btn) btn.addEventListener("click", () => { pref = !pref; store.set("calibre:fx", pref); apply(); });
  mqReduce.addEventListener("change", apply);

  /* ---------- Judul terbelah per kata ---------- */
  function split(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = "1";
    let n = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((c) => {
        if (c.nodeType === 3) {
          const parts = c.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span");
            w.className = "w";
            const i = document.createElement("span");
            i.className = "w__i";
            i.style.setProperty("--i", n++);
            i.textContent = p;
            w.appendChild(i);
            frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== "BR") {
          walk(c);
        }
      });
    };
    walk(el);
  }
  $$("[data-split]").forEach(split);

  /* ---------- Reveal saat masuk layar ---------- */
  let io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        const box = en.target.closest("[data-catalog], [data-galeri]");
        if (box) box.dataset.seen = "1";
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  }

  FX.refresh = function (scope) {
    const els = $$("[data-reveal]:not(.is-in), [data-reveal-pop]:not(.is-in), [data-split]:not(.is-in)", scope || document);
    els.forEach((el) => {
      const box = el.closest("[data-catalog], [data-galeri]");
      if (!io || !enabled() || (box && box.dataset.seen === "1")) { el.classList.add("is-in"); return; }
      io.observe(el);
    });
  };

  /* ---------- Tilt 3D (kartu menu, foto galeri) ---------- */
  let tiltEl = null;
  function resetTilt(el) {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.classList.remove("is-tilting");
  }
  document.addEventListener("pointermove", (e) => {
    if (!enabled() || !mqFine.matches || e.pointerType !== "mouse") return;
    const t = e.target.closest ? e.target.closest("[data-tilt]") : null;
    if (tiltEl && tiltEl !== t) resetTilt(tiltEl);
    tiltEl = t;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const max = t.classList.contains("card") ? 5 : 6;
    t.style.setProperty("--ry", ((px - 0.5) * 2 * max).toFixed(2) + "deg");
    t.style.setProperty("--rx", ((0.5 - py) * 2 * max).toFixed(2) + "deg");
    t.style.setProperty("--gx", (px * 100).toFixed(0) + "%");
    t.style.setProperty("--gy", (py * 100).toFixed(0) + "%");
    t.classList.add("is-tilting");
  }, { passive: true });
  document.addEventListener("pointerout", (e) => {
    if (tiltEl && (!e.relatedTarget || !tiltEl.contains(e.relatedTarget))) { resetTilt(tiltEl); tiltEl = null; }
  });

  /* ---------- Hero: foto mengikuti pointer; nilai pointer juga dibaca adegan 3D ---------- */
  const hero = $("[data-hero]");
  const heroTilt = $("[data-tilt-hero]");
  if (hero) {
    hero.addEventListener("pointermove", (e) => {
      if (!mqFine.matches || e.pointerType !== "mouse") return;
      const r = hero.getBoundingClientRect();
      FX.pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      FX.pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (enabled() && heroTilt) {
        heroTilt.style.setProperty("--hy", (FX.pointer.x * 5).toFixed(2) + "deg");
        heroTilt.style.setProperty("--hx", (-FX.pointer.y * 4).toFixed(2) + "deg");
      }
    }, { passive: true });
    hero.addEventListener("pointerleave", () => {
      FX.pointer.x = 0; FX.pointer.y = 0;
      if (heroTilt) { heroTilt.style.setProperty("--hy", "0deg"); heroTilt.style.setProperty("--hx", "0deg"); }
    });
  }

  /* ---------- Spotlight mengikuti kursor di hero ---------- */
  if (hero) {
    hero.addEventListener("pointermove", (e) => {
      if (!enabled() || !mqFine.matches || e.pointerType !== "mouse") return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
      hero.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* ---------- Ledakan kecil (favorit, tambah pesanan, kirim WhatsApp) ---------- */
  function burst(x, y, kind) {
    if (!enabled()) return;
    const n = kind === "heart" ? 9 : 12;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.className = "burst burst--" + kind;
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.5;
      const d = 36 + Math.random() * 46;
      p.style.cssText = `left:${x}px;top:${y}px;--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d - 14).toFixed(0)}px;--r:${(Math.random() * 360).toFixed(0)}deg;--i:${i}`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }
  }
  FX.burst = burst;

  // Titik kecil terbang dari tombol "tambah" ke penghitung pesanan
  function fly(fromEl) {
    if (!enabled() || !fromEl || !fromEl.animate) return;
    const targets = $$("[data-order-count]").filter((t) => t.getBoundingClientRect().width > 0);
    const to = targets[0];
    if (!to) return;
    const a = fromEl.getBoundingClientRect(), b = to.getBoundingClientRect();
    const dot = document.createElement("i");
    dot.className = "fly";
    dot.style.left = (a.left + a.width / 2) + "px";
    dot.style.top = (a.top + a.height / 2) + "px";
    document.body.appendChild(dot);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const anim = dot.animate([
      { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
      { transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5 - 70}px)) scale(1.3)`, opacity: 1, offset: 0.5 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`, opacity: 0.9 }
    ], { duration: 650, easing: "cubic-bezier(.3,.7,.3,1)" });
    anim.onfinish = () => dot.remove();
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest ? e.target.closest("[data-act], [data-detail-add], [data-detail-fav], [data-order-wa]") : null;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const act = t.dataset ? t.dataset.act : "";
    if ((act === "fav" || t.hasAttribute("data-detail-fav")) && t.getAttribute("aria-pressed") === "true") burst(cx, cy, "heart");
    if ((act === "add" && t.textContent.indexOf("varian") < 0) || t.hasAttribute("data-detail-add")) { burst(cx, cy, "spark"); fly(t); }
    if (t.hasAttribute("data-order-wa") && t.getAttribute("aria-disabled") !== "true") burst(cx, cy, "spark");
  });

  // Penghitung pesanan "membal" saat bertambah
  let lastCount = window.Order ? window.Order.count() : 0;
  if (window.Order) window.Order.onChange(() => {
    const n = window.Order.count();
    if (n > lastCount) { const hd = $("[data-header]"); if (hd) hd.classList.remove("is-hidden"); }
    if (n > lastCount) $$("[data-order-count]").forEach((el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
    lastCount = n;
  });

  /* ---------- Tombol magnet ---------- */
  let magEl = null;
  document.addEventListener("pointermove", (e) => {
    if (!enabled() || !mqFine.matches || e.pointerType !== "mouse") return;
    const m = e.target.closest ? e.target.closest("[data-magnet]") : null;
    if (magEl && magEl !== m) magEl.style.translate = "";
    magEl = m;
    if (!m) return;
    const r = m.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    m.style.translate = `${(dx * 8).toFixed(1)}px ${(dy * 6).toFixed(1)}px`;
  }, { passive: true });
  document.addEventListener("pointerout", (e) => {
    if (magEl && (!e.relatedTarget || !magEl.contains(e.relatedTarget))) { magEl.style.translate = ""; magEl = null; }
  });

  /* ---------- Scroll: progres dan parallax ---------- */
  const bar = $("[data-progress]");
  const para = $$("[data-parallax]");
  const paraX = $$("[data-parallax-x]");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1).toFixed(4) : 0})`;
      if (!enabled()) return;
      const vh = window.innerHeight;
      paraX.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const f = parseFloat(el.dataset.parallaxX) || 0.1;
        el.style.translate = `${((r.top - vh / 2) * f * -3).toFixed(1)}px 0`;
      });
      para.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const f = parseFloat(el.dataset.parallax) || 0.05;
        el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * -f).toFixed(1)}px`;
      });
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  apply();
  FX.refresh(document);
  onScroll();
})();
