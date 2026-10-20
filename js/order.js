/*
  Inti pesanan (keranjang): daftar item, jumlah, varian, dan total. Disimpan di localStorage.
  Tampilan checkout ada di js/checkout.js. Tidak ada pembayaran yang diproses di situs ini.
*/
(function () {
  "use strict";
  const { $$, store, toast } = window.UI;
  const M = window.CALIBRE_MENU;
  const KEY = "calibre:order:v1";
  const byId = Object.fromEntries(M.items.map((i) => [i.id, i]));
  window.addEventListener("calibre:menu", () => M.items.forEach((i) => { byId[i.id] = i; })); // menu baru dari Google Sheets
  const keyOf = (id, varian) => id + "|" + (varian || "");
  let lines = (store.get(KEY, []) || []).filter((l) => l && byId[l.id] && l.qty > 0);
  const listeners = [];

  const count = () => lines.reduce((n, l) => n + l.qty, 0);
  // Perkiraan total (ribu rupiah) = jumlah rentang harga perkiraan x jumlah. BUKAN harga resmi.
  const estimate = (ls) => (ls || lines).reduce((t, l) => { const h = byId[l.id].harga || [0, 0], x = (l.extra || 0) / 1000; t[0] += (h[0] + x) * l.qty; t[1] += (h[1] + x) * l.qty; return t; }, [0, 0]);
  const rb = (e) => `Rp ${e[0]}–${e[1]} rb`;

  // Harga asli (it.resmi, dari papan menu atau Google Sheets kedai) disimpan sebagai rupiah penuh di it.rp.
  const idr = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");
  const fmtItem = (it, qty) => { const q = qty || 1; return it.resmi ? idr(it.rp * q) : `≈ Rp ${it.harga[0] * q}–${it.harga[1] * q} rb`; };
  const linePrice = (l) => byId[l.id].rp + (l.extra || 0);
  const fmtLine = (l) => (byId[l.id].resmi ? idr(linePrice(l) * l.qty) : fmtItem(byId[l.id], l.qty));
  const exact = (ls) => { const a = ls || lines; return a.length && a.every((l) => byId[l.id] && byId[l.id].resmi) ? a.reduce((t, l) => t + linePrice(l) * l.qty, 0) : null; };
  const totalText = (ls) => { const x = exact(ls); return x === null ? rb(estimate(ls)) : idr(x); };

  function commit() {
    store.set(KEY, lines);
    $$("[data-order-count]").forEach((el) => { el.textContent = String(count()); el.classList.toggle("is-zero", count() === 0); });
    listeners.forEach((fn) => fn(lines));
  }
  function add(id, varian, extra) {
    if (!byId[id]) return;
    const k = keyOf(id, varian);
    const f = lines.find((l) => keyOf(l.id, l.varian) === k);
    if (f) f.qty = Math.min(f.qty + 1, 20); else lines.push({ id, varian: varian || "", qty: 1, extra: extra || 0 });
    commit();
    toast(`Ditambahkan: ${byId[id].nama}${varian ? " (" + varian + ")" : ""}`);
  }
  function addMany(arr) {
    arr.forEach((l) => { if (!byId[l.id]) return; const k = keyOf(l.id, l.varian); const f = lines.find((x) => keyOf(x.id, x.varian) === k); if (f) f.qty = Math.min(f.qty + (l.qty || 1), 20); else lines.push({ id: l.id, varian: l.varian || "", qty: Math.min(l.qty || 1, 20), extra: l.extra || 0 }); });
    commit();
  }
  function setQty(k, qty) {
    const l = lines.find((x) => keyOf(x.id, x.varian) === k);
    if (!l) return;
    l.qty = Math.max(0, Math.min(qty, 20));
    if (!l.qty) lines = lines.filter((x) => x !== l);
    commit();
  }
  function setLines(arr) {
    lines = arr.filter((l) => byId[l.id] && l.qty > 0).map((l) => ({ id: l.id, varian: l.varian || "", qty: Math.min(l.qty, 20), extra: l.extra || 0 }));
    commit();
  }
  const clear = () => { lines = []; commit(); };
  const open = () => { location.hash = "#/pesan"; };

  $$("[data-open-order]").forEach((b) => b.addEventListener("click", open));
  commit();
  window.Order = { addMany, fmtLine, linePrice, fmtItem, exact, totalText, idr, add, setQty, setLines, clear, count, estimate, rb, keyOf, byId, lines: () => lines, onChange: (fn) => listeners.push(fn), open };
})();
