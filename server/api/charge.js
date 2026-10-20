/*
  POST /api/charge : membuat pembayaran online untuk pesanan.
  Dua mode:
   - Midtrans Snap (bawaan): kunci rahasia hanya dari environment variable MIDTRANS_SERVER_KEY. Metode bayar (QRIS, VA bank,
     GoPay, ShopeePay, kartu, gerai) diatur di dashboard Midtrans, atau dibatasi lewat PAYMENT_METHODS (daftar dipisah koma
     sesuai nilai enabled_payments Midtrans). Mengembalikan token (snap.pay di dalam situs) dan redirect_url (cadangan).
   - Simulasi (PAYMENT_MODE=simulasi): TIDAK ADA uang dan tidak menghubungi gateway; mengarahkan ke bayar-simulasi.html untuk
     menguji seluruh alur (pilih metode, lunas, status berubah). Hanya untuk uji; jangan dipakai di produksi.
  Harga dan voucher selalu dihitung di server dari harga-resmi.json dan voucher.json, bukan dipercaya dari browser.
  Menu tanpa harga resmi ditolak. Pesanan dicatat (store) agar muncul di panel kasir.
*/
const store = require("../lib/store");
const { cors, hitungItems, hitungVoucher, KODE } = require("../lib/util");

const SANDBOX = process.env.MIDTRANS_PRODUCTION !== "true";
const SNAP = SANDBOX ? "https://app.sandbox.midtrans.com/snap/v1/transactions" : "https://app.midtrans.com/snap/v1/transactions";
const SIMULASI = () => process.env.PAYMENT_MODE === "simulasi";

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Metode tidak diizinkan" });
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key && !SIMULASI()) return res.status(503).json({ error: "Pembayaran belum dikonfigurasi" });

  const b = req.body || {};
  if (!KODE.test(b.kode || "")) return res.status(400).json({ error: "Kode pesanan tidak valid" });
  const h = hitungItems(b.items);
  if (h.error) return res.status(h.status || 400).json({ error: h.error });
  const v = hitungVoucher(b.voucher, h.total);
  if (v.error) return res.status(422).json({ error: v.error });
  const total = h.total - v.potong;
  if (total < 1000) return res.status(422).json({ error: "Total terlalu kecil" });

  let hasil;
  if (SIMULASI()) {
    const siteBase = process.env.SIM_PAGE || (process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.replace(/\/$/, "") + "/bayar-simulasi.html" : "bayar-simulasi.html");
    const api = (req.headers["x-forwarded-proto"] || "http") + "://" + req.headers.host;
    hasil = { simulasi: true, redirect_url: siteBase + "?kode=" + encodeURIComponent(b.kode) + "&api=" + encodeURIComponent(api), total };
  } else {
    const item_details = h.items.map((i) => ({ id: i.id, price: i.harga, quantity: i.qty, name: (i.id + (i.varian ? " " + i.varian : "")).slice(0, 50) }));
    if (v.potong) item_details.push({ id: "voucher", price: -v.potong, quantity: 1, name: ("Voucher " + v.voucher).slice(0, 50) });
    const body = {
      transaction_details: { order_id: b.kode, gross_amount: total },
      item_details,
      customer_details: { first_name: String(b.nama || "").slice(0, 50), phone: String(b.hp || "").slice(0, 20) },
      callbacks: process.env.FINISH_URL ? { finish: process.env.FINISH_URL } : undefined
    };
    if (process.env.PAYMENT_METHODS) body.enabled_payments = process.env.PAYMENT_METHODS.split(",").map((x) => x.trim()).filter(Boolean);
    const r = await fetch(SNAP, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: "Basic " + Buffer.from(key + ":").toString("base64") },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    if (!r.ok) return res.status(502).json({ error: "Gateway menolak permintaan" });
    hasil = { token: j.token, redirect_url: j.redirect_url, total };
  }

  if (!(await store.get(b.kode))) {
    const rec = { kode: b.kode, waktu: new Date().toISOString(), status: "diterima", bayar: "menunggu",
      nama: String(b.nama || "").slice(0, 60), hp: String(b.hp || "").slice(0, 20), mode: String(b.mode || "").slice(0, 30), meja: String(b.meja || "").slice(0, 6),
      jam: String(b.jam || "").slice(0, 40), catatan: String(b.catatan || "").slice(0, 300), metode: SIMULASI() ? "online (simulasi)" : "online",
      items: h.items, subtotal: h.total, potong: v.potong, voucher: v.voucher || "", total };
    await store.put(rec.kode, rec); await store.addToList(rec.kode);
  }
  res.status(200).json(hasil);
};
