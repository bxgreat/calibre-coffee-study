/* GET /api/voucher?kode=...&total=76000 : memeriksa voucher di server (sumber sama dengan yang dipakai saat membuat pesanan). */
const { cors, hitungVoucher } = require("../lib/util");

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  const q = req.query || {};
  const total = Math.floor(Number(q.total));
  if (!(total > 0)) return res.status(400).json({ error: "Total tidak valid" });
  const v = hitungVoucher(q.kode, total);
  if (v.error) return res.status(422).json({ error: v.error });
  res.status(200).json({ kode: v.voucher, potong: v.potong });
};
