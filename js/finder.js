/*
  "Tanya barista" (coffee finder): tiga pertanyaan sekali ketuk, hasilnya dua rekomendasi menu.
  Aturan murni di sisi browser, tanpa AI dan tanpa data yang dikirim ke mana pun. Skor memakai kategori dan nama
  menu dari katalog; menu yang ditandai habis tidak direkomendasikan.
*/
(function () {
  "use strict";
  const { $, esc, openDialog, setupDialog } = window.UI;
  const M = window.CALIBRE_MENU, O = window.Order;
  const slot = $("[data-finder-slot]");
  if (!slot || !M || !O) return;

  const Q = [
    { k: "mood", t: "Hari ini butuh apa?", o: [["fokus", "⚡ Fokus kerja"], ["santai", "🌿 Santai sore"], ["segar", "🍓 Manis dan segar"]] },
    { k: "jenis", t: "Suka kopi atau non-kopi?", o: [["pahit", "Kopi pahit"], ["susu", "Kopi susu creamy"], ["non", "Non-kopi"]] },
    { k: "suhu", t: "Dingin atau panas?", o: [["es", "🧊 Es"], ["panas", "☕ Panas"]] }
  ];
  const MOOD = { fokus: ["manual", "espresso"], santai: ["espresso", "noncoffee"], segar: ["frappe", "noncoffee"] };
  const PAHIT = ["manual-brew-single-origin", "black-coffee-pourover", "aeropress", "french-press", "kopi-tubruk", "caffe-misto"];
  const COLD = (it) => it.kategori === "frappe" || it.id === "iced-latte" || it.id === "teh-dingin";
  const HOT = (it) => it.kategori === "manual" || it.id === "teh-panas";

  function pick(a) {
    const drinks = M.items.filter((i) => ["espresso", "manual", "noncoffee", "frappe"].indexOf(i.kategori) >= 0 && !i.habis && !i.sembunyi);
    const scored = drinks.filter((i) => !(a.suhu === "es" && HOT(i)) && !(a.suhu === "panas" && COLD(i))).map((i) => {
      let s = 0;
      if (MOOD[a.mood].indexOf(i.kategori) >= 0) s += 2;
      const pahit = PAHIT.indexOf(i.id) >= 0, non = i.kategori === "noncoffee" || i.kategori === "frappe";
      if (a.jenis === "pahit" && pahit) s += 3;
      if (a.jenis === "susu" && !pahit && !non) s += 3;
      if (a.jenis === "non" && non) s += 3;
      if (i.label) s += 0.5;
      return { i, s };
    }).sort((x, y) => y.s - x.s);
    return scored.slice(0, 2).map((x) => x.i);
  }

  const dlg = document.createElement("dialog");
  dlg.className = "detail finder"; dlg.setAttribute("aria-labelledby", "finder-judul");
  document.body.appendChild(dlg);
  let jawab = {}, n = 0;

  function render() {
    const close = `<button class="dlg-close" type="button" data-fc aria-label="Tutup">×</button>`;
    if (n < Q.length) {
      const q = Q[n];
      dlg.innerHTML = `<div class="finder__in">${close}<p class="kicker">Pertanyaan ${n + 1} dari 3</p><h3 class="display display--md" id="finder-judul" tabindex="-1">${esc(q.t)}</h3>
        <div class="finder__opsi">${q.o.map((o) => `<button type="button" class="btn btn--ghost btn--lg" data-jawab="${o[0]}">${esc(o[1])}</button>`).join("")}</div>${n ? `<button type="button" class="link-btn" data-back>Kembali</button>` : ""}</div>`;
    } else {
      const hasil = pick(jawab);
      dlg.innerHTML = `<div class="finder__in">${close}<p class="kicker">Rekomendasi barista virtual</p><h3 class="display display--md" id="finder-judul" tabindex="-1">${hasil.length ? "Coba ini" : "Belum ada yang pas"}</h3>
        <ul class="finder__hasil">${hasil.map((it) => `<li><div><strong>${esc(it.nama)}</strong><small>${esc(O.fmtItem(it))}</small><span>${esc(it.deskripsi.slice(0, 110))}${it.deskripsi.length > 110 ? "…" : ""}</span></div>
          <div class="finder__aksi"><button type="button" class="btn btn--primary btn--sm" data-pesan="${esc(it.id)}">Pesan sekarang</button><button type="button" class="btn btn--ghost btn--sm" data-detail="${esc(it.id)}">Atur dulu</button></div></li>`).join("")}</ul>
        <p class="catatan">Rekomendasi dari aturan sederhana pada katalog ini, bukan penilaian rasa dari kedai.</p><button type="button" class="link-btn" data-ulang>Ulangi pertanyaan</button></div>`;
    }
    const h = $("#finder-judul", dlg); if (h) h.focus({ preventScroll: true });
  }

  dlg.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest("[data-fc]")) { dlg.close(); return; }
    const j = t.closest("[data-jawab]"); if (j) { jawab[Q[n].k] = j.dataset.jawab; n++; render(); return; }
    if (t.closest("[data-back]")) { n--; render(); return; }
    if (t.closest("[data-ulang]")) { jawab = {}; n = 0; render(); return; }
    const p = t.closest("[data-pesan]");
    if (p) {
      const it = O.byId[p.dataset.pesan];
      const dua = ["espresso", "noncoffee"].indexOf(it.kategori) >= 0 && it.id !== "iced-latte" && !(it.varian && it.varian.length);
      O.add(it.id, dua ? (jawab.suhu === "es" ? "Es · Normal ice" : "Panas") : jawab.suhu === "es" && COLD(it) && it.kategori !== "frappe" ? "" : "", 0);
      dlg.close(); location.hash = "#/pesan"; return;
    }
    const d = t.closest("[data-detail]");
    if (d) { dlg.close(); window.Menu.openDetail(d.dataset.detail, null); }
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  if (setupDialog) setupDialog(dlg);

  slot.innerHTML = `<button type="button" class="btn btn--ghost" data-finder-open aria-haspopup="dialog">Bingung pilih menu? Tanya barista</button>`;
  slot.addEventListener("click", (e) => {
    const b = e.target.closest("[data-finder-open]"); if (!b) return;
    jawab = {}; n = 0; render(); openDialog(dlg, b, "#finder-judul");
  });
})();
