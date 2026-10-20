/*
  Ilustrasi vektor orisinal untuk kartu menu (bukan foto, tidak menirukan foto Calibre).
  Dipakai sebagai pengganti foto yang belum tersedia secara sah. Setiap ilustrasi digambar generik
  (jenis minuman/hidangan), jadi tidak mengklaim tampilan menu Calibre yang sebenarnya.
  art.svg("glass:matcha", uid) -> string <svg>. Warna diatur lewat kelas f-* di CSS.
*/
(function () {
  "use strict";

  const LIQ = {
    latte: ["#5B3A29", "#B07A4E", "#F3E8D6"],
    choco: ["#3B2417", "#6B4430", "#8A5A3C"],
    matcha: ["#525B3E", "#BDC89E", "#F3E8D6"],
    avo: ["#9FB07A", "#BDC89E", "#E6EDCB"],
    tea: ["#995432", "#C98A55", "#E8C28F"],
    velvet: ["#7A2A2A", "#B24A45", "#F3D7D3"],
    mango: ["#E08A2E", "#F0B25C", "#F8DCA6"],
    loops: ["#C8452F", "#E2B65C", "#BDC89E"]
  };

  const steam = `<path class="k th steam s1" d="M46 40 q-7 -8 0 -15 q7 -7 0 -14"/><path class="k th steam s2" d="M60 38 q-7 -8 0 -15 q7 -7 0 -14"/><path class="k th steam s3" d="M74 40 q-7 -8 0 -15 q7 -7 0 -14"/>`;
  const back = `<circle cx="60" cy="62" r="52" class="f-cream"/>`;

  const ART = {
    cup: () => `${back}${steam}
      <path class="k f-sage" d="M30 54 H88 V70 Q88 98 59 98 Q30 98 30 70 Z"/>
      <path class="k" d="M88 60 Q106 60 106 74 Q106 88 85 88"/>
      <ellipse class="k f-coffee" cx="59" cy="54" rx="29" ry="7"/>
      <path class="f-milk" d="M50 54 q9 -5 18 0 q-9 4 -18 0z"/>`,

    glass: (mix, id) => {
      const [a, b, c] = LIQ[mix] || LIQ.latte;
      return `${back}
      <defs><clipPath id="${id}"><path d="M36 34 H84 L78 98 Q77 104 72 104 H48 Q43 104 42 98 Z"/></clipPath></defs>
      <g clip-path="url(#${id})"><rect x="30" y="76" width="60" height="32" fill="${a}"/><rect x="30" y="58" width="60" height="19" fill="${b}"/><rect x="30" y="44" width="60" height="15" fill="${c}"/>
        <rect class="ice i1" x="46" y="38" width="13" height="13" rx="3" fill="#EEF8F6" stroke="#292C25" stroke-width="2"/>
        <rect class="ice i2" x="62" y="44" width="13" height="13" rx="3" fill="#EEF8F6" stroke="#292C25" stroke-width="2"/></g>
      <path class="k" d="M36 34 H84 L78 98 Q77 104 72 104 H48 Q43 104 42 98 Z"/>
      <path class="k f-earth" d="M70 16 L62 70" style="stroke-width:5"/>`;
    },

    frappe: (mix, id) => {
      const [a, b, c] = LIQ[mix] || LIQ.mango;
      return `${back}
      <defs><clipPath id="${id}"><path d="M38 44 H82 L77 98 Q76 104 71 104 H49 Q44 104 43 98 Z"/></clipPath></defs>
      <g clip-path="url(#${id})"><rect x="30" y="76" width="60" height="32" fill="${a}"/><rect x="30" y="56" width="60" height="21" fill="${b}"/><rect x="30" y="40" width="60" height="17" fill="${c}"/></g>
      <path class="k" d="M38 44 H82 L77 98 Q76 104 71 104 H49 Q44 104 43 98 Z"/>
      <circle class="k f-milk" cx="48" cy="38" r="11"/><circle class="k f-milk" cx="72" cy="38" r="11"/><circle class="k f-milk" cx="60" cy="30" r="12"/>
      <circle class="bub b1" cx="52" cy="70" r="3" fill="#fff"/><circle class="bub b2" cx="66" cy="84" r="2.5" fill="#fff"/>
      <path class="k f-earth" d="M72 12 L64 64" style="stroke-width:5"/>`;
    },

    dripper: () => `${back}
      <path class="k f-cream" d="M28 32 H92 L74 62 H46 Z"/><path class="k" d="M24 32 H96"/>
      <path class="k f-sage" d="M42 66 H78 V96 Q78 104 70 104 H50 Q42 104 42 96 Z"/>
      <rect x="44" y="84" width="32" height="18" rx="4" class="f-coffee"/>
      <circle class="drop d1" cx="60" cy="68" r="3" fill="#5B3A29"/><circle class="drop d2" cx="60" cy="68" r="3" fill="#5B3A29"/>`,

    press: () => `${back}
      <rect class="k f-sage" x="38" y="42" width="44" height="60" rx="5"/>
      <rect x="41" y="68" width="38" height="31" rx="3" class="f-coffee"/>
      <path class="k" d="M60 16 V58"/><path class="k f-earth" d="M46 16 H74"/>
      <path class="k" d="M82 54 Q98 54 98 68 Q98 80 82 80"/>`,

    pasta: () => `${back}
      <ellipse class="k f-cream" cx="60" cy="84" rx="46" ry="16"/><ellipse class="k f-sage" cx="60" cy="82" rx="34" ry="11"/>
      <path class="k" d="M30 78 q14 -26 30 -20 q22 -4 30 20 M38 80 q10 -16 22 -12 q16 -2 22 12 M46 80 q6 -8 14 -6 q10 0 14 6" style="stroke:#C99A2E;stroke-width:4"/>
      <circle cx="46" cy="66" r="2.5" class="f-olive"/><circle cx="72" cy="64" r="2.5" class="f-olive"/><circle cx="62" cy="58" r="2.5" class="f-olive"/>
      <path class="k" d="M78 60 q10 -6 16 -2 q-4 8 -16 2z" style="fill:#C8452F"/>`,

    fries: () => `${back}
      <g class="k" style="fill:#E2B65C"><rect x="42" y="30" width="9" height="40" rx="2" transform="rotate(-10 46 50)"/><rect x="52" y="24" width="9" height="46" rx="2"/><rect x="63" y="28" width="9" height="42" rx="2" transform="rotate(6 67 50)"/><rect x="73" y="34" width="9" height="36" rx="2" transform="rotate(14 77 52)"/></g>
      <path class="k f-earth" d="M38 62 H82 L76 104 H44 Z"/><path class="k th" d="M44 80 H76" style="stroke:#EEECE3"/>`,

    snack: () => `${back}
      <ellipse class="k f-cream" cx="60" cy="90" rx="46" ry="13"/>
      <circle class="k" cx="42" cy="78" r="15" style="fill:#C98A55"/><circle class="k" cx="78" cy="78" r="15" style="fill:#C98A55"/><circle class="k" cx="60" cy="58" r="15" style="fill:#C98A55"/>
      <path class="k th" d="M34 74 l4 3 M74 74 l4 3 M54 54 l4 3 M44 84 l4 -3"/>`,

    toast: () => `${back}
      <path class="k" d="M34 46 Q34 30 60 30 Q86 30 86 46 V98 H34 Z" style="fill:#C98A55"/>
      <rect x="40" y="46" width="40" height="46" rx="3" class="f-milk"/>
      <rect class="k" x="50" y="58" width="22" height="12" rx="3" style="fill:#F0D27A"/><path class="k th" d="M46 80 H74"/>`,

    croissant: () => `${back}
      <path class="k" d="M18 80 Q22 44 60 42 Q98 44 102 80 Q88 64 80 68 Q70 54 60 62 Q50 54 40 68 Q32 64 18 80 Z" style="fill:#C98A55"/>
      <path class="k th" d="M40 68 Q44 52 52 46 M60 62 Q60 52 60 44 M80 68 Q76 52 68 46"/>
      <path d="M26 74 q12 -14 34 -14 q22 0 34 14" fill="none" stroke="#3B2417" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 8"/>`,

    waffle: () => `${back}
      <rect class="k" x="28" y="36" width="64" height="58" rx="8" style="fill:#D9A441"/>
      <path class="k th" d="M48 36 V94 M68 36 V94 M28 55 H92 M28 75 H92"/>
      <rect class="k" x="50" y="48" width="20" height="14" rx="3" style="fill:#F8E7A6"/>
      <path class="k f-earth" d="M30 94 q6 10 10 0 q4 12 10 0 q4 8 8 0" style="stroke-width:3"/>`,

    soup: () => `${back}${steam}
      <path class="k f-cream" d="M24 60 H96 Q96 100 60 100 Q24 100 24 60 Z"/>
      <ellipse class="k" cx="60" cy="60" rx="36" ry="8" style="fill:#D9C7A3"/>
      <circle cx="50" cy="60" r="2.5" class="f-olive"/><circle cx="68" cy="61" r="2.5" class="f-olive"/>`
  };

  let n = 0;
  function svg(spec, label) {
    const [kind, mix] = String(spec || "cup").split(":");
    const fn = ART[kind] || ART.cup;
    const id = "c" + (++n);
    const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
    return `<svg class="art art--${kind}" viewBox="0 0 120 120" ${a11y} focusable="false">${fn(mix, id)}</svg>`;
  }

  window.Art = { svg };
})();
