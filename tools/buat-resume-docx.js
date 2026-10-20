/*
  Membuat "Dvin Al Ibad.docx": resume perbandingan dan keunggulan website Calibre dengan website kopi lain.
  Jalankan: NODE_PATH="$(npm root -g)" node tools/buat-resume-docx.js
*/
const fs = require("fs"), path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType, HeadingLevel,
  LevelFormat, BorderStyle, Footer, PageNumber, ExternalHyperlink
} = require("docx");

const ZAITUN = "525B3E", ARANG = "292C25", KREM = "EEECE3", TANAH = "995432";
const W = 9638; // lebar isi A4 dengan margin 2 cm
const FONT = "Arial";

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 21, bold: o.bold, italics: o.italics, color: o.color });
const p = (text, o = {}) => new Paragraph({ spacing: { after: o.after ?? 120, line: 288 }, alignment: o.align, children: Array.isArray(text) ? text : [run(text, o)] });
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 140 }, children: [new TextRun({ text: t, font: FONT, size: 30, bold: true, color: ZAITUN })] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 }, children: [new TextRun({ text: t, font: FONT, size: 24, bold: true, color: ARANG })] });
const bullet = (parts) => new Paragraph({ numbering: { reference: "bul", level: 0 }, spacing: { after: 80, line: 276 }, children: Array.isArray(parts) ? parts : [run(parts)] });
const link = (text, url) => new ExternalHyperlink({ link: url, children: [new TextRun({ text, font: FONT, size: 21, color: "1F5FA5", underline: {} })] });

const border = { style: BorderStyle.SINGLE, size: 4, color: "B9B6A8" };
const borders = { top: border, bottom: border, left: border, right: border };
function cell(content, width, o = {}) {
  const kids = (Array.isArray(content) ? content : [content]).map((c) => (typeof c === "string"
    ? new Paragraph({ spacing: { after: 40, line: 264 }, children: [new TextRun({ text: c, font: FONT, size: 19, bold: o.bold, color: o.color })] })
    : c));
  return new TableCell({
    width: { size: width, type: WidthType.DXA }, borders,
    shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR, color: "auto" } : undefined,
    margins: { top: 70, bottom: 70, left: 100, right: 100 }, children: kids
  });
}
function table(widths, head, rows) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: head.map((t, i) => cell(t, widths[i], { fill: ZAITUN, bold: true, color: "FFFFFF" })) }),
      ...rows.map((r, ri) => new TableRow({ cantSplit: true, children: r.map((t, i) => cell(t, widths[i], { fill: ri % 2 ? "F6F4EC" : undefined, bold: i === 0 })) }))
    ]
  });
}

const children = [
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "RESUME PERBANDINGAN DAN KEUNGGULAN WEBSITE", font: FONT, size: 22, bold: true, color: TANAH, characterSpacing: 40 })] }),
  new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Calibre Coffee Roasters, Surabaya", font: FONT, size: 44, bold: true, color: ARANG })] }),
  new Paragraph({ spacing: { after: 40 }, children: [run("Disusun oleh: ", { color: "55584D" }), run("Dvin Al Ibad", { bold: true })] }),
  new Paragraph({ spacing: { after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ZAITUN, space: 6 } }, children: [run("Tanggal: 20 Oktober 2026  ·  Status: rancangan studi desain independen (bukan situs resmi Calibre)", { color: "55584D", size: 19 })] }),

  h1("1. Ringkasan"),
  p("Dokumen ini merangkum fitur website Calibre Coffee Roasters yang dibuat sebagai studi desain, membandingkannya dengan website kopi lain di dalam dan luar negeri, dan menyebutkan keunggulannya secara jujur, termasuk bagian yang belum siap."),
  bullet([run("Website: ", { bold: true }), link("bxgreat.github.io/calibre-coffee-study", "https://bxgreat.github.io/calibre-coffee-study/")]),
  bullet([run("Kode sumber: ", { bold: true }), link("github.com/bxgreat/calibre-coffee-study", "https://github.com/bxgreat/calibre-coffee-study")]),
  bullet([run("Inti keunggulan: ", { bold: true }), run("informasi yang jujur dan bersumber, bisa dipakai memesan hari ini lewat WhatsApp tanpa aplikasi, dikelola pemilik lewat spreadsheet, serta sudah disiapkan untuk pembayaran online dan status pesanan langsung.")]),

  h1("2. Tentang website"),
  p("Website statis (HTML, CSS, JavaScript tanpa proses build) dengan enam halaman: Beranda, Cerita, Menu, Kunjungi, Info, dan Pesan. Identitas visual memakai palet dari logo (krem, arang, zaitun, hijau lembut, tanah) dengan font Anton, DM Sans, dan Instrument Serif. Tersedia dalam Bahasa Indonesia dan Inggris, dapat dipasang seperti aplikasi (PWA), dan dihosting gratis di GitHub Pages."),
  p("Seluruh data usaha dan menu berasal dari sumber publik yang dicatat lengkap dengan tanggal. Harga, profil rasa, dan paket langganan di website adalah contoh untuk studi desain, bukan data resmi Calibre."),

  h1("3. Resume fitur"),
  table([1900, 5438, 2300], ["Area", "Fitur", "Status"], [
    ["Menu", "34 item dengan pencarian, saran cepat, filter kategori dan status, urut harga, favorit, detail, bagikan, cetak, label alergen, dan profil rasa (bar dan catatan rasa).", "Terbukti; profil rasa contoh"],
    ["Kustomisasi", "Pilih suhu, level es, extra shot, oat milk. Gelas SVG berubah sesuai pilihan dan harga bergulir di tombol tambah.", "Terbukti; harga tambahan contoh"],
    ["Bantuan memilih", "\"Tanya barista\" (3 pertanyaan, 2 rekomendasi), saran pasangan di checkout, \"Pesan lagi favoritmu\".", "Terbukti"],
    ["Pemesanan", "Keranjang, checkout 4 langkah, dine-in dengan nomor meja (?table=08) atau pick-up dengan jam, voucher, riwayat, kirim ke WhatsApp.", "Terbukti; voucher contoh"],
    ["Pembayaran dan status", "Backend pesanan, status langsung (diterima, diproses, siap, selesai), notifikasi pesanan siap, panel kasir, pembayaran online multi-metode (QRIS, Virtual Account, e-wallet, kartu) lewat Midtrans.", "Backend terbukti lokal; Midtrans asli siap, belum live"],
    ["Pengelolaan", "Google Sheets sebagai admin menu: harga, stok habis, label, tag, profil rasa, suasana kedai, menu baru. Skrip sinkron data.", "Terbukti dengan data tiruan"],
    ["Pengalaman", "Intro sinematik, tema siang dan malam otomatis, hero 3D (mati di perangkat lemah), jelajahi ruang dengan titik interaktif, navbar dengan dropdown, menu ponsel dua kolom.", "Terbukti"],
    ["Teknis dan etika", "PWA, bahasa EN/ID, aksesibilitas (axe 0 pelanggaran), keyboard dan pembaca layar, gerak dikurangi, noindex, data hanya di browser, tombol hapus data.", "Terbukti"]
  ]),

  h1("4. Pembanding"),
  p("Beranda lima situs dibuka langsung pada 20 Oktober 2026. Blue Bottle menolak akses otomatis (403), Anomali hanya mengembalikan satu kata, dan Arabica dialihkan ke domain lain, sehingga ketiganya tidak dibandingkan."),
  table([2100, 4338, 3200], ["Situs", "Yang terlihat di beranda", "Padanan di website ini"], [
    ["Onyx Coffee Lab (AS)", "Mega-menu dengan kartu promo, pencarian, login, keranjang, blok langganan, profil petani, produk unggulan dengan catatan rasa.", "Dropdown Menu dan Info, profil rasa; langganan hanya konsep; belum ada profil asal biji."],
    ["Intelligentsia (AS)", "Submenu, keranjang geser dengan saran produk, \"Welcome Back\" yang dipersonalisasi, langganan tiga langkah, pencarian dengan saran.", "Saran pasangan, \"Pesan lagi favoritmu\", saran pencarian. Belum ada keranjang geser."],
    ["Starbucks Indonesia", "Mega-menu bersarang, pencari kopi, Find A Store, sertifikat Halal dan ISO di footer.", "Dropdown bersarang, \"Tanya barista\", rute di halaman Kunjungi. Tanpa lencana sertifikasi."],
    ["Kopi Kenangan", "Submenu, ikon keranjang bertanda angka, banner promo bulanan, outlet terdekat, kanal pengaduan, umpan Instagram, navigasi ponsel berlipat.", "Keranjang bertanda angka, menu ponsel akordeon, kontak WhatsApp. Belum ada banner promo dan umpan Instagram."],
    ["Fore Coffee", "Tombol unduh aplikasi berulang, pemilih bahasa EN/SG/ID, banner promo, referral berpoin, berita.", "Tombol bahasa EN/ID, pasang PWA. Belum ada promo, berita, referral."]
  ]),
  p([run("Sumber: ", { bold: true, size: 19 }), link("onyxcoffeelab.com", "https://onyxcoffeelab.com"), run("  ·  ", { size: 19 }), link("intelligentsia.com", "https://www.intelligentsia.com"), run("  ·  ", { size: 19 }), link("starbucks.co.id", "https://www.starbucks.co.id"), run("  ·  ", { size: 19 }), link("kopikenangan.com", "https://www.kopikenangan.com"), run("  ·  ", { size: 19 }), link("fore.coffee", "https://fore.coffee")], { after: 160 }),

  h2("Perbandingan ringkas"),
  table([2300, 2300, 2500, 2538], ["Aspek", "Situs kedai umum", "Situs/aplikasi jaringan besar", "Website ini"], [
    ["Menu berupa teks, bisa dicari", "Sering PDF atau gambar", "Ya", "Ya, plus filter, favorit, cetak"],
    ["Sumber informasi ditampilkan", "Hampir tidak pernah", "Tidak", "Ya, di tiap menu dan foto"],
    ["Kustomisasi minuman", "Jarang", "Ya (aplikasi)", "Ya, di web"],
    ["Perlu unduh aplikasi dan akun", "Tidak ada fitur", "Ya", "Tidak perlu"],
    ["Pemilik ubah harga sendiri", "Perlu pengembang", "Sistem pusat", "Ya, lewat Google Sheets"],
    ["Pembayaran dalam aplikasi, poin, langganan otomatis", "Tidak ada", "Ya, matang", "Belum live (Midtrans siap, langganan konsep)"],
    ["Notifikasi saat tab ditutup", "Tidak ada", "Ya", "Belum (butuh Web Push)"],
    ["Aksesibilitas terukur", "Jarang", "Tidak ditampilkan", "axe 0 pelanggaran"],
    ["Privasi", "Beragam", "Akun dan pelacakan", "Data di browser, analitik mati"]
  ]),

  h1("5. Keunggulan"),
  new Paragraph({ numbering: { reference: "num", level: 0 }, spacing: { after: 80 }, children: [run("Transparan dan bersumber. ", { bold: true }), run("Setiap menu, fasilitas, dan foto menyebut sumber dan tanggalnya; foto referensi berlabel, harga dan profil rasa contoh ditandai. Dari lima beranda yang dibandingkan, tidak ada yang menampilkan hal serupa.")] }),
  new Paragraph({ numbering: { reference: "num", level: 0 }, spacing: { after: 80 }, children: [run("Bisa dipakai tanpa backend. ", { bold: true }), run("Pemesanan lewat WhatsApp sesuai kebiasaan kedai kecil di Indonesia, tanpa biaya gateway dan tanpa unduh aplikasi.")] }),
  new Paragraph({ numbering: { reference: "num", level: 0 }, spacing: { after: 80 }, children: [run("Dikelola pemilik sendiri. ", { bold: true }), run("Harga, stok habis, label, dan suasana kedai diubah dari spreadsheet tanpa menyentuh kode.")] }),
  new Paragraph({ numbering: { reference: "num", level: 0 }, spacing: { after: 80 }, children: [run("Pengalaman setara aplikasi. ", { bold: true }), run("Kustomisasi minuman, pesan ulang favorit, tanya barista, dan PWA tersedia di web biasa.")] }),
  new Paragraph({ numbering: { reference: "num", level: 0 }, spacing: { after: 80 }, children: [run("Inklusif dan ringan. ", { bold: true }), run("Lolos audit aksesibilitas otomatis, bisa dengan keyboard, mendukung gerak dikurangi, dan efek berat dimatikan di layar sentuh dan perangkat lemah.")] }),
  new Paragraph({ numbering: { reference: "num", level: 0 }, spacing: { after: 80 }, children: [run("Siap berkembang. ", { bold: true }), run("Panel kasir, status pesanan langsung, voucher yang dihitung server, dan pembayaran online multi-metode sudah disiapkan.")] }),
  new Paragraph({ numbering: { reference: "num", level: 0 }, spacing: { after: 120 }, children: [run("Desain berkarakter. ", { bold: true }), run("Tema siang seperti atap kaca dan malam seperti roastery, bukan templat generik.")] }),

  h1("6. Hasil pengujian"),
  bullet("Uji mandiri di browser (smoke test): 23 dari 23 pemeriksaan lulus."),
  bullet("Audit aksesibilitas axe-core 4.9.1: 0 pelanggaran di semua halaman, tema siang dan malam, Indonesia dan Inggris."),
  bullet("Backend pesanan, status, voucher, dan simulasi pembayaran: 23 pemeriksaan end-to-end lulus secara lokal."),
  bullet("Tata letak ponsel pada lebar 320 dan 375 px: tanpa scroll horizontal; menu dua kolom dan navbar dropdown diuji."),
  bullet("Dihosting dan diverifikasi di GitHub Pages: 34 menu tampil, tanpa gambar rusak dan tanpa galat konsol."),

  h1("7. Kekurangan dan rencana"),
  bullet("Keranjang geser (drawer) dan pencarian dari header, seperti Intelligentsia dan Onyx."),
  bullet("Banner promo, berita, lencana kepercayaan, umpan Instagram, dan profil asal biji. Butuh data dan izin dari Calibre."),
  bullet("Midtrans asli dan Upstash Redis belum dijalankan terhadap layanan sungguhan karena butuh akun."),
  bullet("Notifikasi saat tab ditutup (Web Push) dan langganan otomatis belum ada."),
  bullet("Pengujian baru pada Chrome; Safari, Firefox, dan perangkat nyata belum."),

  h1("8. Yang tidak boleh diklaim"),
  bullet("Website ini bukan situs resmi Calibre dan belum disetujui Calibre."),
  bullet("Harga, foto produk, dan profil rasa masih contoh atau foto referensi."),
  bullet("Pembayaran online belum live: yang teruji hanya mode simulasi."),
  bullet("Tiga foto kedai (2019) berasal dari pihak ketiga dan belum memiliki izin tertulis."),
  new Paragraph({ spacing: { before: 240 }, children: [run("Dvin Al Ibad", { bold: true }), run(" · 20 Oktober 2026", { color: "55584D" })] })
];

const doc = new Document({
  creator: "Dvin Al Ibad", title: "Resume Perbandingan dan Keunggulan Website Calibre Coffee Roasters",
  styles: { default: { document: { run: { font: FONT, size: 21 } } } },
  numbering: { config: [
    { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    { reference: "num", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 340 } } } }] }
  ] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Dvin Al Ibad  ·  Resume perbandingan website Calibre  ·  Halaman ", font: FONT, size: 16, color: "777777" }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: "777777" })] })] }) },
    children
  }]
});

const out = path.join(__dirname, "..", "docs", "Dvin Al Ibad.docx");
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(out, b); console.log("ditulis", out, b.length, "byte"); });
