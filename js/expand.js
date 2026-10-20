/*
  Scroll expansion hero (port vanilla dari komponen React "ScrollExpandMedia").
  Foto kecil di tengah membesar sampai memenuhi layar seiring scroll, judul terbelah bergeser ke kiri dan kanan,
  latar memudar, lalu keterangan muncul.

  Beda dari komponen asli (disengaja):
  - Memakai CSS position: sticky dan kemajuan dihitung dari posisi scroll. TIDAK memanggil preventDefault pada
    wheel/touch, jadi scroll tidak dikunci, keyboard dan pembaca layar tetap bekerja.
  - Dengan prefers-reduced-motion atau efek dimatikan, bagian ini statis (foto sudah penuh, tanpa pin).
*/
(function () {
  "use strict";
  const sec = document.querySelector("[data-expand]");
  if (!sec) return;
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (n, a, b) => Math.min(Math.max(n, a), b);
  let raf = 0;

  // Ponsel dan layar sentuh: tata letak statis. Animasi ini mengubah lebar dan tinggi foto besar pada setiap frame scroll
  // (memicu layout ulang), terlalu berat untuk HP dan membuat halaman patah-patah.
  const mqSmall = window.matchMedia("(max-width: 899px), (pointer: coarse)");
  const motion = () => !mqReduce.matches && !mqSmall.matches && !(window.FX && !window.FX.enabled());

  function update() {
    raf = 0;
    if (!motion()) {
      sec.classList.add("is-static");
      sec.style.setProperty("--p", "1");
      return;
    }
    sec.classList.remove("is-static");
    const r = sec.getBoundingClientRect();
    const total = sec.offsetHeight - window.innerHeight;
    const p = total > 0 ? clamp(-r.top / total, 0, 1) : 1;
    sec.style.setProperty("--p", p.toFixed(4));
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(update); }

  // Slot video opsional (CALIBRE.video). Tanpa video, foto tetap dipakai. Video hanya diputar jika gerak diizinkan.
  const D = window.CALIBRE;
  if (D && D.video && D.video.src) {
    const media = sec.querySelector(".expand__media");
    const v = document.createElement("video");
    v.className = "expand__video"; v.src = D.video.src; if (D.video.poster) v.poster = D.video.poster;
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = "none"; v.setAttribute("aria-label", "Video suasana Calibre");
    media.insertBefore(v, media.firstChild);
    const img = media.querySelector("img"); if (img) img.hidden = true;
    const cap = sec.querySelector(".expand__caption small"); if (cap && D.video.kredit) cap.textContent = D.video.kredit;
    if ("IntersectionObserver" in window) new IntersectionObserver((en) => { if (en[0].isIntersecting && motion()) v.play().catch(() => {}); else v.pause(); }).observe(sec);
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  mqReduce.addEventListener("change", update);
  mqSmall.addEventListener("change", update);
  if (window.FX) window.FX.onChange(update);
  update();
  window.Expand = { update };
})();
