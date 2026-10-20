/*
  Kustomisasi pesanan di panel detail menu (ala aplikasi kopi): suhu, level es, tambahan (extra shot, oat milk),
  gelas SVG yang berubah sesuai pilihan, dan tombol bawah yang harganya bergulir saat pilihan diganti.
  Harga tambahan ada di CALIBRE.opsi (contoh; ganti dengan harga kedai). Opsi dikirim ke keranjang sebagai teks varian
  ("Es · Less ice · +Extra shot") dan harga tambahan per gelas (extra).
*/
(function () {
  "use strict";
  const { $, esc } = window.UI;
  const D = window.CALIBRE, O = window.Order;
  const dlg = $("[data-detail]");
  const host = $("[data-custom]");
  const addBtn = $("[data-detail-add]");
  if (!dlg || !host || !O) return;
  const cfg = D.opsi || { ekstra: [], es: ["Less ice", "Normal ice"] };
  const idr = O.idr;
  let cur = null; // { it, suhu[], pilih:{suhu, es, ekstra:Set} }

  function suhuPilihan(it) {
    if (it.varian && it.varian.length) return null;           // item bervarian (mis. teh) memakai varian bawaan
    if (it.kategori === "frappe" || it.id === "iced-latte") return ["Es"];
    if (it.kategori === "espresso" || it.kategori === "noncoffee") return ["Panas", "Es"];
    return ["Panas"];
  }
  const ekstraUntuk = (it) => (cfg.ekstra || []).filter((e) => e.untuk.indexOf(it.kategori) >= 0 && !(it.varian && it.varian.length));

  const price = () => cur.it.rp + Array.from(cur.pilih.ekstra).reduce((t, id) => t + (cfg.ekstra.find((e) => e.id === id) || { rp: 0 }).rp, 0);
  function varianText() {
    const p = cur.pilih, parts = [];
    if (cur.suhu.length > 1 || cur.suhu[0] === "Es") parts.push(p.suhu);
    if (p.suhu === "Es") parts.push(p.es);
    cfg.ekstra.forEach((e) => { if (p.ekstra.has(e.id)) parts.push("+" + e.label); });
    return parts.join(" · ");
  }
  const extraRp = () => price() - cur.it.rp;

  /* ---------- Angka bergulir ---------- */
  function roll(el, text) {
    if (el.dataset.t === text) return;
    const same = el.dataset.n === String(text.length);
    if (!same) {
      el.dataset.n = String(text.length);
      el.innerHTML = text.split("").map((c) => /\d/.test(c)
        ? `<span class="roll__d"><span class="roll__col">${"0123456789".split("").map((n) => `<i>${n}</i>`).join("")}</span></span>`
        : `<span class="roll__s">${esc(c)}</span>`).join("");
    }
    const cols = el.querySelectorAll(".roll__col"), ch = text.split("").filter((c) => /\d/.test(c));
    cols.forEach((col, i) => { col.style.transform = `translateY(${-(Number(ch[i]) || 0) * 10}%)`; });
    el.dataset.t = text;
    el.setAttribute("aria-label", text);
  }

  /* ---------- Gelas ---------- */
  function cupSvg() {
    return `<svg class="cup" viewBox="0 0 100 120" aria-hidden="true" focusable="false">
      <g class="cup__steam"><path d="M38 24c-5-6 5-9 0-16M52 24c-5-6 5-9 0-16M66 24c-5-6 5-9 0-16"/></g>
      <clipPath id="cupclip"><path d="M20 34h60l-6 62a8 8 0 0 1-8 7H34a8 8 0 0 1-8-7z"/></clipPath>
      <path class="cup__glass" d="M20 34h60l-6 62a8 8 0 0 1-8 7H34a8 8 0 0 1-8-7z"/>
      <g clip-path="url(#cupclip)"><rect class="cup__liq" x="10" y="34" width="80" height="80"/>
        <g class="cup__ice"><rect x="30" y="50" width="16" height="16" rx="3"/><rect x="50" y="44" width="16" height="16" rx="3"/><rect x="42" y="68" width="16" height="16" rx="3"/><rect x="58" y="72" width="14" height="14" rx="3"/><rect x="28" y="76" width="13" height="13" rx="3"/></g></g>
      <path class="cup__rim" d="M16 34h68"/></svg>`;
  }
  function paintCup() {
    const c = host.querySelector(".cup"); if (!c) return;
    const p = cur.pilih;
    c.dataset.mode = p.suhu === "Panas" ? "panas" : p.es === "Less ice" ? "less" : "normal";
    c.dataset.extra = String(cur.pilih.ekstra.size);
  }

  function paint() {
    paintCup();
    const harga = idr(price());
    host.querySelectorAll("[data-c-suhu]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.cSuhu === cur.pilih.suhu)));
    host.querySelectorAll("[data-c-es]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.cEs === cur.pilih.es)));
    host.querySelectorAll("[data-c-ekstra]").forEach((b) => b.setAttribute("aria-pressed", String(cur.pilih.ekstra.has(b.dataset.cEkstra))));
    const es = host.querySelector("[data-c-eswrap]"); if (es) es.hidden = cur.pilih.suhu !== "Es";
    roll(addBtn.querySelector("[data-roll]"), harga);
  }

  function build(it) {
    const suhu = suhuPilihan(it), ek = ekstraUntuk(it);
    if (!suhu || (suhu.length === 1 && suhu[0] === "Panas" && !ek.length)) return false;
    cur = { it, suhu, pilih: { suhu: suhu[0], es: cfg.es[1] || "Normal ice", ekstra: new Set() } };
    host.hidden = false;
    host.innerHTML = `<h4 class="custom__h">Atur minuman</h4><div class="custom__isi">${cupSvg()}<div class="custom__opsi">
      ${suhu.length > 1 ? `<div class="custom__grup" role="radiogroup" aria-label="Suhu">${suhu.map((s) => `<button type="button" class="copt" role="radio" data-c-suhu="${s}">${s === "Es" ? "Es" : "Panas"}</button>`).join("")}</div>` : ""}
      <div class="custom__grup" role="radiogroup" aria-label="Level es" data-c-eswrap ${suhu.indexOf("Es") >= 0 ? "" : "hidden"}>${cfg.es.map((e) => `<button type="button" class="copt" role="radio" data-c-es="${esc(e)}">${esc(e)}</button>`).join("")}</div>
      ${ek.length ? `<div class="custom__grup" aria-label="Tambahan">${ek.map((e) => `<button type="button" class="copt" aria-pressed="false" data-c-ekstra="${e.id}">${esc(e.label)} <small>+${idr(e.rp).replace("Rp ", "")}</small></button>`).join("")}</div>` : ""}
    </div></div>`;
    addBtn.innerHTML = `<span>Tambah pesanan</span> <span class="roll" data-roll aria-live="polite"></span>`;
    addBtn.classList.add("btn--roll");
    delete addBtn.querySelector("[data-roll]").dataset.t;
    paint();
    return true;
  }

  window.addEventListener("calibre:detail", (e) => {
    const it = e.detail.item;
    cur = null; host.hidden = true; host.innerHTML = ""; addBtn.classList.remove("btn--roll");
    if (it.habis) return;
    if (!build(it)) { cur = null; }
  });

  host.addEventListener("click", (e) => {
    if (!cur) return;
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.cSuhu) cur.pilih.suhu = t.dataset.cSuhu;
    if (t.dataset.cEs) cur.pilih.es = t.dataset.cEs;
    if (t.dataset.cEkstra) { const s = cur.pilih.ekstra; s.has(t.dataset.cEkstra) ? s.delete(t.dataset.cEkstra) : s.add(t.dataset.cEkstra); }
    paint();
  });

  window.Custom = {
    active: () => !!cur,
    add: () => { O.add(cur.it.id, varianText(), extraRp()); }
  };
})();
