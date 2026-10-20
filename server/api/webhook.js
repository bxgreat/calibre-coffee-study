/*
  Notifikasi Midtrans (atur URL ini di dashboard Midtrans: Settings > Payment > Notification URL).
  Tanda tangan diverifikasi: SHA512(order_id + status_code + gross_amount + serverKey). Status bayar disimpan ke pesanan.
*/
const crypto = require("crypto");
const store = require("../lib/store");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const key = process.env.MIDTRANS_SERVER_KEY;
  const n = req.body || {};
  const sig = crypto.createHash("sha512").update(String(n.order_id) + String(n.status_code) + String(n.gross_amount) + key).digest("hex");
  if (!key || sig !== n.signature_key) return res.status(403).json({ error: "Tanda tangan tidak valid" });

  const lunas = n.transaction_status === "settlement" || (n.transaction_status === "capture" && n.fraud_status === "accept");
  const gagal = ["deny", "cancel", "expire", "failure"].indexOf(n.transaction_status) >= 0;
  const o = await store.get(n.order_id);
  if (o) {
    o.bayar = lunas ? "lunas" : gagal ? "gagal" : "menunggu";
    if (gagal && o.status === "diterima") o.status = "batal";
    o.diubah = new Date().toISOString();
    await store.put(o.kode, o);
  }
  res.status(200).json({ ok: true });
};
