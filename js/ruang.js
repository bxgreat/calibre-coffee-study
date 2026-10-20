/*
  Jelajahi ruang (spot explorer) di halaman Kunjungi: titik interaktif di atas foto kedai, dan pill "suasana" (keramaian)
  di beranda dan halaman Kunjungi. Semua keterangan titik berasal dari sumber yang sudah tercatat di CALIBRE.fasilitas;
  yang dari ulasan diberi tanda "belum dikonfirmasi kedai". Pill suasana diatur kedai lewat baris id "suasana" di
  Google Sheets (status tenang, sedang, atau ramai); bawaan berupa contoh dan diberi tanda.
*/
(function () {
  "use strict";
  const { $, $$, esc } = window.UI;
  const D = window.CALIBRE;

  const FOTO = [
    { id: "interior", label: "Ruang utama", src8: "assets/img/gmaps-interior-2019-800.webp", w: 800, h: 1000, alt: "Ruang utama Calibre dengan atap kaca, tanaman gantung, dan meja kayu (foto 2019)", kredit: "Foto: Google Maps (2019)",
      spot: [
        { x: 50, y: 9, judul: "Atap kaca dan tanaman gantung", teks: "Ruang ber-AC dengan cahaya alami dari atap dan dinding kaca.", sumber: "Artikel GoPay, Nov 2025; foto 2019" },
        { x: 24, y: 38, judul: "Pendingin ruangan", teks: "Ruang utama memakai AC (terlihat di foto 2019; GoPay menyebut ruang ber-AC).", sumber: "Foto 2019; Artikel GoPay, Nov 2025" },
        { x: 20, y: 58, judul: "Dinding logo", teks: "Tulisan CALIBRE Coffee Roasters pada dinding beton, dengan tahun 2015 (foto 2019).", sumber: "Foto 2019" },
        { x: 44, y: 78, judul: "Meja dan bangku dinding", teks: "Meja kecil dengan kursi dan bangku panjang. Wi-Fi dan colokan disebut pengulas Google Maps; belum dikonfirmasi kedai.", sumber: "Ulasan Google Maps; RestaurantGuru; Wanderlog" }
      ] },
    { id: "atap", label: "Atap kaca", src8: "assets/img/fabsoc-atap-kaca-2019-800.webp", w: 800, h: 800, alt: "Atap kaca di atas ruang Calibre dan pintu kaca (foto 2019)", kredit: "Foto: Fabulous Society, Mar 2019",
      spot: [
        { x: 50, y: 15, judul: "Atap kaca", teks: "Atap kaca memanjang memasukkan cahaya siang ke ruang utama.", sumber: "Foto 2019; Artikel GoPay, Nov 2025" },
        { x: 8, y: 64, judul: "Dinding tanaman", teks: "Sisi ruang dihiasi tanaman hijau (foto 2019). Dekorasi dapat berubah.", sumber: "Foto 2019" },
        { x: 40, y: 69, judul: "Pintu kaca ke area lain", teks: "Di balik pintu kaca terlihat area duduk lain. Pengunjung menyebut area luar cukup bising karena dekat jalan raya.", sumber: "Foto 2019; Wanderlog (belum dikonfirmasi kedai)" }
      ] },
    { id: "fasad", label: "Teras depan", src8: "assets/img/fabsoc-fasad-2019-800.webp", w: 800, h: 800, alt: "Fasad kaca Calibre dan tanaman di teras depan (foto 2019)", kredit: "Foto: Fabulous Society, Mar 2019",
      spot: [
        { x: 82, y: 21, judul: "Papan nama", teks: "Papan CALIBRE Coffee Roasters di fasad (foto 2019).", sumber: "Foto 2019" },
        { x: 48, y: 64, judul: "Meja panjang dekat kaca", teks: "Meja panjang menghadap jendela; pengunjung duduk dengan pemandangan teras.", sumber: "Foto 2019" },
        { x: 52, y: 90, judul: "Teras depan", teks: "Tempat duduk di teras depan menghadap jalan. Pengunjung menyebut area luar cukup bising karena dekat jalan raya. Topik \"smoking room\" muncul di 14 ulasan; detailnya belum dikonfirmasi.", sumber: "Foto 2019; Wanderlog; topik ulasan Google Maps" }
      ] }
  ];

  const root = $("[data-ruang]");
  if (root) {
    const tabs = $("[data-ruang-tabs]", root), stage = $("[data-ruang-stage]", root), info = $("[data-ruang-info]", root);
    let cur = 0;
    const show = (i) => {
      cur = i;
      const f = FOTO[i];
      $$("button", tabs).forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
      stage.innerHTML = `<figure class="ruang__fig"><img src="${esc(f.src8)}" width="${f.w}" height="${f.h}" alt="${esc(f.alt)}" loading="lazy" decoding="async">
        ${f.spot.map((s, k) => `<button type="button" class="spot" style="left:${s.x}%;top:${s.y}%" data-spot="${k}" aria-label="${esc(s.judul)}" aria-expanded="false"><span class="spot__d" aria-hidden="true"></span></button>`).join("")}
        <figcaption class="kredit">${esc(f.kredit)}. Foto milik pengunggahnya.</figcaption></figure>`;
      info.textContent = "Pilih salah satu titik pada foto.";
    };
    tabs.innerHTML = FOTO.map((f, i) => `<button type="button" class="tab" data-foto="${i}" aria-pressed="false">${esc(f.label)}</button>`).join("");
    tabs.addEventListener("click", (e) => { const b = e.target.closest("[data-foto]"); if (b) show(Number(b.dataset.foto)); });
    stage.addEventListener("click", (e) => {
      const b = e.target.closest("[data-spot]"); if (!b) return;
      const s = FOTO[cur].spot[Number(b.dataset.spot)];
      $$("[data-spot]", stage).forEach((x) => x.setAttribute("aria-expanded", String(x === b)));
      info.innerHTML = `<strong>${esc(s.judul)}</strong><br>${esc(s.teks)} <small>Sumber: ${esc(s.sumber)}</small>`;
    });
    show(0);
  }

  /* ---------- Pill suasana ---------- */
  const NAMA = { tenang: "Tenang", sedang: "Cukup ramai", ramai: "Ramai" };
  function pill() {
    $$("[data-suasana]").forEach((el) => {
      const s = D.suasana;
      if (!s || !NAMA[s.status]) { el.hidden = true; return; }
      el.hidden = false;
      el.innerHTML = `<span class="suasana__p suasana__p--${esc(s.status)}"><i aria-hidden="true"></i>Suasana: ${NAMA[s.status]}${s.catatan ? ", " + esc(s.catatan) : ""}${s.contoh ? " (contoh)" : ""}</span>
        <span class="suasana__w">Kerja santai: Wi-Fi dan colokan disebut pengulas (belum dikonfirmasi kedai)</span>`;
    });
  }
  pill();
  window.addEventListener("calibre:menu", pill);
})();
