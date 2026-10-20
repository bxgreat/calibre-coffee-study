const crypto = require("crypto");
const HARGA = require("../harga-resmi.json");
let VOUCHER = []; try { VOUCHER = require("../voucher.json").daftar || []; } catch (_) {}

const ORIGIN = process.env.ALLOWED_ORIGIN || "";
function cors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN || "null");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") { res.status(204).end(); return true; }
  return false;
}

// Sama persis dengan aturan di js/checkout.js: varian bisa "Es · Less ice · +Extra shot".
function hitungItems(items) {
  const out = []; let total = 0;
  if (!Array.isArray(items) || !items.length || items.length > 40) return { error: "Keranjang kosong" };
  for (const it of items) {
    const qty = Math.floor(Number(it.qty));
    const bagian = String(it.varian || "").split(" · ");
    const tambah = bagian.filter((x) => x.charAt(0) === "+").map((x) => (HARGA._ekstra || {})[x.slice(1)]);
    const dasar = HARGA[it.id] && (HARGA[it.id][""] !== undefined ? HARGA[it.id][""] : HARGA[it.id][bagian[0]]);
    if (!(qty >= 1 && qty <= 50)) return { error: "Jumlah tidak valid" };
    if (tambah.some((x) => !Number.isInteger(x))) return { error: "Opsi tambahan tidak dikenal", status: 422 };
    if (!Number.isInteger(dasar) || dasar <= 0) return { error: "Menu " + it.id + " belum punya harga resmi", status: 422 };
    const harga = dasar + tambah.reduce((t, x) => t + x, 0);
    out.push({ id: String(it.id).slice(0, 50), varian: String(it.varian || "").slice(0, 80), qty, harga });
    total += harga * qty;
  }
  return { items: out, total };
}

function hitungVoucher(kode, total) {
  if (!kode) return { potong: 0 };
  const v = VOUCHER.find((x) => x.kode === String(kode).trim().toUpperCase());
  if (!v) return { error: "Kode voucher tidak dikenal" };
  if (v.sampai && new Date() > new Date(v.sampai + "T23:59:59+07:00")) return { error: "Voucher sudah kedaluwarsa" };
  if (v.min && total < v.min) return { error: "Minimal belanja Rp " + v.min.toLocaleString("id-ID") + " untuk voucher ini" };
  let potong = v.jenis === "persen" ? Math.floor(total * v.nilai / 100) : v.nilai;
  if (v.maks) potong = Math.min(potong, v.maks);
  potong = Math.min(potong, total);
  return { potong, voucher: v.kode };
}

function admin(req) {
  const t = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const k = process.env.ADMIN_TOKEN || "";
  if (!k || t.length !== k.length) return false;
  return crypto.timingSafeEqual(Buffer.from(t), Buffer.from(k));
}

const KODE = /^CLB-\d{6}-[A-Z0-9]{4}$/;
module.exports = { cors, hitungItems, hitungVoucher, admin, KODE, HARGA };
