/*
  Aplikasi web (PWA): daftarkan service worker (sw.js) agar situs tetap terbuka saat sinyal buruk, dan tampilkan
  tombol "Pasang di layar HP" di footer ketika browser mengizinkan. Hanya aktif di https atau localhost.
*/
(function () {
  "use strict";
  const ok = "serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1");
  if (ok) window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
  const btn = document.querySelector("[data-pasang]");
  let ev = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); ev = e; if (btn) btn.hidden = false; });
  if (btn) btn.addEventListener("click", async () => { if (!ev) return; ev.prompt(); try { await ev.userChoice; } catch (_) {} ev = null; btn.hidden = true; });
  window.addEventListener("appinstalled", () => { if (btn) btn.hidden = true; });
})();
