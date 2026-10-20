/*
  Penyimpanan pesanan untuk backend. Produksi: Upstash Redis lewat REST (UPSTASH_REDIS_REST_URL dan
  UPSTASH_REDIS_REST_TOKEN). Tanpa kedua variabel itu dipakai memori proses (hanya untuk uji lokal; hilang saat
  server mati dan tidak dibagi antar instance serverless).
*/
const URL_ = process.env.UPSTASH_REDIS_REST_URL, TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const mem = global.__calibreMem || (global.__calibreMem = { kv: new Map(), list: [] });

async function cmd(args) {
  const r = await fetch(URL_, { method: "POST", headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" }, body: JSON.stringify(args) });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || "Penyimpanan gagal");
  return j.result;
}

const TTL = 60 * 60 * 24 * 3; // pesanan disimpan 3 hari

module.exports = {
  mode: URL_ && TOKEN ? "redis" : "memori",
  async put(kode, obj) {
    if (URL_ && TOKEN) { await cmd(["SET", "pesanan:" + kode, JSON.stringify(obj), "EX", String(TTL)]); return; }
    mem.kv.set(kode, obj);
  },
  async get(kode) {
    if (URL_ && TOKEN) { const v = await cmd(["GET", "pesanan:" + kode]); return v ? JSON.parse(v) : null; }
    return mem.kv.get(kode) || null;
  },
  async addToList(kode) {
    if (URL_ && TOKEN) { await cmd(["LPUSH", "daftar", kode]); await cmd(["LTRIM", "daftar", "0", "99"]); return; }
    mem.list.unshift(kode); mem.list = mem.list.slice(0, 100);
  },
  async recent(n) {
    const kodes = URL_ && TOKEN ? await cmd(["LRANGE", "daftar", "0", String((n || 50) - 1)]) : mem.list.slice(0, n || 50);
    const out = [];
    for (const k of kodes) { const o = await this.get(k); if (o) out.push(o); }
    return out;
  }
};
