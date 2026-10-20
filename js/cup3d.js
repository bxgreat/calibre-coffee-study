/*
  Adegan 3D hero: segelas es kopi susu berlapis (Three.js r128 dari cdnjs).
  - Gelas, cairan berlapis (espresso, karamel, susu), es batu, sedotan, dan sleeve bertuliskan CALIBRE
    dibuat dari geometri dasar. Ini ilustrasi 3D generik, bukan model produk Calibre yang sebenarnya.
  - Bisa diputar dengan menggeser (drag), mengikuti pointer, bereaksi pada scroll, dan bergetar saat diklik.
  - Berhenti saat hero tidak terlihat atau tab tersembunyi; satu frame statis bila efek dimatikan.
  - Jika WebGL atau Three.js tidak tersedia, kanvas disembunyikan dan ilustrasi SVG cadangan tampil.
*/
(function () {
  "use strict";
  const canvas = document.querySelector("[data-cup]");
  const fallback = document.querySelector("[data-hero-art]");
  if (!canvas) return;
  const fail = () => { canvas.hidden = true; if (fallback) fallback.hidden = false; };
  // Perangkat sederhana, mode hemat data, koneksi 2G, atau gerak dikurangi: pakai ilustrasi SVG dan jangan unduh Three.js.
  const net = navigator.connection || {};
  const hemat = net.saveData || /(^|-)2g$/.test(net.effectiveType || "") || (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hemat) { fail(); return; }
  const THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  function loadThree(cb) {
    if (window.THREE) { cb(); return; }
    const sc = document.createElement("script");
    sc.src = THREE_URL;
    sc.onload = cb;
    sc.onerror = fail;
    document.head.appendChild(sc);
  }

  function boot() {
  if (!window.THREE) { fail(); return; }
  const THREE = window.THREE;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  } catch (_) { fail(); return; }
  if (fallback) fallback.hidden = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0.2, 9.2);
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const key = new THREE.DirectionalLight(0xfff3e0, 1.0);
  key.position.set(3, 5, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xbdc89e, 0.5);
  fill.position.set(-5, 1, 3);
  scene.add(fill);

  const H = 2.2;                                  // tinggi gelas
  const rAt = (y) => 0.58 + 0.24 * (y / H);       // radius gelas melebar ke atas
  const group = new THREE.Group();
  group.position.y = -1.55;
  scene.add(group);

  const profile = (r0, y0, y1, steps) => {
    const pts = [];
    for (let i = 0; i <= steps; i++) { const y = y0 + (y1 - y0) * (i / steps); pts.push(new THREE.Vector2(rAt(y) + r0, y)); }
    return pts;
  };

  /* ---- cairan berlapis ---- */
  const YL = 1.78;
  const liquidPts = [new THREE.Vector2(0, 0.06)].concat(profile(0, 0.06, YL, 14), [new THREE.Vector2(0, YL)]);
  const liquidGeo = new THREE.LatheGeometry(liquidPts, 64);
  function paintLiquid(mode) {
    const hot = mode === "panas";
    const pos = liquidGeo.attributes.position, col = new Float32Array(pos.count * 3);
    const c1 = new THREE.Color(hot ? 0x3b2417 : 0x4a2b1b), c2 = new THREE.Color(hot ? 0x5b3a29 : 0xb07a4e), c3 = new THREE.Color(hot ? 0xe8d8b8 : 0xdcc9a8);
    const sm = (a, b, x) => { const t = Math.min(Math.max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t); };
    for (let i = 0; i < pos.count; i++) {
      const t = pos.getY(i) / YL;
      const c = hot ? c1.clone().lerp(c2, sm(0.2, 0.7, t)).lerp(c3, sm(0.86, 0.93, t)) : c1.clone().lerp(c2, sm(0.28, 0.4, t)).lerp(c3, sm(0.68, 0.78, t));
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    liquidGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }
  paintLiquid("es");
  group.add(new THREE.Mesh(liquidGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, side: THREE.DoubleSide })));

  /* ---- gelas bening ---- */
  const glassPts = [new THREE.Vector2(0, 0), new THREE.Vector2(rAt(0) + 0.045, 0)].concat(profile(0.045, 0, H, 14));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(glassPts, 64),
    new THREE.MeshStandardMaterial({ color: 0xe6f6f2, transparent: true, opacity: 0.2, roughness: 0.08, side: THREE.DoubleSide, depthWrite: false }));
  glass.renderOrder = 3;
  group.add(glass);

  /* ---- sleeve CALIBRE ---- */
  const tex = (function () {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 512;
    const g = c.getContext("2d");
    const t = new THREE.CanvasTexture(c);
    const draw = () => {
      g.fillStyle = "#525B3E"; g.fillRect(0, 0, 1024, 512);
      g.fillStyle = "#995432"; g.fillRect(0, 0, 1024, 30); g.fillRect(0, 482, 1024, 30);
      g.fillStyle = "#EEECE3"; g.textAlign = "center"; g.textBaseline = "middle";
      g.font = "158px Anton, Impact, 'Arial Narrow Bold', sans-serif"; g.fillText("CALIBRE", 512, 205);
      g.fillStyle = "#BDC89E"; g.font = "italic 70px 'Instrument Serif', Georgia, serif"; g.fillText("Coffee Roasters", 512, 345);
      t.needsUpdate = true;
    };
    draw();
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load("158px Anton"), document.fonts.load("italic 70px 'Instrument Serif'")]).then(draw).catch(() => {});
    }
    return t;
  })();
  const sleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(rAt(1.4) + 0.075, rAt(0.5) + 0.075, 0.9, 64, 1, true, -1.25, 2.5),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.65, side: THREE.DoubleSide }));
  sleeve.position.y = 0.95;
  sleeve.renderOrder = 4;
  group.add(sleeve);

  /* ---- es batu ---- */
  const iceMat = new THREE.MeshStandardMaterial({ color: 0xf2fbfa, transparent: true, opacity: 0.62, roughness: 0.15 });
  const ice = [];
  for (let i = 0; i < 5; i++) {
    const s = 0.34 + Math.random() * 0.14;
    const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), iceMat);
    const a = (i / 5) * Math.PI * 2;
    m.userData = { a, r: 0.22 + Math.random() * 0.22, y: 1.5 + Math.random() * 0.3, ph: Math.random() * 6.28, rot: [Math.random(), Math.random(), Math.random()] };
    m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    group.add(m);
    ice.push(m);
  }

  /* ---- sedotan ---- */
  const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 3.2, 14), new THREE.MeshStandardMaterial({ color: 0x995432, roughness: 0.4 }));
  straw.position.set(0.12, 1.85, 0.05);
  straw.rotation.z = -0.13;
  group.add(straw);

  /* ---- gelembung dan bintang melayang ---- */
  const tones = [0xbdc89e, 0x995432, 0xeeece3, 0x525b3e];
  const floaters = [];
  for (let i = 0; i < 9; i++) {
    const r = 0.07 + Math.random() * 0.14;
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), new THREE.MeshStandardMaterial({ color: tones[i % 4], roughness: 0.35 }));
    m.userData = { a: Math.random() * 6.28, rad: 1.5 + Math.random() * 1.1, y: 0.2 + Math.random() * 3.0, sp: 0.25 + Math.random() * 0.4, ph: Math.random() * 6.28 };
    group.add(m); floaters.push(m);
  }
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.12 + Math.random() * 0.1), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x995432 : 0xbdc89e, roughness: 0.3, flatShading: true }));
    m.userData = { a: Math.random() * 6.28, rad: 1.6 + Math.random() * 1.0, y: 0.4 + Math.random() * 2.8, sp: -0.2 - Math.random() * 0.3, ph: Math.random() * 6.28, star: true };
    group.add(m); floaters.push(m);
  }

  /* ---- ukuran ---- */
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderOnce();
  }

  /* ---- interaksi ---- */
  let rotY = 0.6, vel = 0, dragging = false, lastX = 0, kick = 0;
  canvas.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; kick = 1; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} });
  canvas.addEventListener("pointermove", (e) => { if (!dragging) return; vel = (e.clientX - lastX) * 0.012; rotY += vel; lastX = e.clientX; });
  const endDrag = () => { dragging = false; };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  /* ---- loop ---- */
  const clock = new THREE.Clock();
  let raf = 0, running = false, visible = true;
  const FX = () => window.FX;
  const motionOn = () => !FX() || FX().enabled();

  function pose(t, p, sc) {
    if (!dragging) { vel *= 0.94; rotY += vel + 0.006; }
    group.rotation.y = rotY + sc * 0.0016;
    group.rotation.x += ((-p.y * 0.14) - group.rotation.x) * 0.06;
    group.rotation.z += ((p.x * 0.08) - group.rotation.z) * 0.06;
    group.position.y = -1.55 + Math.sin(t * 1.2) * 0.07;
    kick *= 0.93;
    ice.forEach((m) => {
      const u = m.userData;
      m.position.set(Math.cos(u.a + t * 0.25) * u.r, u.y + Math.sin(t * 1.4 + u.ph) * (0.03 + kick * 0.12), Math.sin(u.a + t * 0.25) * u.r);
      m.rotation.x += 0.004 + kick * 0.05 * u.rot[0]; m.rotation.y += 0.005 + kick * 0.05 * u.rot[1];
    });
    steam.forEach((sp) => {
      if (!sp.visible) return;
      const u = sp.userData, k = (t * 0.25 + u.ph) % 1;
      sp.position.set(u.x + Math.sin(t + u.ph * 6) * 0.12, H + 0.15 + k * 1.6, 0);
      sp.scale.setScalar(0.5 + k * 0.9);
      sp.material.opacity = Math.sin(k * Math.PI) * 0.55;
    });
    floaters.forEach((m) => {
      const u = m.userData;
      const a = u.a + t * u.sp;
      m.position.set(Math.cos(a) * u.rad, u.y + Math.sin(t * 0.9 + u.ph) * 0.18, Math.sin(a) * u.rad * 0.7);
      if (u.star) { m.rotation.x += 0.02; m.rotation.y += 0.025; }
    });
  }
  function frame() {
    pose(clock.getElapsedTime(), (FX() && FX().pointer) || { x: 0, y: 0 }, window.scrollY || 0);
    renderer.render(scene, camera);
    raf = running ? requestAnimationFrame(frame) : 0;
  }
  function renderOnce() {
    pose(1.2, { x: 0, y: 0 }, 0);
    renderer.render(scene, camera);
  }
  function start() { if (running || !motionOn() || !visible || document.hidden) return; running = true; clock.start(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
  function sync() { if (motionOn() && visible && !document.hidden) start(); else { stop(); renderOnce(); } }

  /* ---- mode Es / Panas ---- */
  const steam = [];
  (function () {
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 2, 32, 32, 30);
    gr.addColorStop(0, "rgba(255,255,255,0.9)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    for (let i = 0; i < 6; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, opacity: 0, depthWrite: false }));
      sp.userData = { ph: i / 6, x: (Math.random() - 0.5) * 0.5 };
      sp.visible = false; group.add(sp); steam.push(sp);
    }
  })();
  function setMode(m) {
    const hot = m === "panas";
    paintLiquid(m);
    ice.forEach((x) => { x.visible = !hot; });
    straw.visible = !hot;
    steam.forEach((x) => { x.visible = hot; });
    Array.from(document.querySelectorAll("[data-cup-mode]")).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cupMode === m)));
    if (!running) renderOnce();
  }
  Array.from(document.querySelectorAll("[data-cup-mode]")).forEach((b) => b.addEventListener("click", () => { setMode(b.dataset.cupMode); kick = 1; }));

  resize();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
  document.addEventListener("visibilitychange", sync);
  const hero = document.querySelector("[data-hero]");
  if (hero && "IntersectionObserver" in window) new IntersectionObserver((en) => { visible = en[0].isIntersecting; sync(); }).observe(hero);
  if (FX()) FX().onChange(sync);
  sync();
  }

  // Three.js (sekitar 600 KB) baru diunduh saat hero benar-benar terlihat
  const heroEl = document.querySelector("[data-hero]");
  let started = false;
  const go = () => { if (started) return; started = true; loadThree(boot); };
  const heroTampil = () => { if (!heroEl || heroEl.closest("[hidden]")) return false; const r = heroEl.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; };
  if (heroEl && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { io.disconnect(); go(); } });
    io.observe(heroEl);
    // cadangan bila IntersectionObserver tidak terkirim (mis. halaman tersembunyi) atau pindah ke Beranda
    setTimeout(() => { if (!started && heroTampil()) go(); }, 1200);
    window.addEventListener("routechange", (e) => { if (e.detail.route === "beranda") setTimeout(() => { if (!started && heroTampil()) go(); }, 200); });
  } else go();
})();
