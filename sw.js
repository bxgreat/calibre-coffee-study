/* Service worker: network-first untuk berkas situs sendiri, cadangan dari cache saat offline. Naikkan VERSI untuk membersihkan cache lama. */
const VERSI = "calibre-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open(VERSI).then((c) => c.addAll(["./", "index.html"]).catch(() => {}))); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSI).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(
    fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(VERSI).then((c) => c.put(r, cp)); } return res; })
      .catch(() => caches.match(r).then((m) => m || caches.match("index.html")))
  );
});
