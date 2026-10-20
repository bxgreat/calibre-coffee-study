/*
  Data usaha Calibre Coffee Roasters (v2).
  Satu-satunya tempat untuk mengubah alamat, jam, kontak, galeri, fasilitas, FAQ, dan daftar sumber.
  Menu ada di js/menu-data.js. Tanggal pemeriksaan: 19 Oktober 2026.
*/
window.CALIBRE = {
  // Pengaturan proyek (semua opsional, default mati)
  tema: null,                       // null | "ramadan" | "natal" | "kemerdekaan": menampilkan pita ucapan di atas halaman
  temaTeks: { ramadan: "Ramadan Kareem. Cek Instagram Calibre untuk jam dan menu bulan ini.", natal: "Selamat Natal dan Tahun Baru dari rancangan studi ini.", kemerdekaan: "Dirgahayu Republik Indonesia." },
  video: null,                      // contoh: { src: "assets/video/suasana.mp4", poster: "assets/img/gmaps-interior-2019-800.webp", kredit: "Video: Calibre" } (wajib izin Calibre)
  analitik: { penyedia: null, kode: "" }, // "goatcounter" atau "plausible" + kode situs. Menghormati Do Not Track. Default: tidak ada permintaan jaringan.
  pembayaran: { penyedia: null, endpoint: "", terkonfirmasi: [], clientKey: "", produksi: false }, // endpoint: "https://<domain-backend>/api/charge" setelah server/ dipasang (PEMBAYARAN.md); terkonfirmasi: id metode yang sudah dipastikan kedai, mis. ["tunai","qris"]
  opsi: { es: ["Less ice", "Normal ice"], ekstra: [ // harga tambahan CONTOH; ganti dengan harga kedai
    { id: "shot", label: "Extra shot", rp: 8000, untuk: ["espresso"] },
    { id: "oat", label: "Oat milk", rp: 8000, untuk: ["espresso", "noncoffee"] } ] },
  suasana: { status: "tenang", catatan: "banyak meja kosong", contoh: true }, // tenang | sedang | ramai; null = sembunyikan. Kedai mengubahnya lewat baris id "suasana" di Sheets
  voucher: [ // CONTOH untuk studi desain; ganti dengan voucher kedai lalu jalankan node tools/sync-menu.js
    { kode: "KOPIBARU", jenis: "persen", nilai: 10, min: 50000, maks: 20000, sampai: "2026-12-31", contoh: true },
    { kode: "NGOPIHEMAT", jenis: "nominal", nilai: 10000, min: 75000, sampai: "2026-12-31", contoh: true } ],
  backend: { endpoint: "" },        // alamat backend tanpa garis miring akhir, mis. "https://calibre-api.vercel.app" (lihat PEMBAYARAN.md)
  sheet: { csvUrl: "", cacheMenit: 10 },     // tempel tautan CSV Google Sheets (lihat ADMIN_MENU.md)
  kontakProyek: null,              // kontak pembuat proyek untuk permintaan koreksi atau penghapusan konten; isi sebelum dibagikan

  nama: "Calibre Coffee Roasters",
  kategori: "Kedai kopi",
  berdiri: "2015", // tulisan "Estd 2015" pada dinding kedai (foto profil Google Maps, Des 2019)

  alamat: {
    jalan: "Jl. Walikota Mustajab No. 67–69",
    kelurahan: "Ketabang",
    kecamatan: "Kec. Genteng",
    kota: "Surabaya",
    provinsi: "Jawa Timur",
    kodePos: "60272",
    satuBaris: "Jl. Walikota Mustajab No. 67–69, Ketabang, Kec. Genteng, Surabaya, Jawa Timur 60272",
    singkat: "Jl. Walikota Mustajab No. 67–69, Ketabang",
    plusCode: "PPQX+GG Ketabang, Surabaya"
  },

  koordinat: { lat: -7.2612075, lng: 112.7488144 },

  kontak: {
    teleponTampil: "0812-2941-8452",
    teleponTel: "tel:+6281229418452",
    // Tautan "Reservasi" pada profil Google Maps dan bio Instagram mengarah ke nomor ini.
    whatsapp: "https://wa.me/6281229418452",
    whatsappNomor: "6281229418452",
    teleponKantorTampil: "(031) 545-4801", // tercantum di bio Instagram
    teleponKantorTel: "tel:+62315454801",
    instagramHandle: "@calibrecoffeeroasters",
    instagram: "https://www.instagram.com/calibrecoffeeroasters/"
  },

  maps: {
    profil: "https://www.google.com/maps/place/Calibre+Coffee+Roasters/@-7.2612022,112.7462395,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd7f96484aa2e85:0x9a8add2fb2242a50!8m2!3d-7.2612075!4d112.7488144!16s%2Fg%2F11bvvzglbt",
    rute: "https://www.google.com/maps/dir/?api=1&destination=-7.2612075,112.7488144",
    embed: "https://maps.google.com/maps?q=-7.2612075,112.7488144&z=17&hl=id&output=embed"
  },

  // Urutan mengikuti Date.getDay(): 0 = Minggu. Jam dalam WIB (Asia/Jakarta), format HH:MM.
  jadwal: [
    { hari: "Minggu", buka: "10:00", tutup: "22:00" },
    { hari: "Senin", buka: "10:00", tutup: "22:00" },
    { hari: "Selasa", buka: "10:00", tutup: "22:00" },
    { hari: "Rabu", buka: "10:00", tutup: "22:00" },
    { hari: "Kamis", buka: "10:00", tutup: "22:00" },
    { hari: "Jumat", buka: "10:00", tutup: "22:00" },
    { hari: "Sabtu", buka: "10:00", tutup: "23:00" }
  ],
  jadwalRingkas: "Minggu–Jumat 10.00–22.00 WIB, Sabtu 10.00–23.00 WIB",

  // Rating hanya ditampilkan bersama sumber dan tanggal pemeriksaan. Bukan data langsung.
  rating: { nilai: "4,5", jumlahUlasan: "2.198", sumber: "Google Maps", diperiksa: "19 Oktober 2026" },

  // Setiap butir wajib menyebut siapa yang menyatakannya.
  fasilitas: [
    { teks: "Ruang ber-AC dengan cahaya alami dari atap dan dinding kaca.", sumber: "Artikel GoPay, Nov 2025; foto 2019", jenis: "media" },
    { teks: "Tempat duduk di dalam ruangan dan di teras depan yang menghadap jalan. Pengunjung menyebut area luar cukup bising karena dekat jalan raya.", sumber: "Foto 2019; Wanderlog", jenis: "agregator" },
    { teks: "Wi-Fi dan colokan listrik disebut dua pengulas Google Maps (sekitar 11 bulan sebelum pemeriksaan). RestaurantGuru dan Wanderlog juga menyebutnya.", sumber: "Ulasan Google Maps; RestaurantGuru; Wanderlog", jenis: "ulasan" },
    { teks: "Parkir disebut terbatas oleh pengulas Google Maps (sekitar 6 bulan sebelum pemeriksaan). RestaurantGuru mencantumkan parkir sebagai fitur.", sumber: "Ulasan Google Maps; RestaurantGuru", jenis: "ulasan" },
    { teks: "Reservasi lewat WhatsApp: profil Google Maps memiliki tautan Reservasi ke nomor yang sama dengan telepon kedai.", sumber: "Profil Google Maps (pemilik usaha)", jenis: "pemilik" },
    { teks: "RestaurantGuru mencantumkan take away, pembayaran kartu kredit, dan label halal. Ini data agregator dan belum dikonfirmasi pemilik.", sumber: "RestaurantGuru, diperbarui 14 Okt 2026", jenis: "agregator" },
    { teks: "Profil Google Maps menyatakan tidak ada pintu masuk dan tempat parkir khusus pengguna kursi roda.", sumber: "Profil Google Maps, diperiksa 19 Okt 2026", jenis: "pemilik" },
    { teks: "Topik \"smoking room\" muncul di 14 ulasan Google Maps. Detail ruangnya belum dikonfirmasi.", sumber: "Topik ulasan Google Maps", jenis: "ulasan" }
  ],

  faq: [
    {
      tanya: "Di mana lokasi Calibre?",
      jawab: (d) => `Calibre Coffee Roasters berada di ${d.alamat.satuBaris}. Kode plus: ${d.alamat.plusCode}. Tombol rute di bagian Kunjungi membuka petunjuk arah di Google Maps.`
    },
    {
      tanya: "Kapan jam bukanya?",
      jawab: (d) => `Jadwal reguler: ${d.jadwalRingkas}. Pada hari libur jam bisa berbeda, jadi periksa Instagram atau hubungi kedai sebelum datang.`
    },
    {
      tanya: "Bagaimana melihat menu dan harga terbaru?",
      jawab: (d) => `Katalog di halaman ini mencantumkan nama menu dari dokumentasi publik beserta statusnya. Harga adalah harga contoh untuk rancangan studi desain ini, bukan harga resmi. Untuk daftar dan harga resmi, lihat unggahan Instagram ${d.kontak.instagramHandle}, hubungi kedai lewat WhatsApp di ${d.kontak.teleponTampil}, atau datang langsung.`
    },
    {
      tanya: "Bagaimana cara memesan lewat website ini?",
      jawab: () => "Pilih menu, tekan \"Tambah ke pesanan\", lalu buka daftar pesanan, pilih cara menikmati dan pilihan pembayaran, dan tekan \"Pesan via WhatsApp\". Pesan berisi daftar pilihan Anda terbuka di WhatsApp ke nomor Calibre. Website ini tidak memproses pembayaran. Total di situs hanya perkiraan; stok, harga resmi, dan metode bayar yang tersedia (QRIS, transfer, e-wallet, kartu) dikonfirmasi langsung oleh kedai."
    },
    {
      tanya: "Apa arti label \"Terkini\", \"Historis\", dan \"Belum pasti\" pada menu?",
      jawab: () => "Terkini berarti nama menu disebut sumber bertanggal Oktober 2025 sampai Oktober 2026. Historis berarti hanya terbaca pada dokumentasi lama (Maret 2019). Belum pasti berarti hanya disebut agregator tanpa tanggal per item. Tidak ada label yang berarti kedai menjamin menu itu tersedia hari ini."
    },
    {
      tanya: "Bagaimana menghubungi kedai?",
      jawab: (d) => `Telepon atau WhatsApp ${d.kontak.teleponTampil}. Bio Instagram juga mencantumkan nomor ${d.kontak.teleponKantorTampil}. Pesan langsung ke Instagram ${d.kontak.instagramHandle} juga tersedia.`
    }
  ],

  sumber: [
    { judul: "Profil Google Maps Calibre Coffee Roasters", url: "https://www.google.com/maps/place/Calibre+Coffee+Roasters/@-7.2612022,112.7462395,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd7f96484aa2e85:0x9a8add2fb2242a50!8m2!3d-7.2612075!4d112.7488144!16s%2Fg%2F11bvvzglbt", dipakai: "Nama, kategori, alamat, telepon, tautan WhatsApp dan Instagram, jam per hari, rating, aksesibilitas, ulasan terbaru (menu, Wi-Fi, parkir), foto interior Des 2019 dan foto minuman Mei 2026.", diperiksa: "19 Okt 2026" },
    { judul: "Instagram @calibrecoffeeroasters", url: "https://www.instagram.com/calibrecoffeeroasters/", dipakai: "Jam buka di bio, nomor (031) 545-4801, nomor WhatsApp.", diperiksa: "19 Okt 2026 (hanya bio yang terbaca tanpa login)" },
    { judul: "RestaurantGuru, Calibre Coffee Roasters", url: "https://restaurantguru.com/Calibre-Coffee-Roasters-Surabaya", dipakai: "Fitur (Wi-Fi, parkir, take away, kartu, halal), menu yang sering dibahas ulasan, jam.", diperiksa: "19 Okt 2026 (halaman diperbarui 14 Okt 2026; agregator)" },
    { judul: "GoPay, \"10 Cafe di Surabaya yang Lagi Hits\"", url: "https://gopay.co.id/blog/cafe-di-surabaya", dipakai: "Calibre Latte, suasana industrial minimalis, cahaya alami, AC.", diperiksa: "19 Okt 2026 (artikel 26 Nov 2025)" },
    { judul: "Fabulous Society, kunjungan Maret 2019", url: "https://fabuloussociety.blogspot.com/2019/03/calibre-coffee-roasters-genteng-surabaya.html", dipakai: "Espresso Milo, Spaghetti Aglio Olio, Chocolate Croissant, papan menu 2019, tujuh foto ruang dan sajian.", diperiksa: "19 Okt 2026 (tulisan 30 Mar 2019)" },
    { judul: "What's New Indonesia, Surabaya's Best Coffee Shops", url: "https://www.whatsnewindonesia.com/surabaya/ultimate-guide/food-and-drink/surabayas-best-coffee-shops", dipakai: "Perancang interior Eric Wibowo, kayu daur ulang, tanaman gantung.", diperiksa: "19 Okt 2026 (artikel 25 Apr 2024)" },
    { judul: "Wanderlog, halaman tempat Calibre", url: "https://wanderlog.com/place/details/1507306/calibre-coffee-roasters", dipakai: "Rangkuman ulasan (cappuccino, kopi tubruk, green tea latte, colokan, area luar bising). Agregator tanpa tanggal.", diperiksa: "19 Okt 2026" },
    { judul: "Tripadvisor", url: "https://www.tripadvisor.com/Restaurant_Review-g297715-d8758404-Reviews-Calibre_Coffee_Roasters-Surabaya_East_Java_Java.html", dipakai: "Tidak dipakai: akses otomatis diblokir.", diperiksa: "19 Okt 2026 (gagal diakses)" },
    { judul: "Travelingyuk", url: "https://travelingyuk.com/calibre-coffee-roasters-surabaya/254259/", dipakai: "Tidak dipakai: server tidak merespons saat dua kali diperiksa.", diperiksa: "19 Okt 2026 (gagal diakses)" }
  ]
};
