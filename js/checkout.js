/*
  Halaman checkout bertahap: 1 Keranjang, 2 Data, 3 Pembayaran, 4 Konfirmasi, 5 Selesai.
  PENTING: situs ini TIDAK memproses uang. Pembayaran adalah pilihan yang dikirim lewat WhatsApp; kedai yang
  mengonfirmasi stok, harga resmi, dan metode bayar yang tersedia. Pembayaran online sungguhan butuh gateway
  (mis. Midtrans/Xendit), akun merchant Calibre, dan backend, yang tidak ada di proyek ini.
  Status pesanan di riwayat dicatat sendiri oleh pengunjung di perangkatnya.
*/
(function () {
  "use strict";
  const { $, $$, esc, store, toast, copyText } = window.UI;
  const D = window.CALIBRE;
  const O = window.Order;
  const V = window.Voucher;
  const root = $("[data-checkout]");
  const hist = $("[data-riwayat]");
  if (!root || !O) return;

  const FORM_KEY = "calibre:checkout:v2";
  const HIST_KEY = "calibre:orders:v1";

  const METODE = [
    { id: "tunai", label: "Tunai di kasir", hint: "Bayar saat mengambil atau setelah makan." },
    { id: "kartu", label: "Kartu kredit atau debit di kasir", hint: "RestaurantGuru menyebut kartu kredit diterima (agregator, belum dikonfirmasi pemilik)." },
    { id: "qris", label: "QRIS", hint: "Pindai kode QRIS di kasir. Ketersediaan dikonfirmasi kedai." },
    { id: "transfer", label: "Transfer bank", hint: "Kedai mengirim detail rekening lewat WhatsApp setelah pesanan diterima. Jangan transfer sebelum dikonfirmasi kedai.", sub: ["BCA", "Mandiri", "BNI", "BRI", "Bank lain"], subLabel: "Bank asal" },
    { id: "ewallet", label: "E-wallet", hint: "Kedai mengirim cara bayar lewat WhatsApp. Jangan bayar ke nomor yang tidak dikirim kedai.", sub: ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"], subLabel: "Aplikasi" }
  ];
  const IKON = {
    online: '<path d="M4 7h16v10H4z M4 11h16 M8 15h3"/>', tunai: '<path d="M3 8h18v9H3z M12 10.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>',
    kartu: '<path d="M3 6h18v12H3z M3 10h18 M6 15h4"/>', qris: '<path d="M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h3v3h-3z M19 14v6 M14 20h3"/>',
    transfer: '<path d="M3 10l9-6 9 6H3z M5 10v8 M10 10v8 M14 10v8 M19 10v8 M3 20h18"/>', ewallet: '<path d="M4 7h14a2 2 0 0 1 2 2v9H6a2 2 0 0 1-2-2V7z M4 7l2-3h10 M16 13h2"/>'
  };
  const ikon = (id) => `<svg class="metode__ik" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${IKON[id] || ""}</svg>`;
  const diterima = (id) => ((D.pembayaran && D.pembayaran.terkonfirmasi) || []).indexOf(id) >= 0;
  // Metode "Bayar online" hanya ada bila backend pembayaran dipasang (CALIBRE.pembayaran.endpoint). Daftar metode yang
  // benar-benar tersedia (QRIS, VA bank, e-wallet, kartu, gerai) ditentukan di dashboard gateway atau PAYMENT_METHODS di server.
  const ONLINE = { id: "online", online: true, label: "Bayar online sekarang", hint: "QRIS, Virtual Account bank (BCA, BNI, BRI, Mandiri, Permata), GoPay, ShopeePay, kartu kredit atau debit, dan gerai minimarket. Pilihan yang muncul mengikuti pengaturan kedai." };
  const metodeList = () => (online() ? [ONLINE].concat(METODE) : METODE);
  const STATUS = [
    { id: "dikirim", label: "Dikirim ke WhatsApp" },
    { id: "dikonfirmasi", label: "Dikonfirmasi kedai" },
    { id: "dibayar", label: "Sudah dibayar" },
    { id: "selesai", label: "Selesai" }
  ];

  const blank = { nama: "", hp: "", mode: "Makan di tempat", meja: "", jam: "Secepatnya", catatan: "", metode: "", sub: "", setuju: false };
  let form = Object.assign({}, blank, store.get(FORM_KEY, {}), { setuju: false });
  const qrMeja = (new URLSearchParams(location.search).get("table") || new URLSearchParams(location.search).get("meja") || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 6);
  if (qrMeja) { form.mode = "Makan di tempat"; form.meja = qrMeja; }
  let step = 1;
  let errors = {};
  let kode = "";
  let viewKode = "";
  let history = store.get(HIST_KEY, []) || [];
  const qKode = new URLSearchParams(location.search).get("kode") || "";
  if (qKode && history.some((h) => h.kode === qKode)) { viewKode = qKode; step = 5; O.clear(); }

  const saveForm = () => store.set(FORM_KEY, form);
  const saveHist = () => store.set(HIST_KEY, history);
  const pad = (n) => String(n).padStart(2, "0");
  const titik = (hhmm) => hhmm.replace(":", ".");
  const tgl = (iso) => { const d = new Date(iso); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}.${pad(d.getMinutes())}`; };

  function newKode() {
    const d = new Date();
    const r = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "X");
    return `CLB-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${r}`;
  }

  /* ---------- Slot waktu dari jadwal buka (WIB) ---------- */
  function wibNow() {
    try {
      const f = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
      const p = Object.fromEntries(f.formatToParts(new Date()).map((x) => [x.type, x.value]));
      const hari = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
      return hari < 0 ? null : { hari, menit: (Number(p.hour) % 24) * 60 + Number(p.minute) };
    } catch (_) { return null; }
  }
  const mm = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmt = (m) => `${pad(Math.floor(m / 60))}.${pad(m % 60)}`;

  function slots() {
    const out = [form.mode === "Bawa pulang" ? "Siapkan sekarang (±10 menit)" : "Secepatnya"];
    const n = wibNow();
    if (!n) return out;
    const gen = (label, from, to) => { for (let t = from; t <= to; t += 30) out.push(`${label} ${fmt(t)} WIB`); };
    const hr = D.jadwal[n.hari];
    const start = Math.ceil((n.menit + 30) / 30) * 30;
    if (start <= mm(hr.tutup) - 30 && n.menit >= mm(hr.buka) - 60) gen("Hari ini", Math.max(start, mm(hr.buka)), mm(hr.tutup) - 30);
    else { const bs = D.jadwal[(n.hari + 1) % 7]; gen(`Besok (${bs.hari})`, mm(bs.buka), mm(bs.tutup) - 30); }
    return out;
  }

  /* ---------- Pesan WhatsApp dan struk ---------- */
  const lineText = (it) => `${it.qty}x ${it.nama}${it.varian ? " (" + it.varian + ")" : ""}`;
  const snap = () => O.lines().map((l) => { const it = O.byId[l.id]; return { id: l.id, nama: it.nama, varian: l.varian, qty: l.qty, harga: it.harga, resmi: !!it.resmi, rp: (it.rp || 0) + (l.extra || 0), extra: l.extra || 0 }; });
  const sumTotal = (items, potong) => (items.every((i) => i.resmi) ? O.idr(items.reduce((t, i) => t + i.rp * i.qty, 0) - (potong || 0)) : O.rb(items.reduce((t, i) => { const h = i.harga || [0, 0]; t[0] += h[0] * i.qty; t[1] += h[1] * i.qty; return t; }, [0, 0])));
  const isExact = (items) => items.length > 0 && items.every((i) => i.resmi);
  const totalLabel = (items) => "Total";
  const metodeText = (f) => { const m = metodeList().find((x) => x.id === f.metode); return m ? m.label + (f.sub ? ` (${f.sub})` : "") : "-"; };
  const modeText = (f) => f.mode + (f.mode === "Makan di tempat" && f.meja ? ` (meja ${f.meja})` : "");

  function message(rec) {
    const o = [`Halo Calibre Coffee Roasters, saya ingin memesan (kode ${rec.kode}):`];
    rec.items.forEach((it, i) => o.push(`${i + 1}. ${lineText(it)}`));
    o.push("", `Atas nama: ${rec.form.nama}`, `No. HP: ${rec.form.hp}`, `Cara menikmati: ${modeText(rec.form)}`, `Waktu: ${rec.form.jam}`,
      `Pembayaran yang diinginkan: ${metodeText(rec.form)}`);
    if (rec.potong) o.push(`Voucher: ${rec.voucher} (-${O.idr(rec.potong)})`);
    o.push(`Total dari situs: ${sumTotal(rec.items, rec.potong)}`);
    if (rec.form.catatan.trim()) o.push(`Catatan: ${rec.form.catatan.trim()}`);
    o.push("", "Mohon konfirmasi stok, harga resmi, dan metode bayar yang tersedia. Terima kasih.", isExact(rec.items) ? "(Dikirim dari website studi desain Calibre.)" : "(Dikirim dari website studi desain Calibre.)");
    return o.join("\n");
  }
  // Pembayaran online dan status langsung hanya aktif bila backend (server/) dipasang. Server menghitung ulang harga dan voucher.
  const online = () => !!(D.pembayaran && D.pembayaran.endpoint);
  const backend = () => ((D.backend && D.backend.endpoint) || (D.pembayaran && D.pembayaran.endpoint ? D.pembayaran.endpoint.replace(/\/api\/charge\/?$/, "") : "")).replace(/\/$/, "");
  const payload = (rec) => ({ kode: rec.kode, nama: rec.form.nama, hp: rec.form.hp, mode: rec.form.mode, meja: rec.form.meja, jam: rec.form.jam, catatan: rec.form.catatan, metode: rec.form.metode, voucher: rec.voucher || "",
    items: rec.items.map((i) => ({ id: i.id, varian: i.varian || "", qty: i.qty })) });

  async function registerOrder(rec) {
    if (!backend()) return;
    try {
      const r = await fetch(backend() + "/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload(rec)) });
      if (r.ok) { rec.live = true; saveHist(); if (step === 5 && viewKode === rec.kode) render(); }
    } catch (_) { /* tetap lewat WhatsApp */ }
  }

  function loadSnap() {
    return new Promise((res, rej) => {
      if (window.snap) return res();
      const sc = document.createElement("script");
      sc.src = D.pembayaran.produksi ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
      sc.setAttribute("data-client-key", D.pembayaran.clientKey);
      sc.onload = res; sc.onerror = () => rej(new Error("snap.js gagal dimuat"));
      document.head.appendChild(sc);
    });
  }
  function selesaiKirim(rec) { viewKode = rec.kode; O.clear(); kode = ""; step = 5; render(true); }

  async function bayarOnline(btn) {
    const e2 = validate(4);
    const info = $("[data-bayar-info]", root);
    if (Object.keys(e2).length) { errors = e2; render(); const c = $('input[data-f="setuju"]', root); if (c) c.focus(); return; }
    const rec = draft();
    btn.disabled = true; info.textContent = "Menyiapkan pembayaran aman...";
    try {
      const res = await fetch(D.pembayaran.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload(rec)) });
      const j = await res.json();
      if (!res.ok || !(j.token || j.redirect_url)) throw new Error(j.error || "Gagal membuat pembayaran");
      rec.live = true;
      history.unshift(rec); history = history.slice(0, 20); saveHist();
      if (j.token && D.pembayaran.clientKey) {
        await loadSnap();
        window.snap.pay(j.token, {
          onSuccess: () => selesaiKirim(rec), onPending: () => selesaiKirim(rec),
          onError: () => { btn.disabled = false; info.textContent = "Pembayaran gagal. Coba lagi atau kirim lewat WhatsApp."; },
          onClose: () => { btn.disabled = false; info.textContent = "Jendela pembayaran ditutup. Pesanan Anda tercatat; ketuk Bayar online untuk melanjutkan atau kirim lewat WhatsApp."; }
        });
      } else {
        location.href = j.redirect_url;
      }
    } catch (err) {
      btn.disabled = false; info.textContent = "Pembayaran online belum bisa dibuka (" + err.message + "). Gunakan WhatsApp.";
    }
  }

  /* ---------- Status langsung dari kedai dan notifikasi ---------- */
  const LIVE = [["diterima", "Diterima kedai"], ["diproses", "Sedang dibuat"], ["siap", "Siap diambil"], ["selesai", "Selesai"]];
  function liveInner(st, bayar) {
    const idx = LIVE.findIndex((x) => x[0] === st);
    if (st === "batal") return `<p class="live__batal">Pesanan dibatalkan. Hubungi kedai bila ada pertanyaan.</p>`;
    return `<p class="live__now">${esc((LIVE[idx] || LIVE[0])[1])}${bayar === "lunas" ? " · pembayaran lunas" : bayar === "gagal" ? " · pembayaran gagal" : ""}</p>
      <ol class="timeline" aria-label="Status dari kedai">${LIVE.map((x, i) => `<li class="timeline__i ${i <= idx ? "is-done" : ""}${i === idx ? " is-now" : ""}"><span class="timeline__d" aria-hidden="true">${i <= idx ? "✓" : ""}</span>${esc(x[1])}</li>`).join("")}</ol>`;
  }
  function liveHtml(rec) {
    const bisaNotif = "Notification" in window && Notification.permission === "default";
    return `<div class="live"><p class="catatan">Status langsung dari kedai (diperbarui tiap beberapa detik selama halaman ini terbuka).</p>
      <div data-live data-kode="${esc(rec.kode)}" aria-live="polite">${liveInner(rec.liveStatus || "diterima", rec.liveBayar)}</div>
      ${bisaNotif ? `<button type="button" class="btn btn--ghost btn--sm" data-notif>Beri tahu saya saat pesanan siap</button>` : ""}</div>`;
  }
  let pollT = 0;
  const stopPoll = () => { if (pollT) { clearInterval(pollT); pollT = 0; } };
  function notifySiap(rec) {
    toast("Pesanan " + rec.kode + " siap diambil!");
    try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch (_) {}
    try { if ("Notification" in window && Notification.permission === "granted") new Notification("Pesanan siap diambil", { body: "Kode " + rec.kode + " sudah siap di Calibre Coffee Roasters." }); } catch (_) {}
  }
  function startPoll(rec) {
    stopPoll();
    if (!rec.live || !backend()) return;
    const tick = async () => {
      try {
        const r = await fetch(backend() + "/api/status?kode=" + encodeURIComponent(rec.kode));
        if (!r.ok) return;
        const j = await r.json();
        const box = $("[data-live]", root);
        if (box && box.dataset.kode === rec.kode) box.innerHTML = liveInner(j.status, j.bayar);
        if (rec.liveStatus !== j.status || rec.liveBayar !== j.bayar) {
          const was = rec.liveStatus;
          rec.liveStatus = j.status; rec.liveBayar = j.bayar; saveHist();
          if (was && j.status === "siap") notifySiap(rec);
        }
        if (j.status === "selesai" || j.status === "batal") stopPoll();
      } catch (_) { /* coba lagi pada putaran berikutnya */ }
    };
    tick(); pollT = setInterval(tick, 12000);
  }
  const waUrl = (rec) => `https://wa.me/${D.kontak.whatsappNomor}?text=${encodeURIComponent(message(rec))}`;
  const draft = () => ({ kode, waktu: new Date().toISOString(), items: snap(), est: O.estimate(), form: Object.assign({}, form), status: "dikirim", voucher: V.potong(O.exact()) ? V.kode() : "", potong: O.exact() === null ? 0 : V.potong(O.exact()) });

  function printStruk(rec) {
    const host = $("[data-print-menu]");
    host.innerHTML = `<h1>Calibre Coffee Roasters: ringkasan pesanan</h1>
      <p>Kode ${esc(rec.kode)} · ${esc(tgl(rec.waktu))}. Ini ringkasan dari website studi desain, <strong>bukan struk pembayaran resmi</strong>. </p>
      <ul>${rec.items.map((it) => `<li>${esc(lineText(it))} <span>${esc(O.fmtItem(it, it.qty))}</span></li>`).join("")}</ul>
      ${rec.potong ? `<p>Voucher ${esc(rec.voucher)}: -${esc(O.idr(rec.potong))}</p>` : ""}<p><strong>${totalLabel(rec.items)}: ${esc(sumTotal(rec.items, rec.potong))}</strong></p>
      <p>Atas nama ${esc(rec.form.nama)} (${esc(rec.form.hp)}). ${esc(modeText(rec.form))}. Waktu: ${esc(rec.form.jam)}. Pembayaran: ${esc(metodeText(rec.form))}.</p>
      <p>Status (dicatat pengunjung): ${esc((STATUS.find((s) => s.id === rec.status) || {}).label)}.</p>`;
    window.print();
  }

  /* ---------- Validasi ---------- */
  function validate(n) {
    const e = {};
    if (n === 1 && !O.count()) e.keranjang = "Keranjang masih kosong. Pilih menu dulu.";
    if (n === 2) {
      if (form.nama.trim().length < 2) e.nama = "Isi nama (minimal 2 huruf).";
      if (!/^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(form.hp.replace(/[\s-]/g, ""))) e.hp = "Nomor HP tidak valid. Contoh: 0812-3456-7890.";
    }
    if (n === 3) {
      const m = metodeList().find((x) => x.id === form.metode);
      if (!m) e.metode = "Pilih salah satu metode pembayaran.";
      else if (m.sub && !form.sub) e.sub = `Pilih ${m.subLabel.toLowerCase()}.`;
    }
    if (n === 4 && !form.setuju) e.setuju = "Centang dulu pernyataan di atas untuk melanjutkan.";
    return e;
  }

  /* ---------- Render ---------- */
  const STEPS = ["Keranjang", "Data", "Pembayaran", "Konfirmasi"];
  const errP = (k) => (errors[k] ? `<p class="err" id="err-${k}" role="alert">${esc(errors[k])}</p>` : "");

  const stepper = () => `<ol class="stepper" aria-label="Langkah checkout">${STEPS.map((s, i) => {
    const n = i + 1, st = step > 4 ? "done" : n < step ? "done" : n === step ? "now" : "todo";
    return `<li class="stepper__i is-${st}"${n === step ? ' aria-current="step"' : ""}><span class="stepper__n">${st === "done" ? "✓" : n}</span><span class="stepper__l">${s}</span></li>`;
  }).join("")}</ol>`;

  function cartHtml() {
    const ls = O.lines();
    if (!ls.length) return `<div class="kosong-box"><p class="kosong__judul">Keranjang kosong.</p><p>Tambahkan menu dari halaman Menu, lalu kembali ke sini.</p><a class="btn btn--primary" href="#/menu">Pilih menu</a></div>`;
    return `<ul class="oitems">${ls.map((l) => {
      const it = O.byId[l.id], k = O.keyOf(l.id, l.varian);
      return `<li class="oitem" data-key="${esc(k)}">
        ${it.foto ? `<img class="oitem__img" src="${esc(it.foto.src)}" alt="" width="64" height="64">` : `<span class="oitem__img oitem__img--art">${window.Art.svg(it.art, "")}</span>`}
        <div class="oitem__info"><p class="oitem__nama">${esc(it.nama)}</p>${l.varian ? `<p class="oitem__varian">${esc(l.varian)}</p>` : ""}
          <p class="oitem__harga">${esc(O.fmtLine(l))}</p>
          <button type="button" class="oitem__hapus" data-remove aria-label="Hapus ${esc(it.nama)} dari pesanan">Hapus</button></div>
        <div class="qty" role="group" aria-label="Jumlah ${esc(it.nama)}">
          <button type="button" class="qty__btn" data-qty="-1" aria-label="Kurangi ${esc(it.nama)}">&minus;</button>
          <span class="qty__n" aria-live="polite">${l.qty}</span>
          <button type="button" class="qty__btn" data-qty="1" aria-label="Tambah ${esc(it.nama)}">+</button></div></li>`;
    }).join("")}</ul>`;
  }

  const diskon = () => { const x = O.exact(); return x === null ? 0 : V.potong(x); };
  function totalRows(kecil) {
    const x = O.exact(), d = diskon();
    if (!d) return `<p class="total"><span>Total${kecil ? "" : " <small>(belum termasuk pajak atau biaya layanan bila ada)</small>"}</span><strong>${esc(O.totalText())}</strong></p>`;
    return `<p class="total total--sub"><span>Subtotal</span><span>${esc(O.idr(x))}</span></p><p class="total total--sub"><span>Voucher ${esc(V.kode())}</span><span>-${esc(O.idr(d))}</span></p><p class="total"><span>Total</span><strong>${esc(O.idr(x - d))}</strong></p>`;
  }
  const totalBar = () => totalRows(false);
  function voucherHtml() {
    const d = diskon();
    if (V.kode() && d) return `<div class="voucher"><p class="voucher__ok" role="status">Voucher <strong>${esc(V.kode())}</strong> dipakai: potongan ${esc(O.idr(d))}${V.def().contoh ? " (contoh)" : ""}. <button type="button" class="link-btn" data-voucher-hapus>Hapus</button></p></div>`;
    return `<div class="voucher"><label for="c-voucher">Punya kode voucher?</label><div class="voucher__row"><input id="c-voucher" type="text" maxlength="20" autocomplete="off" spellcheck="false" placeholder="Masukkan kode"><button class="btn btn--ghost btn--sm" type="button" data-voucher-pakai>Pakai</button></div><p class="catatan" data-voucher-info role="status">${(window.CALIBRE.voucher || []).some((v) => v.contoh) ? "Contoh kode untuk uji: " + window.CALIBRE.voucher.filter((v) => v.contoh).map((v) => v.kode).join(", ") + "." : ""}</p></div>`;
  }


  function stepHtml() {
    if (step === 1) return `<h2 class="step__h" tabindex="-1">1. Keranjang</h2>${errP("keranjang")}${cartHtml()}${O.count() ? voucherHtml() + pairingHtml() + totalBar() : ""}
      <div class="step__aksi">${O.count() ? `<button class="btn btn--ghost" type="button" data-clear>Kosongkan</button><button class="btn btn--primary" type="button" data-next>Lanjut: data pemesan</button>` : ""}</div>`;

    if (step === 2) {
      const sl = slots();
      return `<h2 class="step__h" tabindex="-1">2. Data pemesan</h2>
      <div class="field field--blok"><label for="c-nama">Nama</label><input id="c-nama" type="text" autocomplete="name" maxlength="60" value="${esc(form.nama)}" data-f="nama" ${errors.nama ? 'aria-invalid="true" aria-describedby="err-nama"' : ""}>${errP("nama")}</div>
      <div class="field field--blok"><label for="c-hp">Nomor HP / WhatsApp</label><input id="c-hp" type="text" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="0812-3456-7890" value="${esc(form.hp)}" data-f="hp" ${errors.hp ? 'aria-invalid="true" aria-describedby="err-hp"' : ""}>${errP("hp")}</div>
      <fieldset class="field field--blok"><legend>Cara menikmati</legend>
        <label class="radio"><input type="radio" name="c-mode" value="Makan di tempat" data-f="mode" ${form.mode === "Makan di tempat" ? "checked" : ""}> <span>Makan di tempat <small>(dine-in, pilih nomor meja)</small></span></label>
        <label class="radio"><input type="radio" name="c-mode" value="Bawa pulang" data-f="mode" ${form.mode === "Bawa pulang" ? "checked" : ""}> <span>Ambil sendiri <small>(pick-up tanpa antre, pilih jam ambil)</small></span></label></fieldset>
      <div class="field field--blok" data-meja ${form.mode === "Makan di tempat" ? "" : "hidden"}><label for="c-meja">Nomor meja <small>(opsional, jika sudah duduk)</small></label><input id="c-meja" type="text" maxlength="6" value="${esc(form.meja)}" data-f="meja"></div>
      <div class="field field--blok"><label for="c-jam">Waktu</label><select id="c-jam" data-f="jam">${sl.map((s) => `<option${s === form.jam ? " selected" : ""}>${esc(s)}</option>`).join("")}</select><p class="catatan">Pilihan waktu mengikuti jadwal reguler (WIB). Kedai tetap mengonfirmasi.</p></div>
      <div class="field field--blok"><label for="c-cat">Catatan untuk kedai</label><textarea id="c-cat" rows="3" maxlength="300" placeholder="Misalnya: kurangi gula" data-f="catatan">${esc(form.catatan)}</textarea></div>
      <div class="step__aksi"><button class="btn btn--ghost" type="button" data-prev>Kembali</button><button class="btn btn--primary" type="button" data-next>Lanjut: pembayaran</button></div>`;
    }

    if (step === 3) return `<h2 class="step__h" tabindex="-1">3. Pembayaran</h2>
      <p class="aman"><strong>Tidak ada uang yang dibayar di halaman ini.</strong> Pilihan Anda dikirim ke kedai. Waspada penipuan: bayar hanya ke detail yang dikirim langsung oleh kedai di WhatsApp resmi (${esc(D.kontak.teleponTampil)}).</p>
      <ol class="alur" aria-label="Alur pesanan"><li><b>1</b> Pesanan dikirim ke WhatsApp kedai</li><li><b>2</b> Kedai konfirmasi stok dan total</li><li><b>3</b> Anda bayar sesuai metode yang kedai kirim</li></ol>
      <fieldset class="metode" ${errors.metode ? 'aria-describedby="err-metode"' : ""}><legend class="sr-only">Metode pembayaran</legend>
      ${metodeList().map((m) => `<label class="metode__k${form.metode === m.id ? " is-on" : ""}"><input type="radio" name="c-metode" value="${m.id}" data-f="metode" ${form.metode === m.id ? "checked" : ""}>
        ${ikon(m.id)}<span class="metode__t"><strong>${esc(m.label)}</strong><small>${esc(m.hint)}</small>${m.online || diterima(m.id) ? `<span class="tag tag--terkini"><span class="stat stat--penuh" aria-hidden="true"></span>${m.online ? "Dibayar sekarang, langsung terkonfirmasi" : "Diterima kedai"}</span>` : `<span class="tag tag--belum"><span class="stat stat--kosong" aria-hidden="true"></span>Belum dikonfirmasi kedai</span>`}</span>
        ${m.sub ? `<span class="metode__sub" ${form.metode === m.id ? "" : "hidden"}><label for="c-sub-${m.id}">${esc(m.subLabel)}</label><select id="c-sub-${m.id}" data-f="sub"><option value="">Pilih</option>${m.sub.map((s) => `<option${s === form.sub ? " selected" : ""}>${esc(s)}</option>`).join("")}</select></span>` : ""}</label>`).join("")}
      </fieldset>${errP("metode")}${errP("sub")}
      <div class="step__aksi"><button class="btn btn--ghost" type="button" data-prev>Kembali</button><button class="btn btn--primary" type="button" data-next>Lanjut: konfirmasi</button></div>`;

    if (step === 4) {
      const rec = draft();
      return `<h2 class="step__h" tabindex="-1">4. Konfirmasi</h2>
      <div class="ringkas"><ul class="ringkas__list">${rec.items.map((it) => `<li><span>${esc(lineText(it))}</span><span>${esc(O.fmtItem(it, it.qty))}</span></li>`).join("")}</ul>${totalBar()}
        <dl class="ringkas__d"><div><dt>Atas nama</dt><dd>${esc(form.nama)} · ${esc(form.hp)}</dd></div><div><dt>Cara menikmati</dt><dd>${esc(modeText(form))}</dd></div><div><dt>Waktu</dt><dd>${esc(form.jam)}</dd></div><div><dt>Pembayaran</dt><dd>${esc(metodeText(form))}</dd></div>${form.catatan.trim() ? `<div><dt>Catatan</dt><dd>${esc(form.catatan)}</dd></div>` : ""}<div><dt>Kode pesanan</dt><dd><strong>${esc(kode)}</strong></dd></div></dl></div>
      ${pairingHtml()}
      <label class="cek"><input type="checkbox" data-f="setuju" ${form.setuju ? "checked" : ""} ${errors.setuju ? 'aria-invalid="true" aria-describedby="err-setuju"' : ""}> <span>${isExact(draft().items) ? "Saya paham ini rancangan studi desain; stok, harga, dan metode bayar dikonfirmasi kedai." : "Saya paham ini rancangan studi desain; stok, harga, dan metode bayar dikonfirmasi kedai."}</span></label>${errP("setuju")}
      <div class="step__aksi"><button class="btn btn--ghost" type="button" data-prev>Kembali</button>
        ${form.metode === "online" ? `<button class="btn btn--primary btn--lg" type="button" data-bayar>Bayar online</button>` : ""}
        <a class="btn ${form.metode === "online" ? "btn--ghost" : "btn--primary"} btn--lg" data-send data-order-wa href="${esc(waUrl(rec))}" target="_blank" rel="noopener">${form.metode === "online" ? "Kirim ke WhatsApp saja" : "Kirim ke WhatsApp"}</a></div>
      <p class="catatan" data-bayar-info role="status"></p>
      ${backend() ? `<p class="catatan">Pesanan (nama, nomor HP, isi pesanan) juga dicatat di sistem kedai agar statusnya bisa dipantau, dan dihapus otomatis setelah 3 hari.</p>` : ""}
      <p class="catatan">Tombol membuka WhatsApp dengan pesan siap kirim. Pesanan baru dianggap dikirim setelah Anda menekan kirim di WhatsApp.</p>`;
    }

    // step 5: selesai
    const rec = history.find((h) => h.kode === viewKode);
    if (!rec) return `<p>Pesanan tidak ditemukan.</p>`;
    const idx = STATUS.findIndex((s) => s.id === rec.status);
    const next = STATUS[idx + 1];
    return `<div class="selesai"><p class="selesai__tag">Pesanan siap dikirim</p><h2 class="step__h selesai__kode" tabindex="-1">${esc(rec.kode)}</h2>
      <p>Selesaikan percakapan di WhatsApp. Kedai akan mengonfirmasi stok, harga resmi, dan cara bayar${rec.form.metode === "transfer" || rec.form.metode === "ewallet" ? ", termasuk detail pembayaran" : ""}.</p>
      <ol class="timeline" aria-label="Status pesanan">${STATUS.map((s, i) => `<li class="timeline__i ${i <= idx ? "is-done" : ""}${i === idx ? " is-now" : ""}"><span class="timeline__d" aria-hidden="true">${i <= idx ? "✓" : ""}</span>${esc(s.label)}</li>`).join("")}</ol>
      ${rec.live ? liveHtml(rec) : `<p class="catatan">Status dicatat sendiri oleh Anda di perangkat ini; situs tidak tersambung ke kedai.</p>`}
      ${next && !rec.live ? `<button class="btn btn--ghost" type="button" data-status="${next.id}" data-kode="${esc(rec.kode)}">Tandai: ${esc(next.label.toLowerCase())}</button>` : ""}
      <div class="ringkas"><ul class="ringkas__list">${rec.items.map((it) => `<li><span>${esc(lineText(it))}</span><span>${esc(O.fmtItem(it, it.qty))}</span></li>`).join("")}</ul>
        <p class="total"><span>${totalLabel(rec.items)}${isExact(rec.items) ? "" : ""}</span><strong>${esc(sumTotal(rec.items, rec.potong))}</strong></p></div>
      <div class="step__aksi step__aksi--wrap"><a class="btn btn--primary" data-order-wa href="${esc(waUrl(rec))}" target="_blank" rel="noopener">Kirim ulang ke WhatsApp</a>
        <button class="btn btn--ghost" type="button" data-struk data-kode="${esc(rec.kode)}">Cetak ringkasan</button>
        <button class="btn btn--ghost" type="button" data-salin data-kode="${esc(rec.kode)}">Salin pesan</button>
        <button class="btn btn--ghost" type="button" data-baru>Pesan lagi dari awal</button></div></div>`;
  }

  function renderHist() {
    if (!hist) return;
    if (!history.length) { hist.innerHTML = `<h2 class="riwayat__h">Riwayat</h2><p class="catatan">Belum ada pesanan di perangkat ini.</p>`; return; }
    hist.innerHTML = `<h2 class="riwayat__h">Riwayat <span class="count">${history.length}</span></h2><ul class="riwayat__list">${history.map((h) => `<li><p><strong>${esc(h.kode)}</strong><small>${esc(tgl(h.waktu))} · ${esc((STATUS.find((s) => s.id === h.status) || {}).label)}</small></p><p class="riwayat__tot">${esc(sumTotal(h.items, h.potong))}</p>
      <div class="riwayat__aksi"><button type="button" class="link-btn" data-lihat="${esc(h.kode)}">Lihat</button><button type="button" class="link-btn" data-ulang="${esc(h.kode)}">Pesan lagi</button></div></li>`).join("")}</ul>
      <button type="button" class="link-btn" data-hapus-riwayat>Hapus riwayat</button><p class="catatan">Tersimpan hanya di browser ini.</p>`;
  }

  /* ---------- Pasangan menu (saran tambahan, satu ketukan) ---------- */
  const MINUMAN = ["espresso", "manual", "noncoffee", "frappe"];
  function pairingHtml() {
    const ls = O.lines(); if (!ls.length) return "";
    const kat = ls.map((l) => O.byId[l.id].kategori);
    const inCart = new Set(ls.map((l) => l.id));
    const semuaMinuman = kat.every((k) => MINUMAN.indexOf(k) >= 0);
    const adaBerat = kat.some((k) => k === "main" || k === "bites");
    const adaMinuman = kat.some((k) => MINUMAN.indexOf(k) >= 0);
    let ids = [], judul = "";
    if (semuaMinuman) { ids = ["chocolate-croissant", "banana-nutella-spring-roll", "waffle"]; judul = "Teman ngopi yang pas"; }
    else if (adaBerat && !adaMinuman) { ids = ["mango-peach-frappe", "teh-dingin", "calibre-latte"]; judul = "Minuman penyegar untuk makanan ini"; }
    const pil = ids.filter((id) => O.byId[id] && !inCart.has(id) && !O.byId[id].habis).slice(0, 2);
    if (!pil.length) return "";
    return `<div class="pasang"><p class="pasang__h">${judul}</p>${pil.map((id) => { const it = O.byId[id]; return `<div class="pasang__i"><span>${esc(it.nama)}</span><button type="button" class="btn btn--ghost btn--sm" data-pair="${esc(id)}">+ ${esc(O.idr(it.rp))}</button></div>`; }).join("")}</div>`;
  }

  function sideHtml() {
    const ex = O.exact() !== null;
    return `<section class="co__side" aria-label="Ringkasan pesanan"><h3 class="co__sh">Pesanan Anda <span class="count">${O.count()}</span></h3>
      <ul class="co__list">${O.lines().map((l) => { const it = O.byId[l.id]; return `<li><span>${l.qty}× ${esc(it.nama)}${l.varian ? ` <small>${esc(l.varian)}</small>` : ""}</span><span>${esc(O.fmtLine(l))}</span></li>`; }).join("")}</ul>
      ${totalRows(true)}
      <p class="co__note">${O.count() && O.lines().some((l) => O.byId[l.id].contoh) ? "Harga contoh studi desain." : "Harga dari kedai."} Belum termasuk pajak atau biaya layanan bila ada. Tidak ada uang diproses di halaman ini.</p>
      ${step > 1 ? `<button type="button" class="link-btn" data-edit-cart>Ubah pesanan</button>` : ""}</section>`;
  }

  function render(focus) {
    const side = step >= 2 && step <= 4 && O.count() ? sideHtml() : "";
    root.innerHTML = `${step <= 4 ? stepper() : ""}<div class="co${side ? " co--side" : ""}"><div class="step" data-step="${step}">${stepHtml()}</div>${side}</div>`;
    renderHist();
    if (focus) { const h = $(".step__h", root); if (h) h.focus({ preventScroll: true }); }
    if (step === 5) { const r5 = history.find((h) => h.kode === viewKode); if (r5) startPoll(r5); } else stopPoll();
  }

  function go(n) {
    errors = {};
    step = n;
    if (n === 4 && !kode) kode = newKode();
    render(true);
    root.scrollIntoView({ block: "start" });
  }

  /* ---------- Peristiwa ---------- */
  root.addEventListener("input", (e) => {
    const f = e.target.dataset && e.target.dataset.f;
    if (!f) return;
    form[f] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    saveForm();
  });
  root.addEventListener("change", (e) => {
    const f = e.target.dataset && e.target.dataset.f;
    if (!f) return;
    form[f] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (f === "mode") {
      $("[data-meja]", root).hidden = form.mode !== "Makan di tempat";
      const sl = slots(); form.jam = sl[0];
      $("#c-jam", root).innerHTML = sl.map((s) => `<option${s === form.jam ? " selected" : ""}>${esc(s)}</option>`).join("");
    }
    if (f === "metode") {
      form.sub = "";
      $$(".metode__k", root).forEach((k) => { const on = $("input", k).checked; k.classList.toggle("is-on", on); const s = $(".metode__sub", k); if (s) s.hidden = !on; });
    }
    saveForm();
  });
  root.addEventListener("click", (e) => {
    const t = e.target;
    const row = t.closest(".oitem");
    if (row) {
      const k = row.dataset.key, l = O.lines().find((x) => O.keyOf(x.id, x.varian) === k);
      if (l && t.closest("[data-remove]")) { O.setQty(k, 0); render(); return; }
      const q = t.closest("[data-qty]");
      if (l && q) { O.setQty(k, l.qty + Number(q.dataset.qty)); render(); const nr = $(`.oitem[data-key="${CSS.escape(k)}"] [data-qty="${q.dataset.qty}"]`, root); if (nr) nr.focus(); return; }
    }
    const pr2 = t.closest("[data-pair]"); if (pr2) { O.add(pr2.dataset.pair, "", 0); render(); return; }
    if (t.closest("[data-edit-cart]")) { go(1); return; }
    if (t.closest("[data-clear]")) { O.clear(); toast("Keranjang dikosongkan."); render(); return; }
    if (t.closest("[data-prev]")) { go(step - 1); return; }
    if (t.closest("[data-next]")) {
      const e2 = validate(step);
      if (Object.keys(e2).length) { errors = e2; render(); const bad = $('[aria-invalid="true"]', root) || $(".err", root); if (bad) bad.focus ? bad.focus() : bad.scrollIntoView(); return; }
      go(step + 1); return;
    }
    if (t.closest("[data-bayar]")) { bayarOnline(t.closest("[data-bayar]")); return; }
    if (t.closest("[data-voucher-pakai]")) {
      const val = $("#c-voucher", root).value, info = $("[data-voucher-info]", root);
      const h = V.pakai(val, O.exact() === null ? 0 : O.exact());
      if (!h.ok) { info.textContent = h.pesan; return; }
      toast(h.pesan); render(); return;
    }
    if (t.closest("[data-voucher-hapus]")) { V.hapus(); render(); return; }
    if (t.closest("[data-notif]")) { Notification.requestPermission().then(() => render()); return; }
    const send = t.closest("[data-send]");
    if (send) {
      const e2 = validate(4);
      if (Object.keys(e2).length) { e.preventDefault(); errors = e2; render(); const c = $('input[data-f="setuju"]', root); if (c) c.focus(); return; }
      const rec = draft();
      history.unshift(rec); history = history.slice(0, 20); saveHist();
      viewKode = rec.kode;
      registerOrder(rec);
      setTimeout(() => { O.clear(); kode = ""; step = 5; render(true); toast("Pesan dibuka di WhatsApp. Kirim di sana untuk menyelesaikan."); }, 300);
      return; // tautan WhatsApp tetap dijalankan browser
    }
    const st = t.closest("[data-status]");
    if (st) { const r = history.find((h) => h.kode === st.dataset.kode); if (r) { r.status = st.dataset.status; saveHist(); render(true); } return; }
    const pr = t.closest("[data-struk]");
    if (pr) { const r = history.find((h) => h.kode === pr.dataset.kode); if (r) printStruk(r); return; }
    const sa = t.closest("[data-salin]");
    if (sa) { const r = history.find((h) => h.kode === sa.dataset.kode); if (r) copyText(message(r)).then((ok) => toast(ok ? "Pesan disalin." : "Gagal menyalin.")); return; }
    if (t.closest("[data-baru]")) { viewKode = ""; go(1); return; }
  });

  if (hist) hist.addEventListener("click", (e) => {
    const t = e.target;
    const lh = t.closest("[data-lihat]");
    if (lh) { viewKode = lh.dataset.lihat; step = 5; render(true); root.scrollIntoView({ block: "start" }); return; }
    const ul = t.closest("[data-ulang]");
    if (ul) {
      const r = history.find((h) => h.kode === ul.dataset.ulang);
      if (r) { O.setLines(r.items.map((i) => ({ id: i.id, varian: i.varian, qty: i.qty }))); form = Object.assign({}, form, r.form, { setuju: false, jam: "Secepatnya" }); saveForm(); kode = ""; toast("Item pesanan dimasukkan ke keranjang."); go(1); }
      return;
    }
    if (t.closest("[data-hapus-riwayat]")) { if (window.confirm("Hapus semua riwayat pesanan di browser ini?")) { history = []; saveHist(); renderHist(); } }
  });

  O.onChange(() => { if (step === 1 && !root.closest("[hidden]")) render(); });
  window.addEventListener("routechange", (e) => {
    if (e.detail.route === "pesan") { if (step === 5 && !history.length) step = 1; if (step > 1 && step < 5 && !O.count()) step = 1; render(); }
  });
  render();
})();
