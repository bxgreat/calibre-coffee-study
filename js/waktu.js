/*
  Tema waktu otomatis ("Glasshouse"): siang 06.00-17.30 memakai latar krem hangat, malam memakai espresso gelap dengan
  aksen amber. Waktu mengikuti jam perangkat pengunjung. Tombol di footer memilih Otomatis, Terang, atau Gelap
  (tersimpan di calibre:tema:v1). Atribut awal dipasang oleh skrip kecil di <head> agar tidak berkedip.
*/
(function () {
  "use strict";
  const KEY = "calibre:tema:v1";
  const root = document.documentElement;
  const btns = Array.from(document.querySelectorAll("[data-tema-toggle]"));
  const meta = document.querySelector('meta[name="theme-color"]');
  const ORDER = ["auto", "terang", "gelap"], LABEL = { auto: "otomatis", terang: "terang", gelap: "gelap" };
  const get = () => { try { return localStorage.getItem(KEY) || "auto"; } catch (_) { return "auto"; } };
  function waktu(mode) {
    if (mode === "terang") return "siang";
    if (mode === "gelap") return "malam";
    const d = new Date(), m = d.getHours() * 60 + d.getMinutes();
    return m >= 360 && m < 1050 ? "siang" : "malam";
  }
  function apply() {
    const mode = get();
    root.dataset.waktu = waktu(mode);
    if (meta) meta.content = root.dataset.waktu === "malam" ? "#1D1914" : "#FAF7F2";
    btns.forEach((b) => { b.textContent = "Tema: " + LABEL[mode] + (mode === "auto" ? " (" + (root.dataset.waktu === "malam" ? "malam" : "siang") + ")" : ""); });
  }
  btns.forEach((b) => b.addEventListener("click", () => {
    const next = ORDER[(ORDER.indexOf(get()) + 1) % ORDER.length];
    try { localStorage.setItem(KEY, next); } catch (_) {}
    apply();
  }));
  setInterval(() => { if (get() === "auto") apply(); }, 60000);
  apply();
})();
