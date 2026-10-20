/*
  Membuat folder dist/ berisi HANYA berkas yang dibutuhkan situs publik (tanpa server/, tools/, tests/, docs, kasir.html,
  bayar-simulasi.html). Isi dist/ siap diunggah ke hosting statis gratis: GitHub Pages, Cloudflare Pages, Netlify, Vercel.
  Pakai: node tools/build-static.js
*/
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const out = path.join(root, "dist");

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const copy = (rel) => {
  const from = path.join(root, rel), to = path.join(out, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
};
["index.html", "manifest.webmanifest", "sw.js", "css", "js", "assets", "SOURCES.md", "IMAGE_SOURCES.md", "AUDIT_REPORT.md"].forEach(copy); // 3 berkas .md dirujuk halaman Info (transparansi sumber)

// Resume perbandingan (Word) agar bisa diunduh lewat tautan publik
const resume = path.join(root, "docs", "Dvin Al Ibad.docx");
if (fs.existsSync(resume)) fs.copyFileSync(resume, path.join(out, "Dvin-Al-Ibad.docx"));
fs.writeFileSync(path.join(out, ".nojekyll"), "");
fs.writeFileSync(path.join(out, "robots.txt"), "# Rancangan studi desain independen, belum untuk diindeks.\nUser-agent: *\nDisallow: /\n");
fs.writeFileSync(path.join(out, "404.html"), '<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Halaman tidak ditemukan</title><meta http-equiv="refresh" content="0; url=./?langsung"><p>Halaman tidak ditemukan. <a href="./?langsung">Kembali ke beranda</a>.</p></html>\n');
// Netlify dan Cloudflare Pages membaca _headers; GitHub Pages mengabaikannya (tidak berbahaya).
fs.writeFileSync(path.join(out, "_headers"), [
  "/*",
  "  X-Content-Type-Options: nosniff",
  "  Referrer-Policy: strict-origin-when-cross-origin",
  "  Permissions-Policy: camera=(), microphone=(), geolocation=()",
  "  X-Robots-Tag: noindex, nofollow",
  "",
  "/sw.js",
  "  Cache-Control: no-cache",
  "",
  "/index.html",
  "  Cache-Control: no-cache",
  "",
  "/assets/*",
  "  Cache-Control: public, max-age=86400",
  ""
].join("\n"));

// Periksa bahwa semua berkas lokal yang dirujuk index.html ada di dist/.
const html = fs.readFileSync(path.join(out, "index.html"), "utf8");
const refs = new Set();
for (const m of html.matchAll(/(?<![-\w])(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g)) {
  const u = m[1];
  if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(u)) continue;
  refs.add(u);
}
const hilang = [...refs].filter((r) => !fs.existsSync(path.join(out, r)));
let size = 0, files = 0;
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else { size += fs.statSync(p).size; files++; } } })(out);
console.log(`dist/: ${files} berkas, ${(size / 1048576).toFixed(1)} MB; rujukan lokal di index.html: ${refs.size}, hilang: ${hilang.length}`);
if (hilang.length) { console.error("HILANG: " + hilang.join(", ")); process.exit(1); }
