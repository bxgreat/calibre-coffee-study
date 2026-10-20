/*
  Katalog menu: pencarian langsung, filter kategori dan status, pengurutan abjad, favorit (localStorage),
  panel detail dengan tautan langsung (#m/<id>), bagikan, dan versi cetak.
*/
(function () {
  "use strict";
  const { $, $$, esc, norm, store, toast, openDialog, copyText } = window.UI;
  const M = window.CALIBRE_MENU;
  const catalog = $("[data-catalog]");
  if (!M || !catalog) return;

  const FAV_KEY = "calibre:fav:v1";
  const katLabel = Object.fromEntries(M.kategori.map((k) => [k.id, k.label]));
  let items = [], byId = {};
  function build() {
    items = M.items.map((i) => ({
      ...i,
      sumber: i.sumber || [],
      katLabel: katLabel[i.kategori] || i.kategori,
      hay: norm([i.nama, katLabel[i.kategori], i.deskripsi, (i.varian || []).join(" "), i.label || ""].join(" "))
    }));
    byId = Object.fromEntries(items.map((i) => [i.id, i]));
  }
  build();

  let favs = new Set((store.get(FAV_KEY, []) || []).filter((id) => byId[id]));
  const state = { q: "", kat: "semua", sort: "asli", status: "semua", favOnly: false };

  const el = {
    tabs: $("[data-tabs]"),
    search: $("[data-search]"),
    clear: $("[data-search-clear]"),
    sort: $("[data-sort]"),
    status: $("[data-status-filter]"),
    favBtn: $("[data-fav-toggle]"),
    favCount: $("[data-fav-count]"),
    hasil: $("[data-hasil]"),
    kosong: $("[data-kosong]"),
    arsip: $("[data-arsip]"),
    detail: $("[data-detail]"),
    resetBtn: $("[data-reset-btn]")
  };

  $("[data-menu-total]").textContent = String(items.length);
  $("[data-menu-diperiksa]").textContent = M.diperiksa;

  /* ---------- Potongan HTML ---------- */
  const monogram = (nama) => nama.replace(/[^A-Za-zÀ-ž ]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  function statusTag(st) {
    const s = M.status[st];
    return `<span class="tag tag--${st}"><span class="stat stat--${s.bentuk}" aria-hidden="true"></span>${esc(s.singkat)}</span>`;
  }

  const rupiah = (it) => window.Order.fmtItem(it);
  const hargaNote = (it) => (it.contoh ? "Harga contoh pada rancangan studi desain." : "Harga dari kedai.");

  // Kartu selalu memakai ilustrasi; foto asli (bila ada) tampil di panel detail.
  function mediaHtml(it) {
    if (it.foto) {
      return `<img src="${esc(it.foto.src)}" width="${it.foto.w}" height="${it.foto.h}" alt="${esc(it.foto.alt)}">`;
    }
    return `<div class="detail__art tone-${esc(it.kategori)}">${window.Art.svg(it.art, "Ilustrasi " + it.nama)}</div>`;
  }

  const heart = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path class="heart__p" d="M12 20.5s-7.5-4.6-9.2-9.2C1.6 8 3.4 4.8 6.7 4.8c2 0 3.5 1.1 5.3 3.1 1.8-2 3.3-3.1 5.3-3.1 3.3 0 5.1 3.2 3.9 6.5-1.7 4.6-9.2 9.2-9.2 9.2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;

  const src400 = (src) => src.replace("-800.webp", "-400.webp");

  function backHtml(it) {
    const st = M.status[it.status];
    const srcs = it.sumber.map((k) => { const r = M.src[k]; return `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.label)}</a> <small>(${esc(r.tanggal)})</small></li>`; }).join("");
    const foto = it.foto
      ? `<p class="card__back-foto">${it.foto.referensi ? "<strong>Foto referensi, bukan menu Calibre.</strong> " : ""}${esc(it.foto.kredit)}${it.foto.url ? ` <a href="${esc(it.foto.url)}" target="_blank" rel="noopener">Sumber foto</a>` : ""}</p>`
      : "";
    return `<h3 class="card__back-h">${esc(it.nama)}</h3>
      <p class="card__back-st"><span class="stat stat--${st.bentuk}" aria-hidden="true"></span> ${esc(st.label)}</p>
      <p class="card__back-t">Sumber nama menu:</p><ul class="card__back-l">${srcs}</ul>${foto}
      <p class="card__back-t">Harga ${esc(rupiah(it))}. ${esc(hargaNote(it))}</p>
      <button type="button" class="btn btn--sm card__back-btn" data-act="flip">Kembali ke kartu</button>`;
  }

  function cardHtml(it, i) {
    const fav = favs.has(it.id);
    const s = M.status[it.status];
    const photo = it.foto
      ? `<img class="card__photo" src="${esc(it.foto.src)}" srcset="${esc(src400(it.foto.src))} 400w, ${esc(it.foto.src)} 800w" sizes="(min-width: 1000px) 30vw, (min-width: 600px) 45vw, 92vw" width="${it.foto.w}" height="${it.foto.h}" alt="${esc(it.foto.alt)}" loading="lazy" decoding="async">`
      : `<div class="card__art">${window.Art.svg(it.art, "")}</div>`;
    return `<li class="catalog__item" data-reveal style="--d:${Math.min(i % 6, 5) * 60}ms">
      <article class="card" data-id="${esc(it.id)}" data-tilt>
        <div class="card__flip">
          <div class="card__face card__face--front" data-face="front">
            <div class="card__media tone-${esc(it.kategori)}" data-act="detail">
              ${photo}
              <span class="price${it.resmi ? " price--resmi" : ""}" title="${esc(hargaNote(it))}">${rupiah(it)}</span>
              ${it.habis ? `<span class="card__badge card__badge--habis">Habis</span>` : it.label ? `<span class="card__badge">${esc(it.label)}</span>` : ""}
              ${it.foto ? `<span class="card__fototag">${it.foto.referensi ? "Foto referensi" : "Foto Calibre 2019"}</span>` : ""}
              <span class="card__glare" aria-hidden="true"></span>
            </div>
            <div class="card__body">
              <p class="card__meta"><span class="card__kat">${esc(it.katLabel)}</span>
                <button type="button" class="tag tag--${it.status} tag--btn" data-act="flip" aria-label="Lihat sumber dan status ${esc(it.nama)}"><span class="stat stat--${s.bentuk}" aria-hidden="true"></span>${esc(s.singkat)}</button></p>
              <h2 class="card__nama" data-act="detail">${esc(it.nama)}</h2>
              <p class="card__desk">${esc(it.deskripsi)}</p>
              ${it.tag && it.tag.length ? `<p class="card__tags">${it.tag.map((x) => `<span>${esc(x)}</span>`).join("")}</p>` : ""}
              <div class="card__aksi">
                <button type="button" class="btn btn--ghost btn--sm" data-act="detail" aria-haspopup="dialog">Detail<span class="sr-only"> ${esc(it.nama)}</span></button>
                <button type="button" class="icon-btn heart ${fav ? "is-on" : ""}" data-act="fav" aria-pressed="${fav}" aria-label="Simpan ${esc(it.nama)} ke favorit">${heart}</button>
                <button type="button" class="btn btn--primary btn--sm" data-act="add"${it.habis ? " disabled" : ""}>${it.habis ? "Habis" : it.varian && it.varian.length ? "Pilih varian" : "Tambah ke pesanan"}<span class="sr-only"> ${esc(it.nama)}</span></button>
              </div>
            </div>
          </div>
          <div class="card__face card__face--back" data-face="back" inert aria-hidden="true">${backHtml(it)}</div>
        </div>
      </article>
    </li>`;
  }

  function setFlip(card, on) {
    card.classList.toggle("is-flip", on);
    const f = card.querySelector('[data-face="front"]'), bk = card.querySelector('[data-face="back"]');
    f.toggleAttribute("inert", on); f.setAttribute("aria-hidden", String(on));
    bk.toggleAttribute("inert", !on); bk.setAttribute("aria-hidden", String(!on));
    const target = card.querySelector(on ? ".card__back-btn" : ".tag--btn");
    if (target) setTimeout(() => target.focus({ preventScroll: true }), 120);
  }

  /* ---------- Penyaringan dan render ---------- */
  function visible() {
    const q = norm(state.q);
    const words = q ? q.split(/\s+/) : [];
    let list = items.filter((it) => {
      if (state.kat !== "semua" && it.kategori !== state.kat) return false;
      if (state.status !== "semua" && it.status !== state.status) return false;
      if (state.favOnly && !favs.has(it.id)) return false;
      return words.every((w) => it.hay.includes(w));
    });
    if (state.sort === "az") list = list.slice().sort((a, b) => a.nama.localeCompare(b.nama, "id"));
    if (state.sort === "za") list = list.slice().sort((a, b) => b.nama.localeCompare(a.nama, "id"));
    if (state.sort === "murah") list = list.slice().sort((a, b) => (a.harga[0] + a.harga[1]) - (b.harga[0] + b.harga[1]) || a.nama.localeCompare(b.nama, "id"));
    if (state.sort === "mahal") list = list.slice().sort((a, b) => (b.harga[0] + b.harga[1]) - (a.harga[0] + a.harga[1]) || a.nama.localeCompare(b.nama, "id"));
    return list;
  }

  function renderTabs() {
    const all = [{ id: "semua", label: "Semua" }].concat(M.kategori);
    el.tabs.innerHTML = all.map((k) => {
      const n = k.id === "semua" ? items.length : items.filter((i) => i.kategori === k.id).length;
      if (n === 0) return "";
      return `<button type="button" class="tab" data-kat="${k.id}" aria-pressed="${state.kat === k.id}">${esc(k.label)} <span class="tab__n">${n}</span></button>`;
    }).join("");
  }

  function render() {
    const list = visible();
    const group = state.sort === "asli" && state.kat === "semua";
    let html = "";
    let n = 0;
    if (group) {
      M.kategori.forEach((k) => {
        const part = list.filter((i) => i.kategori === k.id);
        if (!part.length) return;
        html += `<li class="catalog__group"><h2 class="catalog__gh"><span>${esc(k.label)}</span><span class="catalog__gn">${part.length}</span></h2></li>`;
        part.forEach((it) => { html += cardHtml(it, n++); });
      });
    } else {
      list.forEach((it) => { html += cardHtml(it, n++); });
    }
    catalog.innerHTML = html;
    $$(".card__photo", catalog).forEach((img) => {
      if (img.complete && img.naturalWidth) img.classList.add("is-loaded");
      else { img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true }); img.addEventListener("error", () => img.classList.add("is-loaded"), { once: true }); }
    });
    catalog.hidden = list.length === 0;

    // Pesan hasil dan keadaan kosong
    const bagian = [];
    if (state.q) bagian.push(`pencarian "${state.q.trim()}"`);
    if (state.kat !== "semua") bagian.push(`kategori ${katLabel[state.kat]}`);
    if (state.status !== "semua") bagian.push(`status ${M.status[state.status].singkat}`);
    if (state.favOnly) bagian.push("favorit saya");
    el.hasil.textContent = `Menampilkan ${list.length} dari ${items.length} menu${bagian.length ? " (" + bagian.join(", ") + ")" : ""}.`;

    if (list.length === 0) {
      el.kosong.hidden = false;
      if (state.favOnly && favs.size === 0 && !state.q) {
        el.kosong.innerHTML = `<p class="kosong__judul">Belum ada favorit.</p><p>Tekan ikon hati pada kartu menu untuk menyimpannya. Favorit tersimpan di browser ini saja.</p><button type="button" class="btn btn--ghost btn--sm" data-act="reset">Lihat semua menu</button>`;
      } else {
        el.kosong.innerHTML = `<p class="kosong__judul">Tidak ada menu yang cocok.</p><p>Coba kata kunci lain, atau hapus filter yang aktif.</p><button type="button" class="btn btn--ghost btn--sm" data-act="reset">Reset pencarian dan filter</button>`;
      }
    } else {
      el.kosong.hidden = true;
      el.kosong.innerHTML = "";
    }
    el.clear.hidden = !state.q;
    if (el.resetBtn) el.resetBtn.hidden = !(state.q || state.kat !== "semua" || state.status !== "semua" || state.favOnly || state.sort !== "asli");
    el.favBtn.setAttribute("aria-pressed", String(state.favOnly));
    el.favCount.textContent = String(favs.size);
    $$("[data-kat]", el.tabs).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.kat === state.kat)));
    if (window.FX && window.FX.refresh) window.FX.refresh(catalog);
  }

  function resetAll() {
    state.q = ""; state.kat = "semua"; state.status = "semua"; state.favOnly = false; state.sort = "asli";
    el.search.value = ""; el.sort.value = "asli"; el.status.value = "semua";
    render();
  }

  /* ---------- Favorit ---------- */
  function toggleFav(id) {
    if (favs.has(id)) favs.delete(id); else favs.add(id);
    store.set(FAV_KEY, Array.from(favs));
    const on = favs.has(id);
    toast(on ? `${byId[id].nama} disimpan ke favorit.` : `${byId[id].nama} dihapus dari favorit.`);
    if (state.favOnly) { render(); } else {
      const b = $(`.card[data-id="${id}"] [data-act="fav"]`, catalog);
      if (b) { b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on)); }
      el.favCount.textContent = String(favs.size);
    }
    if (el.detail.open && el.detail.dataset.id === id) syncDetailFav();
  }

  /* ---------- Detail ---------- */
  function syncDetailFav() {
    const id = el.detail.dataset.id;
    const on = favs.has(id);
    const b = $("[data-detail-fav]", el.detail);
    b.setAttribute("aria-pressed", String(on));
    b.textContent = on ? "Hapus dari favorit" : "Simpan ke favorit";
  }

  function menuUrl(id) {
    return new URL("#m/" + id, window.location.href).href;
  }

  function openDetail(id, opener, fromHash) {
    const it = byId[id];
    if (!it) return;
    const d = el.detail;
    d.dataset.id = id;
    $("[data-detail-media]", d).innerHTML = mediaHtml(it) + (it.foto
      ? (it.foto.referensi
          ? `<p class="kredit"><strong>Foto referensi, bukan foto menu Calibre.</strong> ${esc(it.foto.kredit)}. <a href="${esc(it.foto.url)}" target="_blank" rel="noopener">Halaman sumber dan lisensi</a>.</p>`
          : `<p class="kredit">${esc(it.foto.kredit)}. ${esc(it.foto.catatan || "")}</p>`)
      : `<p class="kredit">Ilustrasi generik, bukan foto menu Calibre.</p>`);
    $("[data-detail-harga]", d).textContent = `${rupiah(it)} (${it.contoh ? "harga contoh pada rancangan studi desain" : "harga dari kedai; dapat berubah"}; konfirmasi saat memesan).`;
    const ab = $("[data-detail-add]", d); if (ab) { ab.disabled = !!it.habis; ab.textContent = it.habis ? "Habis" : "Tambah ke pesanan"; }
    $("[data-detail-kategori]", d).textContent = it.katLabel;
    $("[data-detail-status]", d).outerHTML = `<span class="tag tag--${it.status}" data-detail-status><span class="stat stat--${M.status[it.status].bentuk}" aria-hidden="true"></span>${esc(M.status[it.status].label)}</span>`;
    $("[data-detail-judul]", d).textContent = it.nama;
    $("[data-detail-deskripsi]", d).textContent = it.deskripsi;
    $("[data-detail-tags]", d).innerHTML = (it.tag && it.tag.length ? it.tag.map((x) => `<span class="note">${esc(x)}</span>`).join("") + "<br>" : "") + "<small>Alergi atau pantangan makanan? Tanyakan ke kedai sebelum memesan.</small>";
    const cat = $("[data-detail-catatan]", d);
    cat.hidden = !it.catatan;
    cat.textContent = it.catatan || "";
    const fs = $("[data-detail-varian]", d);
    const list = $("[data-detail-varian-list]", d);
    if (it.varian && it.varian.length) {
      fs.hidden = false;
      list.innerHTML = it.varian.map((v, k) => `<label class="radio"><input type="radio" name="varian" value="${esc(v)}" ${k === 0 ? "checked" : ""}> <span>${esc(v)}</span></label>`).join("");
    } else {
      fs.hidden = true;
      list.innerHTML = "";
    }
    $("[data-detail-sumber]", d).innerHTML = it.sumber.map((s) => {
      const r = M.src[s];
      return `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.label)}</a> <small>(${esc(r.tanggal)})</small>`;
    }).join("<br>");
    $("[data-detail-diperiksa]", d).textContent = M.diperiksa;
    syncDetailFav();
    window.dispatchEvent(new CustomEvent("calibre:detail", { detail: { id, item: it } }));
    openDialog(d, opener, "[data-detail-close]");
    d.querySelector(".detail__scroll").scrollTop = 0;
    if (!fromHash) history.replaceState(null, "", "#m/" + id);
  }

  /* ---------- Bagikan, cetak ---------- */
  async function share(id) {
    const it = byId[id];
    const url = menuUrl(id);
    if (navigator.share) {
      try {
        await navigator.share({ title: `${it.nama} di Calibre Coffee Roasters`, text: `${it.nama}: ${it.katLabel} di Calibre Coffee Roasters, Surabaya.`, url });
        return;
      } catch (e) { if (e && e.name === "AbortError") return; }
    }
    if (await copyText(url)) { toast("Tautan menu disalin."); return; }
    window.prompt("Salin tautan menu ini:", url); // cadangan terakhir bila clipboard diblokir browser
  }

  function printMenu() {
    const host = $("[data-print-menu]");
    host.innerHTML = `<h1>Calibre Coffee Roasters: daftar menu terdokumentasi</h1>
      <p>Diperiksa ${esc(M.diperiksa)} dari sumber publik. Bukan daftar menu resmi. Harga yang tertera adalah PERKIRAAN perancang, bukan harga resmi. Hubungi kedai untuk harga dan ketersediaan terbaru: ${esc(window.CALIBRE.kontak.teleponTampil)}. Rancangan studi desain, bukan website resmi.</p>` +
      M.kategori.map((k) => {
        const part = items.filter((i) => i.kategori === k.id);
        if (!part.length) return "";
        return `<h2>${esc(k.label)}</h2><ul>` + part.map((i) => `<li><strong>${esc(i.nama)}</strong> <em>[${esc(M.status[i.status].singkat)}]</em>${i.varian && i.varian.length ? " (" + esc(i.varian.join(", ")) + ")" : ""} <span>${rupiah(i)}</span></li>`).join("") + `</ul>`;
      }).join("");
    window.print();
  }

  /* ---------- Arsip penelitian ---------- */
  el.arsip.innerHTML = M.arsip.map((a) => `<li><strong>${esc(a.nama)}</strong><span>${esc(a.alasan)}</span></li>`).join("");

  /* ---------- Peristiwa ---------- */
  renderTabs();
  render();

  el.tabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-kat]");
    if (!b) return;
    state.kat = b.dataset.kat;
    render();
  });
  el.search.addEventListener("input", () => { state.q = el.search.value; render(); });
  el.search.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && el.search.value) { e.stopPropagation(); el.search.value = ""; state.q = ""; render(); }
  });
  el.clear.addEventListener("click", () => { el.search.value = ""; state.q = ""; render(); el.search.focus(); });
  el.sort.addEventListener("change", () => { state.sort = el.sort.value; render(); });
  el.status.addEventListener("change", () => { state.status = el.status.value; render(); });
  el.favBtn.addEventListener("click", () => { state.favOnly = !state.favOnly; render(); });
  $("[data-print]").addEventListener("click", printMenu);
  // Saran pencarian cepat, tombol reset, dan pintasan "/" untuk fokus ke kolom cari (hanya di halaman Menu)
  const saran = $("[data-saran]");
  if (saran) saran.addEventListener("click", (e) => { const b = e.target.closest("[data-q]"); if (!b) return; el.search.value = b.dataset.q; state.q = b.dataset.q; render(); el.search.focus(); });
  if (el.resetBtn) el.resetBtn.addEventListener("click", resetAll);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if ((t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || (t && t.isContentEditable)) return;
    const pg = $('[data-page="menu"]');
    if (!pg || pg.hidden) return;
    e.preventDefault(); el.search.focus();
  });

  el.kosong.addEventListener("click", (e) => { if (e.target.closest('[data-act="reset"]')) resetAll(); });

  catalog.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const card = btn.closest(".card");
    const id = card && card.dataset.id;
    if (!id) return;
    const act = btn.dataset.act;
    if (act === "flip") { setFlip(card, !card.classList.contains("is-flip")); return; }
    if (act === "detail") openDetail(id, btn.tagName === "BUTTON" ? btn : card.querySelector('button[data-act="detail"]'));
    if (act === "fav") toggleFav(id);
    if (act === "add") {
      const it = byId[id];
      if (it.varian && it.varian.length) openDetail(id, btn); else window.Order.add(id, "");
    }
  });

  $("[data-detail-close]", el.detail).addEventListener("click", () => el.detail.close());
  $("[data-detail-fav]", el.detail).addEventListener("click", () => toggleFav(el.detail.dataset.id));
  $("[data-detail-share]", el.detail).addEventListener("click", () => share(el.detail.dataset.id));
  $("[data-detail-add]", el.detail).addEventListener("click", () => {
    if (window.Custom && window.Custom.active()) { window.Custom.add(); return; }
    const sel = $('input[name="varian"]:checked', el.detail);
    window.Order.add(el.detail.dataset.id, sel ? sel.value : "");
  });
  el.detail.addEventListener("close", () => {
    if (/^#m\//.test(location.hash)) history.replaceState(null, "", "#/menu");
  });

  /* ---------- Tautan langsung #m/<id> ---------- */
  function fromHash() {
    const m = location.hash.match(/^#m\/([a-z0-9-]+)$/);
    if (m && byId[m[1]]) {
      if (!el.detail.open || el.detail.dataset.id !== m[1]) {
        $("#menu").scrollIntoView();
        openDetail(m[1], null, true);
      }
    } else if (el.detail.open) {
      el.detail.close();
    }
  }
  window.addEventListener("hashchange", fromHash);
  if (/^#m\//.test(location.hash)) fromHash();

  // Menu diperbarui dari Google Sheets (js/sheet.js): bangun ulang daftar dan gambar ulang katalog.
  window.addEventListener("calibre:menu", () => { build(); renderTabs(); render(); $("[data-menu-total]").textContent = String(items.length); });

  // Dipakai dropdown navbar: terapkan filter kategori (atau favorit) lalu gambar ulang katalog.
  function filter(kat) { state.kat = kat && (kat === "semua" || M.kategori.some((k) => k.id === kat)) ? kat : "semua"; state.favOnly = false; state.q = ""; el.search.value = ""; render(); }
  window.Menu = { openDetail, filter };
})();
