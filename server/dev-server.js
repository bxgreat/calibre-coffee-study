/*
  Server lokal untuk menguji backend tanpa hosting: node server/dev-server.js
  Variabel: PORT (8793), ADMIN_TOKEN (wajib untuk panel kasir), ALLOWED_ORIGIN (mis. http://localhost:8791),
  MIDTRANS_SERVER_KEY (opsional, untuk /api/charge). Penyimpanan: memori kecuali UPSTASH_* diisi.
*/
const http = require("http"), path = require("path"), fs = require("fs");

// Muat server/.env (KEY=VALUE per baris) bila ada, tanpa menimpa variabel yang sudah diset di terminal.
try {
  fs.readFileSync(path.join(__dirname, ".env"), "utf8").split(/\r?\n/).forEach((l) => {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !l.trim().startsWith("#") && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  });
} catch (_) { /* tanpa .env */ }
const PORT = Number(process.env.PORT || 8793);
const routes = {};
["order", "status", "voucher", "charge", "webhook", "simulasi"].forEach((n) => { routes["/api/" + n] = require(path.join(__dirname, "api", n + ".js")); });

http.createServer((req, res) => {
  const u = new URL(req.url, "http://localhost");
  const h = routes[u.pathname];
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { res.setHeader("Content-Type", "application/json; charset=utf-8"); res.end(JSON.stringify(o)); };
  if (!h) return res.status(404).json({ error: "Tidak ada" });
  req.query = Object.fromEntries(u.searchParams);
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 1e5) req.destroy(); });
  req.on("end", async () => {
    try { req.body = body ? JSON.parse(body) : {}; } catch (_) { return res.status(400).json({ error: "JSON tidak valid" }); }
    try { await h(req, res); } catch (e) { console.error(e); if (!res.writableEnded) res.status(500).json({ error: "Galat server" }); }
  });
}).listen(PORT, "127.0.0.1", () => console.log("Backend lokal di http://127.0.0.1:" + PORT));
