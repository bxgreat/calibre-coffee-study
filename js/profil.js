/*
  Profil rasa di panel detail menu kopi: tiga bar (keasaman, body, manis) dan lencana tasting notes.
  Nilai di bawah adalah PROFIL CONTOH untuk rancangan studi desain, bukan data dari Calibre; ditandai di layar.
  Kedai dapat menimpanya lewat kolom asam, body, manis, notes di Google Sheets (lihat ADMIN_MENU.md): nilai 1 sampai 5,
  notes dipisah "|".
*/
(function () {
  "use strict";
  const { $, esc } = window.UI;
  const host = $("[data-profil]");
  if (!host) return;

  const DATA = {
    "calibre-latte": [1, 3, 3, ["Susu", "Karamel"]],
    "cappuccino": [2, 3, 2, ["Cokelat", "Busa susu"]],
    "iced-latte": [1, 3, 3, ["Susu", "Karamel"]],
    "espresso-milo": [2, 4, 4, ["Malt", "Cokelat"]],
    "tiramisu-affogato": [2, 3, 5, ["Krim", "Kakao"]],
    "espresso-creamy-avocado": [1, 4, 4, ["Alpukat", "Krim"]],
    "manual-brew-single-origin": [4, 2, 3, ["Citrus", "Floral"]],
    "black-coffee-pourover": [3, 2, 2, ["Buah", "Teh"]],
    "caffe-misto": [2, 3, 2, ["Susu", "Kacang"]],
    "aeropress": [3, 3, 3, ["Buah", "Manis"]],
    "french-press": [2, 5, 2, ["Dark choco", "Kacang"]],
    "kopi-tubruk": [1, 5, 1, ["Earthy", "Pahit"]]
  };
  const EMOJI = [[/citrus|jeruk/i, "🍊"], [/floral|bunga/i, "🌸"], [/cokelat|choco|kakao|malt/i, "🍫"], [/karamel|manis/i, "🍯"], [/susu|krim|busa/i, "🥛"], [/buah/i, "🍑"], [/kacang/i, "🥜"], [/alpukat/i, "🥑"], [/teh/i, "🍃"], [/earthy|pahit/i, "🌰"]];
  const WARNA = ["#F4E1C9", "#E6EBD2", "#F3D9D4", "#E3E8F0", "#EFE6C8"];
  const emo = (n) => { const m = EMOJI.find((e) => e[0].test(n)); return m ? m[1] + " " : ""; };

  function dots(label, n) {
    return `<div class="profil__baris"><span class="profil__l">${label}</span><span class="profil__dots" role="img" aria-label="${label} ${n} dari 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "is-on" : ""}"></i>`).join("")}</span><span class="profil__n">${["", "Rendah", "Ringan", "Sedang", "Tinggi", "Sangat tinggi"][n]}</span></div>`;
  }

  window.addEventListener("calibre:detail", (e) => {
    const it = e.detail.item;
    let p = it.profil;
    if (!p && DATA[it.id]) p = { asam: DATA[it.id][0], body: DATA[it.id][1], manis: DATA[it.id][2], notes: DATA[it.id][3], contoh: true };
    if (!p) { host.hidden = true; host.innerHTML = ""; return; }
    host.hidden = false;
    host.innerHTML = `<h4 class="custom__h">Profil rasa</h4>${dots("Keasaman", p.asam)}${dots("Body", p.body)}${dots("Manis", p.manis)}
      <p class="profil__notes">${p.notes.map((n, i) => `<span class="note" style="background:${WARNA[i % WARNA.length]}">${emo(n)}${esc(n)}</span>`).join("")}</p>
      ${p.contoh ? `<p class="catatan">Profil contoh pada rancangan studi desain, bukan data dari kedai.</p>` : ""}`;
  });
})();
