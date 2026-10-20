/*
  "Pesan lagi favoritmu": tanpa login. Racikan yang paling sering dipesan di perangkat ini (dibaca dari riwayat pesanan
  di localStorage, calibre:orders:v1) tampil di atas katalog menu; satu ketukan memasukkannya ke keranjang.
  Data tidak pernah meninggalkan browser. Tombol "Hapus riwayat" di halaman Pesan juga menghapus racikan ini.
*/
(function () {
  "use strict";
  const { $, esc, store } = window.UI;
  const O = window.Order;
  const host = $("[data-racikan]");
  if (!host || !O) return;

  function top() {
    const hist = store.get("calibre:orders:v1", []) || [];
    const hit = new Map();
    hist.forEach((h) => (h.items || []).forEach((l) => {
      if (!O.byId[l.id]) return;
      const k = O.keyOf(l.id, l.varian || "");
      const e = hit.get(k) || { id: l.id, varian: l.varian || "", extra: l.extra || 0, n: 0 };
      e.n += l.qty || 1; hit.set(k, e);
    }));
    return Array.from(hit.values()).sort((a, b) => b.n - a.n).slice(0, 3);
  }

  function render() {
    const list = top().filter((r) => !O.byId[r.id].habis);
    if (!list.length) { host.hidden = true; host.innerHTML = ""; return; }
    host.hidden = false;
    host.innerHTML = `<h2 class="racikan__h">Pesan lagi favoritmu</h2><ul class="racikan__list">${list.map((r, i) => {
      const it = O.byId[r.id];
      return `<li><span><strong>${esc(it.nama)}</strong>${r.varian ? ` <small>${esc(r.varian)}</small>` : ""}<br><small>dipesan ${r.n}×</small></span>
        <button type="button" class="btn btn--primary btn--sm" data-racik="${i}">+ ${esc(O.idr(it.rp + r.extra))}</button></li>`;
    }).join("")}</ul>`;
    host._list = list;
  }

  host.addEventListener("click", (e) => {
    const b = e.target.closest("[data-racik]"); if (!b) return;
    const r = host._list[Number(b.dataset.racik)];
    O.add(r.id, r.varian, r.extra);
  });
  window.addEventListener("calibre:menu", render);
  window.addEventListener("hashchange", render);
  window.addEventListener("storage", render);
  render();
})();
