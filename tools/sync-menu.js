/*
  Sinkron data menu ganda. Sumber kebenaran: js/menu-data.js (+ opsi di js/data.js).
  Menghasilkan:
    - server/harga-resmi.json  (harga untuk pembayaran online)
    - docs/menu-template.csv   (kolom awal untuk Google Sheets)
  Pakai:   node tools/sync-menu.js            -> hanya harga yang BUKAN contoh (harga dari kedai)
           node tools/sync-menu.js --contoh   -> termasuk harga contoh (hanya untuk uji sandbox, jangan live)
           node tools/sync-menu.js --cek      -> tidak menulis; gagal (exit 1) bila berkas berbeda dari sumber
*/
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);
["js/data.js", "js/menu-data.js"].forEach((f) => vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f }));
const M = ctx.window.CALIBRE_MENU, D = ctx.window.CALIBRE;
const withContoh = process.argv.includes("--contoh"), cek = process.argv.includes("--cek");

const ekstra = {};
(D.opsi.ekstra || []).forEach((e) => { ekstra[e.label] = e.rp; });
const harga = { _petunjuk: "Dihasilkan oleh tools/sync-menu.js dari js/menu-data.js. Jangan edit manual; ubah sumbernya lalu jalankan ulang. Varian = '' untuk tanpa varian.", _ekstra: ekstra };
let dilewati = 0;
M.items.forEach((it) => {
  if (!it.rp || (it.contoh && !withContoh)) { dilewati++; return; }
  const v = {};
  if (it.varian && it.varian.length) it.varian.forEach((x) => { v[x] = it.rp; }); else v[""] = it.rp;
  harga[it.id] = v;
});

const q = (s) => /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
const csv = ["id,nama,kategori,harga,status,varian,label,deskripsi,foto,asam,body,manis,notes"]
  .concat(M.items.map((it) => [it.id, it.nama, it.kategori, it.contoh ? "" : it.rp, "ada", (it.varian || []).join("|"), it.label || "", "", "", "", "", "", ""].map((x) => q(String(x))).join(",")))
  .concat(["suasana,,,,tenang,,,Banyak meja kosong,,,,,"]).join("\n") + "\n";

const vc = (D.voucher || []).filter((v) => withContoh || !v.contoh);
const vjson = JSON.stringify({ _petunjuk: "Dihasilkan oleh tools/sync-menu.js dari CALIBRE.voucher di js/data.js. Voucher contoh hanya masuk dengan --contoh.", daftar: vc }, null, 2) + "\n";
const out = [["server/harga-resmi.json", JSON.stringify(harga, null, 2) + "\n"], ["docs/menu-template.csv", csv], ["server/voucher.json", vjson]];
let beda = false;
out.forEach(([f, isi]) => {
  const p = path.join(root, f);
  if (cek) { if (!fs.existsSync(p) || fs.readFileSync(p, "utf8") !== isi) { console.error("BERBEDA: " + f); beda = true; } return; }
  fs.writeFileSync(p, isi);
  console.log("ditulis " + f);
});
console.log(`${M.items.length} menu, ${M.items.length - dilewati} berharga di harga-resmi.json, ${dilewati} dilewati (harga contoh atau kosong)`);
if (cek && beda) process.exit(1);
