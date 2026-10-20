/*
  Audit tata letak ponsel (tempel di konsol browser pada lebar ponsel, atau jalankan lewat javascript_tool).
  Memeriksa tiap halaman: scroll horizontal, elemen melewati tepi kanan, target sentuh di bawah 40 px, dan teks di bawah 12 px.
  Mengembalikan ringkasan per halaman. Efek dimatikan supaya hasil tidak bergantung animasi.
*/
(async function () {
  const D = document.documentElement;
  D.classList.remove("fx");
  const st = document.createElement("style"); st.textContent = "*{transition:none!important;animation:none!important}"; document.head.appendChild(st);
  const vw = D.clientWidth, out = { vw };
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && !e.closest("[hidden],[inert]"); };
  const label = (e) => (e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : "") + (e.dataset && Object.keys(e.dataset)[0] ? "[data-" + Object.keys(e.dataset)[0] + "]" : "")).slice(0, 60);
  for (const h of ["#/", "#/cerita", "#/menu", "#/kunjungi", "#/info", "#/pesan"]) {
    location.hash = h; await new Promise((r) => setTimeout(r, 1400));
    window.scrollTo(0, 0);
    const page = document.querySelector("[data-page]:not([hidden])");
    const r = { overflowX: D.scrollWidth > vw, scrollW: D.scrollWidth, wide: [], small: [], tiny: [] };
    const root = page || document.body;
    root.querySelectorAll("*").forEach((e) => {
      if (!vis(e)) return;
      const b = e.getBoundingClientRect();
      if (b.right > vw + 2 && !e.closest(".expand, .hero__stage, [data-cup], .catalog__scroll, .tabs, [data-tabs], .ticker, .marquee")) r.wide.push(label(e) + " r=" + Math.round(b.right));
    });
    root.querySelectorAll("a[href],button,input:not([type=hidden]),select,textarea,summary").forEach((e) => {
      if (!vis(e) || e.closest(".sr-only") || e.classList.contains("sr-only")) return;
      const b = e.getBoundingClientRect();
      const inText = e.tagName === "A" && e.closest("p, li, dd, small, figcaption, .kredit, .catatan") && !e.classList.contains("btn");
      if ((b.height < 40 || b.width < 40) && !inText && b.height < 44) r.small.push(label(e) + " " + Math.round(b.width) + "x" + Math.round(b.height) + " '" + (e.innerText || e.getAttribute("aria-label") || "").trim().slice(0, 18) + "'");
    });
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; const seen = new Set();
    while ((n = w.nextNode())) {
      const t = n.nodeValue.trim(); if (t.length < 3) continue;
      const p = n.parentElement; if (!p || !vis(p) || /SCRIPT|STYLE/.test(p.tagName)) continue;
      const fs = parseFloat(getComputedStyle(p).fontSize);
      if (fs < 12 && !seen.has(label(p))) { seen.add(label(p)); r.tiny.push(label(p) + " " + fs + "px '" + t.slice(0, 20) + "'"); }
    }
    r.wide = [...new Set(r.wide)].slice(0, 8); r.small = [...new Set(r.small)].slice(0, 14); r.tiny = r.tiny.slice(0, 8);
    out[h] = r;
  }
  return out;
})();
