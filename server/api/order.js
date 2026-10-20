/*
  POST /api/order : mencatat pesanan agar kedai bisa memprosesnya dan pembeli bisa memantau status.
    Harga dan voucher dihitung ulang di server. Data pribadi (nama, HP) hanya dikirim bila situs dikonfigurasi memakai backend.
  GET  /api/order : (token admin) daftar pesanan terbaru untuk panel kasir.
*/
const store = require("../lib/store");
const { cors, hitungItems, hitungVoucher, admin, KODE } = require("../lib/util");

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method === "GET") {
    if (!admin(req)) return res.status(401).json({ error: "Tidak diizinkan" });
    return res.status(200).json({ pesanan: await store.recent(50), penyimpanan: store.mode });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Metode tidak diizinkan" });
  const b = req.body || {};
  if (!KODE.test(b.kode || "")) return res.status(400).json({ error: "Kode pesanan tidak valid" });
  if (await store.get(b.kode)) return res.status(409).json({ error: "Kode sudah dipakai" });
  const h = hitungItems(b.items);
  if (h.error) return res.status(h.status || 400).json({ error: h.error });
  const v = hitungVoucher(b.voucher, h.total);
  if (v.error) return res.status(422).json({ error: v.error });
  const rec = {
    kode: b.kode, waktu: new Date().toISOString(), status: "diterima", bayar: "belum",
    nama: String(b.nama || "").slice(0, 60), hp: String(b.hp || "").slice(0, 20), mode: String(b.mode || "").slice(0, 30), meja: String(b.meja || "").slice(0, 6),
    jam: String(b.jam || "").slice(0, 40), catatan: String(b.catatan || "").slice(0, 300), metode: String(b.metode || "").slice(0, 40),
    items: h.items, subtotal: h.total, potong: v.potong, voucher: v.voucher || "", total: h.total - v.potong
  };
  await store.put(rec.kode, rec); await store.addToList(rec.kode);
  res.status(201).json({ ok: true, kode: rec.kode, total: rec.total, status: rec.status });
};
