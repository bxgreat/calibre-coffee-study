/*
  GET  /api/status?kode=CLB-...   : status pesanan untuk pembeli (hanya status dan total, tanpa data pribadi).
  POST /api/status {kode,status} : (token admin) kedai mengubah status: diterima, diproses, siap, selesai, batal.
*/
const store = require("../lib/store");
const { cors, admin, KODE } = require("../lib/util");
const VALID = ["diterima", "diproses", "siap", "selesai", "batal"];

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method === "GET") {
    const kode = String((req.query && req.query.kode) || "");
    if (!KODE.test(kode)) return res.status(400).json({ error: "Kode pesanan tidak valid" });
    const o = await store.get(kode);
    if (!o) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    return res.status(200).json({ kode: o.kode, status: o.status, bayar: o.bayar, total: o.total });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Metode tidak diizinkan" });
  if (!admin(req)) return res.status(401).json({ error: "Tidak diizinkan" });
  const b = req.body || {};
  if (!KODE.test(b.kode || "") || VALID.indexOf(b.status) < 0) return res.status(400).json({ error: "Permintaan tidak valid" });
  const o = await store.get(b.kode);
  if (!o) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
  o.status = b.status; o.diubah = new Date().toISOString();
  await store.put(o.kode, o);
  res.status(200).json({ ok: true, kode: o.kode, status: o.status });
};
