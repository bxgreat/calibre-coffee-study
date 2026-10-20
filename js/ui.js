/*
  Helper bersama: seleksi DOM, escape HTML, penyimpanan lokal yang aman, toast, dan perilaku dialog
  (kunci scroll, fokus kembali ke pemicu, klik latar untuk menutup).
*/
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  // Huruf kecil tanpa aksen, untuk pencarian
  const norm = (s) => String(s == null ? "" : s)
    .normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

  const store = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (_) { return fallback; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; }
    }
  };

  let toastTimer = null;
  function toast(msg) {
    const el = $("[data-toast]");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-show"), 2600);
  }

  const openCount = () => $$("dialog[open]").length;
  function syncScrollLock() {
    document.documentElement.classList.toggle("dlg-open", openCount() > 0);
  }

  // Daftarkan dialog: klik pada latar menutup, fokus kembali ke pemicu setelah ditutup.
  function setupDialog(dlg, { backdropClose = true } = {}) {
    if (!dlg || dlg._setup) return;
    dlg._setup = true;
    if (backdropClose) {
      dlg.addEventListener("mousedown", (e) => { dlg._downOnBackdrop = (e.target === dlg); });
      dlg.addEventListener("click", (e) => {
        if (e.target === dlg && dlg._downOnBackdrop) dlg.close();
      });
    }
    dlg.addEventListener("close", () => {
      syncScrollLock();
      const op = dlg._opener;
      dlg._opener = null;
      if (op && document.contains(op) && typeof op.focus === "function") op.focus({ preventScroll: true });
    });
  }

  function openDialog(dlg, opener, focusSel) {
    if (!dlg) return false;
    setupDialog(dlg);
    if (typeof dlg.showModal !== "function") return false;
    dlg._opener = opener || document.activeElement;
    if (!dlg.open) dlg.showModal();
    syncScrollLock();
    const target = focusSel ? $(focusSel, dlg) : null;
    if (target) target.focus({ preventScroll: true });
    return true;
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) { /* lanjut ke cadangan */ }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (_) { return false; }
  }

  window.UI = { $, $$, esc, norm, store, toast, setupDialog, openDialog, copyText };
})();
