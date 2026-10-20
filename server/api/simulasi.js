/*
  POST /api/simulasi {kode, metode} : menandai pesanan lunas pada MODE SIMULASI (PAYMENT_MODE=simulasi). Tidak ada uang.
  Di luar mode simulasi endpoint ini menolak semua permintaan, sehingga tidak bisa dipakai untuk melunasi pesanan di produksi.
*/
const store = require("../lib/store");
const { cors, KODE } = require("../lib/util");
const METODE = ["qris", "bca_va", "bni_va", "bri_va", "mandiri_va", "permata_va", "gopay", "shopeepay", "dana", "ovo", "kartu", "indomaret", "alfamart"];

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (process.env.PAYMENT_MODE !== "simulasi") return res.status(403).json({ error: "Mode simulasi tidak aktif" });
  if (req.method !== "POST") return res.status(405).json({ error: "Metode tidak diizinkan" });
  const b = req.body || {};
  if (!KODE.test(b.kode || "") || METODE.indexOf(b.metode) < 0) return res.status(400).json({ error: "Permintaan tidak valid" });
  const o = await store.get(b.kode);
  if (!o) return res.status(404).json({ error: "Pesanan tidak ditemukan" });
  if (o.bayar === "lunas") return res.status(200).json({ ok: true, kode: o.kode, bayar: o.bayar });
  o.bayar = "lunas"; o.metodeBayar = b.metode + " (simulasi)"; o.diubah = new Date().toISOString();
  await store.put(o.kode, o);
  res.status(200).json({ ok: true, kode: o.kode, bayar: o.bayar });
};
