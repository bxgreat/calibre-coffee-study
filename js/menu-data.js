/*
  Data katalog menu Calibre Coffee Roasters, v2.
  Diperiksa: 19 Oktober 2026. Rincian sumber ada di SOURCES.md.

  Cara membaca status:
  - "terkini"   : nama menu disebut sumber bertanggal Okt 2025 sampai Okt 2026 (ulasan Google Maps, GoPay, RestaurantGuru).
                  Ini BUKAN daftar menu resmi dan tidak menjamin ketersediaan hari ini.
  - "historis"  : hanya terbaca pada dokumentasi lama (papan menu dan catatan kunjungan Maret 2019).
  - "belum"     : hanya disebut agregator atau ringkasan tanpa tanggal per item.

  Aturan isi:
  - harga: null. Satu-satunya harga yang pernah terbaca ada di papan menu 2019 dan sengaja tidak dipakai.
  - varian: hanya jika sumber menyebutnya.
  - foto: hanya jika foto benar-benar menampilkan produk tersebut. Jika tidak, null (tampil placeholder berlabel).
  - deskripsi: hanya memuat apa yang dikatakan sumber, bukan klaim rasa atau kualitas.
*/
window.CALIBRE_MENU = {
  diperiksa: "19 Oktober 2026",

  // Harga PERKIRAAN (ribu rupiah) oleh perancang situs atas permintaan pemilik proyek. BUKAN harga resmi.
  // Dasar tebakan: kisaran Rp25-50 rb per orang (GoPay Nov 2025, ulasan Google Maps), harga papan menu 2019
  // (mis. Chai Latte 32K, Tiramisu Affogato 44K, camilan 35-49K) dinaikkan sekitar 15-30 persen, dan
  // jenis hidangan (manual brew dan pasta cenderung di atas minuman susu). Tidak ada item yang diverifikasi.
  hargaPerkiraan: true,

  kategori: [
    { id: "espresso", label: "Espresso Based" },
    { id: "manual", label: "Manual Brew" },
    { id: "noncoffee", label: "Non-Coffee" },
    { id: "frappe", label: "Frappe" },
    { id: "main", label: "Makanan Utama" },
    { id: "bites", label: "Light Bites" },
    { id: "pastry", label: "Pastry & Dessert" }
  ],

  status: {
    terkini: { label: "Disebut sumber 2025–2026", singkat: "Terkini", bentuk: "penuh" },
    historis: { label: "Dokumentasi historis (2019)", singkat: "Historis", bentuk: "separuh" },
    belum: { label: "Belum dapat dikonfirmasi", singkat: "Belum pasti", bentuk: "kosong" }
  },

  // Sumber yang dipakai berulang
  src: {
    gopay: { label: "Artikel GoPay", tanggal: "26 Nov 2025", url: "https://gopay.co.id/blog/cafe-di-surabaya" },
    maps: { label: "Ulasan pengunjung di Google Maps", tanggal: "ulasan 2025–2026", url: "https://www.google.com/maps/place/Calibre+Coffee+Roasters/@-7.2612075,112.7488144,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd7f96484aa2e85:0x9a8add2fb2242a50!8m2!3d-7.2612075!4d112.7488144!16s%2Fg%2F11bvvzglbt" },
    rg: { label: "RestaurantGuru (agregator)", tanggal: "diperbarui 14 Okt 2026", url: "https://restaurantguru.com/Calibre-Coffee-Roasters-Surabaya" },
    wl: { label: "Wanderlog (agregator)", tanggal: "tanpa tanggal", url: "https://wanderlog.com/place/details/1507306/calibre-coffee-roasters" },
    fabsoc: { label: "Fabulous Society, catatan kunjungan", tanggal: "30 Mar 2019", url: "https://fabuloussociety.blogspot.com/2019/03/calibre-coffee-roasters-genteng-surabaya.html" },
    papan: { label: "Papan menu pada foto Fabulous Society", tanggal: "Mar 2019", url: "https://fabuloussociety.blogspot.com/2019/03/calibre-coffee-roasters-genteng-surabaya.html" }
  },

  items: [
    /* ---------------- Espresso Based ---------------- */
    {
      id: "calibre-latte", art: "glass:latte", harga: [35, 45], nama: "Calibre Latte", kategori: "espresso", status: "terkini",
      deskripsi: "Latte dengan nama kedai sendiri. Artikel GoPay (Nov 2025) merekomendasikannya dan menyebut kualitas kopinya konsisten. Satu ulasan lain menilainya terlalu banyak susu.",
      varian: [], foto: {"src": "assets/img/ref-calibre-latte-800.webp", "w": 800, "h": 600, "referensi": true, "alt": "Foto referensi Calibre Latte (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Kgbo, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:A_cup_of_cappuccino_at_Indooroopilly_Shopping_Centre.JPG"}, sumber: ["gopay"],
      catatan: "Ulasan di Wanderlog (tanpa tanggal) menyebut rasa kopinya kalah oleh susu; selera berbeda-beda."
    },
    {
      id: "cappuccino", art: "cup", harga: [32, 42], nama: "Cappuccino", kategori: "espresso", status: "belum",
      deskripsi: "Disebut dalam deskripsi agregator bersama latte dan kopi tubruk.",
      varian: [], foto: {"src": "assets/img/ref-cappuccino-800.webp", "w": 800, "h": 534, "referensi": true, "alt": "Foto referensi Cappuccino (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Frettie, CC BY 3.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Cappuccino_with_latte_art_on_Coffee_Right_in_Brno,_Brno-City_District.jpg"}, sumber: ["wl"]
    },
    {
      id: "iced-latte", art: "glass:latte", harga: [33, 43], nama: "Iced Latte", kategori: "espresso", status: "belum",
      deskripsi: "Dipuji dalam ringkasan ulasan RestaurantGuru bersama ice tea dan dark coffee. Belum ada ulasan bertanggal yang menyebutnya langsung.",
      varian: [], foto: {"src": "assets/img/ref-iced-latte-800.webp", "w": 800, "h": 978, "referensi": true, "alt": "Foto referensi Iced Latte (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Michael Scialdone, CC BY 2.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Iced_White_Mocha_in_a_Glass_Jug.jpg"}, sumber: ["rg"]
    },
    {
      id: "espresso-milo", art: "glass:choco", harga: [35, 45], nama: "Espresso Milo", kategori: "espresso", status: "historis",
      deskripsi: "Espresso dengan Milo, diberi taburan bubuk Milo di atasnya, menurut catatan kunjungan Maret 2019.",
      varian: [], foto: {"src": "assets/img/ref-espresso-milo-800.webp", "w": 800, "h": 602, "referensi": true, "alt": "Foto referensi Espresso Milo (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Gpkp, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Hot_chocolate_drink_(2025).jpg"}, sumber: ["fabsoc"]
    },
    {
      id: "tiramisu-affogato", art: "cup", harga: [45, 55], nama: "Tiramisu Affogato", kategori: "espresso", status: "historis",
      deskripsi: "Tertulis pada papan menu kapur di atas bar (foto Maret 2019). RestaurantGuru (Okt 2026) juga menyebut affogato dalam deskripsinya.",
      varian: [], foto: {"src": "assets/img/ref-tiramisu-affogato-800.webp", "w": 800, "h": 533, "referensi": true, "alt": "Foto referensi Tiramisu Affogato (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Ewan Munro from London, UK, CC BY-SA 2.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Vinoteca,_Smithfield,_London_(4485849609).jpg"}, sumber: ["papan", "rg"]
    },
    {
      id: "espresso-creamy-avocado", art: "glass:avo", harga: [45, 55], nama: "Espresso Creamy Avocado", kategori: "espresso", status: "historis",
      deskripsi: "Tertulis pada papan menu kapur (foto Maret 2019), tepat di bawah Creamy Avocado.",
      varian: [], foto: {"src": "assets/img/ref-espresso-creamy-avocado-800.webp", "w": 800, "h": 600, "referensi": true, "alt": "Foto referensi Espresso Creamy Avocado (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Tony Webster, CC BY 2.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Iced_Coffee_in_Glass_-_Sunshine_Coffee_-_Laramie_Cafe_(53838344552).jpg"}, sumber: ["papan"]
    },

    /* ---------------- Manual Brew ---------------- */
    {
      id: "manual-brew-single-origin", art: "dripper", harga: [40, 55], nama: "Manual Brew / Single Origin", kategori: "manual", status: "terkini",
      deskripsi: "Seduhan manual dari biji asal tunggal. Seorang pengulas Google Maps (sekitar 11 bulan sebelum pemeriksaan) menyebut Japanese manual brew dari biji Bali Kintamani; pengulas lain (3 bulan lalu) berniat mencoba manual brew dan specialty coffee.",
      varian: [], foto: {"src": "assets/img/ref-manual-brew-single-origin-800.webp", "w": 800, "h": 450, "referensi": true, "alt": "Foto referensi Manual Brew / Single Origin (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Indigo.udm, CC BY 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Tasty_Coffee_pourover_V60_bloom_2025.jpg"}, sumber: ["maps"],
      catatan: "Topik \"kopi asal tunggal\" muncul di 7 ulasan Google Maps. Pilihan biji yang tersedia saat ini perlu ditanyakan ke kedai."
    },
    {
      id: "black-coffee-pourover", art: "dripper", harga: [30, 45], nama: "Black Coffee (Pour Over)", kategori: "manual", status: "historis",
      deskripsi: "Kopi hitam seduh pour over. Tercetak pada papan menu bagian manual brew (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-black-coffee-pourover-800.webp", "w": 800, "h": 1422, "referensi": true, "alt": "Foto referensi Black Coffee (Pour Over) (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: User:GorillaWarfare, CC BY-SA 1.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Coffee_pour_over_using_Hario_cone.jpg"}, sumber: ["papan"]
    },
    {
      id: "caffe-misto", art: "cup", harga: [35, 45], nama: "Caffè Misto", kategori: "manual", status: "historis",
      deskripsi: "Menurut papan menu 2019: kopi pour over dengan susu panas (steam milk).",
      varian: [], foto: {"src": "assets/img/ref-caffe-misto-800.webp", "w": 800, "h": 534, "referensi": true, "alt": "Foto referensi Caffè Misto (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Frettie, CC BY 3.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Making_of_Latte_art_of_cappuccino_on_Coffee_Right_in_Brno,_Brno-City_District.jpg"}, sumber: ["papan"]
    },
    {
      id: "aeropress", art: "press", harga: [40, 55], nama: "Aeropress Coffee", kategori: "manual", status: "historis",
      deskripsi: "Kopi seduh dengan Aeropress. Tercetak pada papan menu bagian manual brew (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-aeropress-800.webp", "w": 800, "h": 1067, "referensi": true, "alt": "Foto referensi Aeropress Coffee (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Bean Poet, CC BY-SA 2.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Aeropress_coffee_maker_inverted.jpg"}, sumber: ["papan"]
    },
    {
      id: "french-press", art: "press", harga: [40, 55], nama: "French Press Coffee", kategori: "manual", status: "historis",
      deskripsi: "Kopi seduh dengan French press. Tercetak pada papan menu bagian manual brew (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-french-press-800.webp", "w": 800, "h": 612, "referensi": true, "alt": "Foto referensi French Press Coffee (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Infrogmation, CC BY-SA 2.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:French_Press_coffee_making_05.jpg"}, sumber: ["papan"]
    },
    {
      id: "kopi-tubruk", art: "cup", harga: [25, 35], nama: "Kopi Tubruk", kategori: "manual", status: "historis",
      deskripsi: "Menurut papan menu 2019: kopi gaya Indonesia tanpa disaring, dark roast. Wanderlog juga menyebut \"classic kopi tubruks\" tanpa tanggal.",
      varian: [], foto: {"src": "assets/img/ref-kopi-tubruk-800.webp", "w": 800, "h": 536, "referensi": true, "alt": "Foto referensi Kopi Tubruk (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Mo Riza from New York, USA, CC BY 2.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Kopi_Tubruk_Jakarta.jpg"}, sumber: ["papan", "wl"]
    },

    /* ---------------- Non-Coffee ---------------- */
    {
      id: "double-choco", art: "glass:choco", harga: [35, 45], nama: "Double Choco", kategori: "noncoffee", status: "terkini",
      deskripsi: "Minuman cokelat yang dipesan seorang pengulas Google Maps (sekitar 4 bulan sebelum pemeriksaan). Pengulas menulis bahwa karyawan menggantinya dengan menu pilihan lain saat ada keluhan.",
      varian: [], foto: {"src": "assets/img/ref-double-choco-800.webp", "w": 800, "h": 1333, "referensi": true, "alt": "Foto referensi Double Choco (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: MochaMilk, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Cup_of_Hot_Chocolate.jpg"}, sumber: ["maps"]
    },
    {
      id: "chai-latte", art: "cup", harga: [35, 45], nama: "Chai Latte", kategori: "noncoffee", status: "historis",
      deskripsi: "Tertulis besar pada papan menu kapur (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-chai-latte-800.webp", "w": 800, "h": 602, "referensi": true, "alt": "Foto referensi Chai Latte (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Andy Li, CC0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Chai_Latte_-_The_Flour_Pot_Bakery_2026-05-20.jpg"}, sumber: ["papan"]
    },
    {
      id: "red-velvet-latte", art: "glass:velvet", harga: [38, 48], nama: "Red Velvet Latte", kategori: "noncoffee", status: "historis",
      deskripsi: "Tertulis pada papan menu kapur (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-red-velvet-latte-800.webp", "w": 800, "h": 989, "referensi": true, "alt": "Foto referensi Red Velvet Latte (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: SilminaJ, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Red_Velvet_Latte.jpg"}, sumber: ["papan"]
    },
    {
      id: "creamy-avocado", art: "glass:avo", harga: [40, 50], nama: "Creamy Avocado", kategori: "noncoffee", status: "historis",
      deskripsi: "Minuman alpukat. Tertulis pada papan menu kapur (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-creamy-avocado-800.webp", "w": 800, "h": 1061, "referensi": true, "alt": "Foto referensi Creamy Avocado (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Jameswasswa, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Ovacado_juice_in_a_drinking_glass.jpg"}, sumber: ["papan"]
    },
    {
      id: "green-tea-latte", art: "glass:matcha", harga: [35, 45], nama: "Green Tea Latte", kategori: "noncoffee", status: "belum",
      deskripsi: "Disebut Wanderlog sebagai minuman yang dipuji pengunjung. Tanpa tanggal.",
      varian: [], foto: {"src": "assets/img/ref-green-tea-latte-800.webp", "w": 800, "h": 450, "referensi": true, "alt": "Foto referensi Green Tea Latte (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Irvan Ary Maulana, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Matcha_tea_latte_with_rosetta_latte_art.jpg"}, sumber: ["wl"]
    },
    {
      id: "teh-panas", art: "cup", harga: [25, 35], nama: "Teh Panas", kategori: "noncoffee", status: "historis",
      deskripsi: "Bagian \"Hot Tea\" pada papan menu cetak (foto Maret 2019).",
      varian: ["Earl Grey", "English Breakfast", "Jasmine"], foto: {"src": "assets/img/ref-teh-panas-800.webp", "w": 800, "h": 1421, "referensi": true, "alt": "Foto referensi Teh Panas (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Dev Jadiya, CC0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Chai_cups_(Hot_Milk_Tea)_02.jpg"}, sumber: ["papan"]
    },
    {
      id: "teh-dingin", art: "glass:tea", harga: [28, 38], nama: "Teh Dingin", kategori: "noncoffee", status: "historis",
      deskripsi: "Teh dingin pada papan menu cetak (foto Maret 2019). RestaurantGuru (Okt 2026) juga menyebut ice tea dalam ringkasan ulasan.",
      varian: ["Lemon Tea", "Passion Fruit Tea", "Lychee Passion Fruit Tea"], foto: {"src": "assets/img/ref-teh-dingin-800.webp", "w": 800, "h": 1371, "referensi": true, "alt": "Foto referensi Teh Dingin (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Renee Comet (photographer), Public domain, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:NCI_iced_tea.jpg"}, sumber: ["papan", "rg"]
    },

    /* ---------------- Frappe ---------------- */
    {
      id: "mango-peach-frappe", art: "frappe:mango", harga: [40, 50], nama: "Mango Peach Frappe", kategori: "frappe", status: "historis",
      deskripsi: "Tertulis pada papan menu kapur (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-mango-peach-frappe-800.webp", "w": 800, "h": 640, "referensi": true, "alt": "Foto referensi Mango Peach Frappe (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Vivekpat30, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Fresh-mango-smoothie_01.jpg"}, sumber: ["papan"]
    },
    {
      id: "froot-loops-blast-frappe", art: "frappe:loops", harga: [45, 55], nama: "Froot Loops Blast Frappe", kategori: "frappe", status: "historis",
      deskripsi: "Menu bergambar pada papan kapur hijau (foto Maret 2019). Kemungkinan menu musiman; belum ada sumber lain.",
      varian: [], foto: {"src": "assets/img/ref-froot-loops-blast-frappe-800.webp", "w": 800, "h": 1066, "referensi": true, "alt": "Foto referensi Froot Loops Blast Frappe (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Ewelina Podrez-Siama, CC BY 2.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Frappe_-_coffee_milkshake_with_whipped_cream_and_chocolate_(KETO,_LCHF,_Low_Carb,_Gluten_free,_FIT)_-_52774791604.jpg"}, sumber: ["papan"]
    },

    /* ---------------- Makanan Utama ---------------- */
    {
      id: "spaghetti-aglio-olio", art: "pasta", harga: [45, 60], nama: "Spaghetti Aglio Olio", kategori: "main", status: "terkini",
      deskripsi: "Pasta bawang putih dan minyak zaitun. Dipesan dalam kunjungan yang didokumentasikan Maret 2019 (catatan penulis: \"so-so\"), dan \"aglio Olio\" disebut RestaurantGuru (Okt 2026) di antara menu yang sering dibahas ulasan.",
      varian: [],
      foto: { src: "assets/img/menu-aglio-olio-2019-800.webp", w: 800, h: 574, alt: "Sepiring spaghetti aglio olio dengan irisan cabai merah dan taburan peterseli, ada sendok dan garpu di piring putih", kredit: "Potongan foto Fabulous Society, Mar 2019", catatan: "Foto dari kunjungan 2019" },
      sumber: ["fabsoc", "rg"]
    },
    {
      id: "spaghetti-pedas-cakalang", art: "pasta", harga: [50, 65], nama: "Spaghetti Pedas Cakalang", kategori: "main", status: "terkini",
      deskripsi: "Menurut seorang pengulas Google Maps (sekitar 11 bulan sebelum pemeriksaan): rasanya enak dan pedasnya pas. Nama ditulis seperti pada ulasan; nama resmi di menu belum dikonfirmasi.",
      varian: [], foto: {"src": "assets/img/ref-spaghetti-pedas-cakalang-800.webp", "w": 800, "h": 600, "referensi": true, "alt": "Foto referensi Spaghetti Pedas Cakalang (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Bairuilong, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Spaghetti_aglio_e_olio_KB.jpg"}, sumber: ["maps"]
    },
    {
      id: "cream-of-mushroom-soup", art: "soup", harga: [40, 50], nama: "Cream of Mushroom Soup", kategori: "main", status: "historis",
      deskripsi: "Sup krim jamur. Tertulis pada papan menu kapur (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-cream-of-mushroom-soup-800.webp", "w": 800, "h": 600, "referensi": true, "alt": "Foto referensi Cream of Mushroom Soup (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Ceeseven, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Bowl_of_Cream_of_Mushroom_Soup.JPG"}, sumber: ["papan"]
    },

    /* ---------------- Light Bites ---------------- */
    {
      id: "kentang-goreng", art: "fries", harga: [35, 50], nama: "Kentang Goreng", kategori: "bites", status: "terkini",
      deskripsi: "Pengulas Google Maps (sekitar 11 bulan sebelum pemeriksaan) menyukai kentangnya, dengan saus tartar yang dinilai biasa saja. Papan menu 2019 mencantumkan Parmesan Truffle Fries dan Calibre Ultimate Fries; belum dipastikan yang mana yang dimaksud ulasan.",
      varian: [], foto: {"src": "assets/img/ref-kentang-goreng-800.webp", "w": 800, "h": 618, "referensi": true, "alt": "Foto referensi Kentang Goreng (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Chris Woodrich, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Cajun_fries_from_Popeyes_Louisiana_Kitchen,_Stratford,_Ontario,_2025-08-04.jpg"}, sumber: ["maps", "papan"]
    },
    {
      id: "potato-nachos-supreme", art: "fries", harga: [45, 55], nama: "Potato Nachos Supreme", kategori: "bites", status: "historis",
      deskripsi: "Bagian \"Appetizers & Snack\" pada papan menu kapur (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-potato-nachos-supreme-800.webp", "w": 800, "h": 800, "referensi": true, "alt": "Foto referensi Potato Nachos Supreme (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Krista, CC BY 2.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Frankie_%26_Johnny%27s_debris_nachos,_New_Orleans.jpg"}, sumber: ["papan"]
    },
    {
      id: "smoke-beef-bitterballen", art: "snack", harga: [38, 48], nama: "Smoke Beef & Mozzarella Bitterballen", kategori: "bites", status: "historis",
      deskripsi: "Bagian \"Appetizers & Snack\" pada papan menu kapur (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-smoke-beef-bitterballen-800.webp", "w": 800, "h": 602, "referensi": true, "alt": "Foto referensi Smoke Beef & Mozzarella Bitterballen (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Andy Li, CC0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Bitterballen_with_Dijon_mustard_-_Taproom_%E2%80%98t_Blauwe_Theehuis_2024-11-26.jpg"}, sumber: ["papan"]
    },
    {
      id: "banana-nutella-spring-roll", art: "snack", harga: [38, 48], nama: "Banana Nutella & Cheese Spring Roll", kategori: "bites", status: "historis",
      deskripsi: "Bagian \"Appetizers & Snack\" pada papan menu kapur (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-banana-nutella-spring-roll-800.webp", "w": 800, "h": 533, "referensi": true, "alt": "Foto referensi Banana Nutella & Cheese Spring Roll (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Herbertkikoy, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Pinoy_Turon.jpg"}, sumber: ["papan"]
    },
    {
      id: "kaya-butter-toast", art: "toast", harga: [35, 45], nama: "Kaya Butter Toast", kategori: "bites", status: "historis",
      deskripsi: "Bagian \"Appetizers & Snack\" pada papan menu kapur (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-kaya-butter-toast-800.webp", "w": 800, "h": 640, "referensi": true, "alt": "Foto referensi Kaya Butter Toast (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: Bahnfrend, CC BY-SA 4.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Kaya_toast_with_butter_set,_Ya_Kun_Kaya_Toast,_KLIA1,_2025_(01).jpg"}, sumber: ["papan"]
    },
    {
      id: "shrimp-money-bag", art: "snack", harga: [39, 49], nama: "Shrimp Money Bag", kategori: "bites", status: "historis",
      deskripsi: "Bagian \"Appetizers & Snack\" pada papan menu kapur (foto Maret 2019).",
      varian: [], foto: {"src": "assets/img/ref-shrimp-money-bag-800.webp", "w": 800, "h": 600, "referensi": true, "alt": "Foto referensi Shrimp Money Bag (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: lazy fri13th, CC BY 2.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Deep-fried_wontons.jpg"}, sumber: ["papan"]
    },

    /* ---------------- Pastry & Dessert ---------------- */
    {
      id: "chocolate-croissant", art: "croissant", harga: [28, 40], nama: "Chocolate Croissant", kategori: "pastry", status: "historis",
      deskripsi: "Menurut catatan kunjungan Maret 2019: bagian atas renyah, bagian bawah lembut, isi cokelat banyak. Agregator menyebut \"nutella croissant\" dan \"hazelnut croissant\"; belum dipastikan nama menunya sama.",
      varian: [],
      foto: { src: "assets/img/menu-croissant-2019-800.webp", w: 800, h: 600, alt: "Pastry berbentuk cincin dengan isian cokelat dan taburan remah cokelat di atas piring putih", kredit: "Potongan foto Fabulous Society, Mar 2019", catatan: "Foto dari kunjungan 2019, dicocokkan dengan tulisan pada postingan yang sama" },
      sumber: ["fabsoc", "wl", "rg"]
    },
    {
      id: "waffle", art: "waffle", harga: [40, 55], nama: "Waffle", kategori: "pastry", status: "terkini",
      deskripsi: "Seorang pengulas Google Maps (sekitar 11 bulan sebelum pemeriksaan) menilai wafelnya enak (4 dari 5). Jenisnya (misalnya Belgian) tidak disebut.",
      varian: [], foto: {"src": "assets/img/ref-waffle-800.webp", "w": 800, "h": 532, "referensi": true, "alt": "Foto referensi Waffle (foto umum dari internet, bukan menu Calibre)", "kredit": "Foto referensi: TheCulinaryGeek, CC BY 2.0, Wikimedia Commons", "url": "https://commons.wikimedia.org/wiki/File:Waffles_with_maple_syrup_and_butter_on_a_white_plate.jpg"}, sumber: ["maps"]
    }
  ],

  /* Pernah disebut atau dicari, tetapi TIDAK dimasukkan ke katalog.
     Disimpan sebagai arsip penelitian supaya jelas apa yang sudah dicek. */
  arsip: [
    { nama: "V60", alasan: "Tidak ditemukan di sumber mana pun. Yang tersedia hanya \"Japanese manual brew\" dan \"manual brew\" (sudah tercakup di Manual Brew / Single Origin)." },
    { nama: "Piccolo Latte", alasan: "Tidak ditemukan di sumber yang dapat dibaca." },
    { nama: "French Vanilla", alasan: "Tidak ditemukan di sumber yang dapat dibaca." },
    { nama: "Ice Chocolate", alasan: "Tidak ditemukan dengan nama itu. Yang ada: Double Choco (ulasan 2026) dan hot chocolate dalam ulasan Tripadvisor lama." },
    { nama: "Spaghetti Primavera", alasan: "Tidak ditemukan di sumber yang dapat dibaca." },
    { nama: "Burrito", alasan: "Tidak ditemukan pada papan menu 2019 yang terbaca maupun di sumber lain." },
    { nama: "Belgian Waffle", alasan: "Hanya \"waffle\" yang disebut ulasan; kata \"Belgian\" tidak ditemukan." },
    { nama: "Salted caramel, hazelnut croissant, crepes", alasan: "Disebut sekilas oleh agregator (RestaurantGuru) tanpa tanggal per item." },
    { nama: "Mango shake, apple mojito coffee, Oreo pastry, hot chocolate", alasan: "Hanya muncul dalam ringkasan ulasan Tripadvisor lama (sekitar 2016–2018) yang tidak dapat dibuka langsung. Tidak dipakai." },
    { nama: "Sandwich, salad, cake, snack", alasan: "Disebut ringkasan ulasan Google Maps sebagai jenis hidangan, tanpa nama menu spesifik, sehingga tidak dibuat sebagai item." }
  ]
};

// Paket langganan (CONTOH konsep untuk studi desain; syarat dan harga ditentukan kedai). Ikut katalog sebagai kategori sendiri.
(function () {
  const M = window.CALIBRE_MENU;
  M.kategori.push({ id: "langganan", label: "Paket Langganan" });
  M.items.push(
    { id: "paket-ngopi-10", art: "cup", rp: 320000, harga: [320, 320], nama: "Paket Ngopi 10", kategori: "langganan", status: "belum", label: "Hemat",
      deskripsi: "Konsep: 10 voucher minuman kopi untuk ditukar di kedai dalam 30 hari. Hemat dibanding membeli satuan.", varian: [], foto: null, sumber: [], paket: true, contoh: true, resmi: true,
      catatan: "Paket ini konsep rancangan studi desain. Syarat, harga, dan masa berlaku harus dikonfirmasi dan disetujui kedai." },
    { id: "paket-kerja-20", art: "cup", rp: 600000, harga: [600, 600], nama: "Paket Kerja 20", kategori: "langganan", status: "belum", label: "Untuk WFC",
      deskripsi: "Konsep: 20 voucher minuman untuk yang rutin bekerja dari kafe, berlaku 60 hari.", varian: [], foto: null, sumber: [], paket: true, contoh: true, resmi: true,
      catatan: "Paket ini konsep rancangan studi desain. Syarat, harga, dan masa berlaku harus dikonfirmasi dan disetujui kedai." }
  );
})();

// Harga tetap: nilai tengah rentang lama dibulatkan ke Rp500. Harga CONTOH untuk rancangan studi desain (it.contoh);
// harga dari Google Sheets kedai (js/sheet.js) menggantikannya.
(function () {
  window.CALIBRE_MENU.items.forEach(function (it) {
    if (it.rp) return;
    it.rp = Math.round(((it.harga[0] + it.harga[1]) / 2) * 1000 / 500) * 500;
    it.harga = [it.rp / 1000, it.rp / 1000];
    it.resmi = true; it.contoh = true;
  });
})();
