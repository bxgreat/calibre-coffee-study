/*
  Uji end-to-end backend lokal: node tools/uji-backend.js  (server/dev-server.js harus berjalan dengan ADMIN_TOKEN=rahasia123,
  dan harga contoh harus dimuat: node tools/sync-menu.js --contoh). Memeriksa order, voucher, status, dan otorisasi.
*/
const B = process.env.API || "http://127.0.0.1:8793", TOK = process.env.ADMIN_TOKEN || "rahasia123";
let ok = 0, gagal = 0;
const cek = (nama, kondisi, info) => { kondisi ? ok++ : gagal++; console.log((kondisi ? "LULUS " : "GAGAL ") + nama + (info ? " -> " + info : "")); };
const j = async (path, opt) => { const r = await fetch(B + path, opt); let b = null; try { b = await r.json(); } catch (_) {} return { s: r.status, b }; };
const post = (path, body, token) => j(path, { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) }, body: JSON.stringify(body) });

(async () => {
  const kode = "CLB-261020-" + Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "X");
  const items = [{ id: "calibre-latte", varian: "Es · Less ice · +Extra shot", qty: 2 }, { id: "waffle", varian: "", qty: 1 }];
  // 40000+8000 = 48000 x2 = 96000 ; waffle 47500 ; subtotal 143500 ; KOPIBARU 10% = 14350 (maks 20000)
  let r = await post("/api/order", { kode, nama: "Uji", hp: "0812", mode: "Makan di tempat", meja: "08", jam: "Secepatnya", voucher: "KOPIBARU", items });
  cek("order dibuat (201)", r.s === 201, JSON.stringify(r.b));
  cek("total dihitung server: 143500 - 14350 = 129150", r.b && r.b.total === 129150);
  r = await post("/api/order", { kode, items });
  cek("kode ganda ditolak (409)", r.s === 409);
  r = await post("/api/order", { kode: "CLB-261020-ZZZZ", items: [{ id: "tidak-ada", qty: 1 }] });
  cek("menu tanpa harga ditolak (422)", r.s === 422, r.b && r.b.error);
  r = await post("/api/order", { kode: "CLB-261020-YYYY", items: [{ id: "waffle", qty: 1 }], voucher: "NGOPIHEMAT" });
  cek("voucher dengan minimal belanja tidak terpenuhi ditolak (422)", r.s === 422, r.b && r.b.error);
  r = await post("/api/order", { kode: "ngawur", items });
  cek("kode format salah ditolak (400)", r.s === 400);
  r = await post("/api/order", { kode: "CLB-261020-QQQQ", items: [{ id: "waffle", varian: "+Rahasia", qty: 1 }] });
  cek("opsi tambahan tak dikenal ditolak (422)", r.s === 422);
  r = await j("/api/status?kode=" + kode);
  cek("status pembeli: diterima, tanpa data pribadi", r.s === 200 && r.b.status === "diterima" && !("nama" in r.b), JSON.stringify(r.b));
  r = await post("/api/status", { kode, status: "siap" });
  cek("ubah status tanpa token ditolak (401)", r.s === 401);
  r = await post("/api/status", { kode, status: "siap" }, "salah");
  cek("token salah ditolak (401)", r.s === 401);
  r = await post("/api/status", { kode, status: "diproses" }, TOK);
  cek("kedai ubah status ke diproses", r.s === 200);
  r = await post("/api/status", { kode, status: "ngawur" }, TOK);
  cek("status tidak valid ditolak (400)", r.s === 400);
  r = await post("/api/status", { kode, status: "siap" }, TOK);
  r = await j("/api/status?kode=" + kode);
  cek("pembeli melihat status siap", r.b && r.b.status === "siap");
  r = await j("/api/order");
  cek("daftar pesanan tanpa token ditolak (401)", r.s === 401);
  r = await j("/api/order", { headers: { Authorization: "Bearer " + TOK } });
  cek("kasir melihat daftar pesanan", r.s === 200 && r.b.pesanan.some((p) => p.kode === kode));
  r = await j("/api/voucher?kode=SALAH&total=100000");
  cek("voucher tak dikenal ditolak (422)", r.s === 422);
  if (process.env.SIM) {
    const k2 = "CLB-261020-" + Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "X");
    r = await post("/api/charge", { kode: k2, nama: "Uji", hp: "0812", items: [{ id: "waffle", qty: 2 }], voucher: "KOPIBARU" });
    cek("[simulasi] charge mengembalikan redirect ke bayar-simulasi (200)", r.s === 200 && r.b.simulasi === true && /bayar-simulasi/.test(r.b.redirect_url), JSON.stringify(r.b));
    cek("[simulasi] total = 95000 - 9500 = 85500", r.b && r.b.total === 85500);
    r = await j("/api/status?kode=" + k2);
    cek("[simulasi] status bayar awal: menunggu", r.b && r.b.bayar === "menunggu");
    r = await post("/api/simulasi", { kode: k2, metode: "bitcoin" });
    cek("[simulasi] metode tidak dikenal ditolak (400)", r.s === 400);
    r = await post("/api/simulasi", { kode: k2, metode: "qris" });
    cek("[simulasi] bayar via QRIS (200)", r.s === 200 && r.b.bayar === "lunas");
    r = await j("/api/status?kode=" + k2);
    cek("[simulasi] status bayar: lunas", r.b && r.b.bayar === "lunas");
    r = await post("/api/charge", { kode: "CLB-261020-NOPE", items: [{ id: "tidak-ada", qty: 1 }] });
    cek("[simulasi] menu tanpa harga tetap ditolak (422)", r.s === 422);
  }
  console.log(`\n${ok} lulus, ${gagal} gagal`);
  process.exit(gagal ? 1 : 0);
})();
