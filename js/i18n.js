/*
  Versi bahasa Inggris (EN). Pendekatan: kamus teks Indonesia -> Inggris yang diterapkan pada simpul teks dan atribut
  (placeholder, aria-label, alt, title) di halaman, termasuk teks yang dibuat JavaScript (diawasi MutationObserver).
  Cakupan: antarmuka (navigasi, beranda, menu, checkout, voucher, status, dialog, footer). Deskripsi menu, catatan sumber,
  jawaban FAQ, dan keterangan foto tetap Indonesia karena mengutip sumber berbahasa Indonesia; hal ini dinyatakan di footer.
  Pilihan bahasa disimpan di calibre:lang:v1; berganti bahasa memuat ulang halaman supaya semua teks kembali utuh.
  Tambah terjemahan di objek D atau aturan di R. Teks yang tidak ada di kamus dibiarkan apa adanya.
*/
(function () {
  "use strict";
  const KEY = "calibre:lang:v1";
  const get = () => { try { return localStorage.getItem(KEY) || "id"; } catch (_) { return "id"; } };
  const lang = get();

  // Tombol bahasa (selalu tersedia, juga di mode Indonesia)
  function pasangTombol() {
    document.querySelectorAll("[data-lang]").forEach((b) => {
      b.textContent = lang === "en" ? "ID" : "EN";
      b.setAttribute("aria-label", lang === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English");
      b.setAttribute("lang", lang === "en" ? "id" : "en");
      b.addEventListener("click", () => { try { localStorage.setItem(KEY, lang === "en" ? "id" : "en"); } catch (_) {} location.reload(); });
    });
  }
  pasangTombol();
  if (lang !== "en") return;
  document.documentElement.lang = "en";

  const D = {
    // Landing dan header
    "Coffee roasters · Surabaya": "Coffee roasters · Surabaya",
    "Masuk ke situs": "Enter the site", "Lihat menu": "See the menu", "Pesan sekarang": "Order now",
    "Jam buka di halaman Kunjungi": "Opening hours on the Visit page",
    "Rancangan studi desain independen, bukan situs resmi Calibre. Menu dan harga dapat berubah; konfirmasi ke kedai.": "Independent design study, not the official Calibre site. Menu and prices may change; confirm with the shop.",
    "Kopi sangrai, pasta, dan tempat singgah di Jl. Walikota Mustajab. Lihat menu, rencanakan kunjungan, atau pesan lewat WhatsApp.": "Roasted coffee, pasta, and a place to stop by on Jl. Walikota Mustajab. See the menu, plan a visit, or order via WhatsApp.",
    "Langsung ke konten": "Skip to content",
    "Rancangan studi desain, bukan situs resmi Calibre.": "Design study, not the official Calibre site.",
    "Harga contoh, sebagian foto hanya referensi.": "Sample prices; some photos are references only.",
    "Detail dan privasi": "Details and privacy", "Mengerti": "Got it",
    "Cerita": "Story", "Menu": "Menu", "Kunjungi": "Visit", "Pesan": "Order", "Info": "Info",
    "Temukan Kami": "Find us", "Pesanan": "Order", "Jelajah": "Explore", "Rute": "Route", "Hubungi": "Contact",
    "Buka 10.00–22.00 WIB (Sabtu sampai 23.00)": "Open 10:00–22:00 WIB (Saturday until 23:00)",
    // Hero
    "Nongkrong": "Hang out", "Kerja santai": "Casual work", "Meeting": "Meetings",
    "Kopi": "Good", "baik.": "coffee.", "Jeda": "A short", "sejenak.": "pause.", "Kopi baik": "Good coffee", "Jeda sejenak": "A short pause",
    "Secangkir kopi, cahaya yang hangat, dan ruang untuk menikmati hari. Selamat datang di Calibre.": "A cup of coffee, warm light, and room to enjoy the day. Welcome to Calibre.",
    "Jelajahi Menu": "Explore the Menu", "Mulai Pesan": "Start Ordering",
    "Kerja santai: Wi-Fi dan colokan disebut pengulas (belum dikonfirmasi kedai)": "Casual work: reviewers mention Wi-Fi and power outlets (not yet confirmed by the shop)",
    "Jadwal: buka 10.00 WIB. Hari libur bisa berbeda.": "Schedule: opens 10:00 WIB. Holidays may differ.", "Jadwal: buka 10.00 WIB": "Schedule: opens 10:00 WIB",
    "Geser gelasnya!": "Drag the glass!", "Es": "Iced", "Panas": "Hot", "Cek jam buka": "Check opening hours",
    "Kaca, kayu, dan secangkir kopi": "Glass, wood, and a cup of coffee", "Jelajahi": "Explore", "Mau": "Where", "mulai": "shall", "dari": "we", "mana?": "start?",
    "menu, 8 kategori, foto referensi dan harga": "menu items, 8 categories, reference photos and prices",
    "Jadwal: buka 10.00 WIB. Plus rute dan kontak.": "Schedule: opens 10:00 WIB. Plus route and contact.",
    "Checkout bertahap, pilihan bayar, struk, dan riwayat. Dikirim lewat WhatsApp.": "Step-by-step checkout, payment options, receipt, and history. Sent via WhatsApp.",
    "Fasilitas bersumber dan pertanyaan umum": "Sourced facilities and common questions",
    "Scroll untuk memperluas": "Scroll to expand",
    "Atap kaca memanjang di atas ruang utama dan memasukkan cahaya siang.": "A long glass roof over the main room lets in daylight.",
    "Kaca,": "Glass,", "kayu,": "wood,", "dan": "and", "secangkir": "a cup of", "kopi.": "coffee.",
    "tertulis di dinding kedai": "written on the shop wall", "buka tiap hari (WIB)": "open daily (WIB)", "ruang sejuk, cahaya alami": "cool room, natural light", "dekat Grand City": "near Grand City",
    "Ruang utama di bawah atap kaca": "Main room under the glass roof", "Fasad dari jalan": "Facade from the street", "Atap kaca dan dinding tanaman": "Glass roof and plant wall",
    // Menu
    "MENU": "MENU", "Explore": "Explore", "the": "the", "menu": "menu",
    "Temukan kopi dan pilihan hidangan untuk menemani waktu di Calibre.": "Find coffee and dishes to go with your time at Calibre.",
    "menu terdokumentasi dari sumber publik, diperiksa": "menu items documented from public sources, checked",
    "19 Oktober 2026": "19 October 2026", ". Ini": ". This is", "bukan daftar menu resmi": "not the official menu", ". Harga adalah": ". Prices are", "harga contoh": "sample prices",
    "untuk rancangan studi desain ini, bukan harga resmi Calibre.": "for this design study, not Calibre's official prices.",
    "Arti label status": "What the status labels mean", "Terkini": "Current", ": nama menu disebut sumber bertanggal Okt 2025 sampai Okt 2026.": ": item name appears in sources dated Oct 2025 to Oct 2026.",
    "Historis": "Historical", ": hanya terbaca pada dokumentasi lama (Maret 2019).": ": only found in older documentation (March 2019).",
    "Belum pasti": "Unconfirmed", ": hanya disebut agregator atau ringkasan tanpa tanggal per item.": ": only mentioned by aggregators or summaries without per-item dates.",
    "Gambar pada kartu adalah ilustrasi generik buatan perancang, bukan foto menu Calibre.": "Pictures on the cards are generic illustrations by the designer, not photos of Calibre's menu.",
    "Cari menu berdasarkan nama atau kategori": "Search the menu by name or category", "Cari nama atau kategori menu": "Search by item name or category",
    "Urutkan": "Sort", "Per kategori": "By category", "Abjad A ke Z": "A to Z", "Abjad Z ke A": "Z to A", "Harga termurah": "Lowest price", "Harga termahal": "Highest price",
    "Status": "Status", "Semua status": "All statuses", "Bingung pilih menu? Tanya barista": "Can't decide? Ask the barista",
    "Favorit Saya": "My Favourites", "Cetak daftar menu": "Print menu", "Semua": "All",
    "Makanan Utama": "Main Dishes", "Light Bites": "Light Bites", "Pastry & Dessert": "Pastry & Dessert", "Paket Langganan": "Subscription Packs",
    "Foto referensi": "Reference photo", "Foto Calibre 2019": "Calibre photo 2019", "Detail": "Details", "Tambah ke pesanan": "Add to order", "Pilih varian": "Choose a variant",
    "Habis": "Sold out", "Hemat": "Save", "Untuk WFC": "For WFC", "Terlaris": "Best seller", "Pilihan barista": "Barista's pick",
    "Disebut sumber 2025–2026": "Mentioned in 2025–2026 sources", "Dokumentasi historis (2019)": "Historical documentation (2019)", "Belum dapat dikonfirmasi": "Cannot be confirmed yet",
    "Sumber nama menu:": "Source of the item name:", "Sumber foto": "Photo source", "Kembali ke kartu": "Back to card",
    "Foto referensi, bukan menu Calibre.": "Reference photo, not Calibre's menu.", "Halaman sumber dan lisensi": "Source and licence page",
    "Hubungi kedai untuk harga resmi dan ketersediaan terbaru.": "Contact the shop for official prices and current availability.",
    "Arsip penelitian: pernah dicari, tidak masuk katalog": "Research archive: searched for, not in the catalogue",
    "Tidak ditemukan di sumber yang dapat dibaca.": "Not found in readable sources.",
    "Pesan lagi favoritmu": "Order your favourites again", "Pasang di layar HP": "Install on your phone",
    "Alergi atau pantangan makanan? Tanyakan ke kedai sebelum memesan.": "Allergies or dietary restrictions? Ask the shop before ordering.",
    "Profil rasa": "Flavour profile", "Keasaman": "Acidity", "Manis": "Sweetness", "Rendah": "Low", "Ringan": "Light", "Sedang": "Medium", "Tinggi": "High", "Sangat tinggi": "Very high",
    "Profil contoh pada rancangan studi desain, bukan data dari kedai.": "Sample profile for this design study, not data from the shop.",
    "Atur minuman": "Customise drink", "Tambah pesanan": "Add to order", "Pilih varian untuk pesanan": "Choose a variant",
    "Harga": "Price", "Sumber": "Source", "Diperiksa": "Checked", "Simpan ke favorit": "Save to favourites", "Hapus dari favorit": "Remove from favourites", "Bagikan menu": "Share menu",
    "Tutup": "Close", "Sumber & catatan": "Sources & notes", "Sumber & Catatan": "Sources & Notes",
    // Tanya barista
    "Hari ini butuh apa?": "What do you need today?", "⚡ Fokus kerja": "⚡ Focus work", "🌿 Santai sore": "🌿 Relaxed afternoon", "🍓 Manis dan segar": "🍓 Sweet and fresh",
    "Suka kopi atau non-kopi?": "Coffee or non-coffee?", "Kopi pahit": "Bitter coffee", "Kopi susu creamy": "Creamy milk coffee", "Non-kopi": "Non-coffee",
    "Dingin atau panas?": "Cold or hot?", "🧊 Es": "🧊 Iced", "☕ Panas": "☕ Hot",
    "Rekomendasi barista virtual": "Virtual barista recommendation", "Coba ini": "Try this", "Belum ada yang pas": "Nothing fits yet", "Atur dulu": "Customise first", "Ulangi pertanyaan": "Ask again",
    "Rekomendasi dari aturan sederhana pada katalog ini, bukan penilaian rasa dari kedai.": "Recommendations come from simple rules on this catalogue, not taste judgements from the shop.",
    // Kunjungi
    "Jalan": "Come", "ke": "here.", "sini.": "Sit", "Duduk": "a while.", "Alamat": "Address", "Kode plus": "Plus code",
    "Buka Rute di Google Maps": "Open Route in Google Maps", "Lihat Ulasan di Google Maps": "See Reviews on Google Maps", "Jam buka (WIB)": "Opening hours (WIB)",
    "Jam buka reguler per hari dalam WIB": "Regular opening hours per day in WIB", "Minggu": "Sunday", "Senin": "Monday", "Selasa": "Tuesday", "Rabu": "Wednesday", "Kamis": "Thursday", "Jumat": "Friday", "Sabtu": "Saturday", "hari ini": "today",
    "Kontak": "Contact", "Telepon / WhatsApp": "Phone / WhatsApp", "Kirim pesan WhatsApp": "Send a WhatsApp message", "Telepon kedai": "Shop phone", "(bio Instagram)": "(Instagram bio)",
    "Rating Google": "Google rating", "ulasan, diperiksa": "reviews, checked", ". Angka ini tidak diperbarui otomatis.": ". This number does not update automatically.",
    "Peta: Google Maps. Jika peta tidak tampil, gunakan tombol rute di samping.": "Map: Google Maps. If the map does not load, use the route button beside it.",
    "Jelajahi ruangnya": "Explore the space", "Ruang utama": "Main room", "Atap kaca": "Glass roof", "Teras depan": "Front terrace", "Pilih salah satu titik pada foto.": "Pick a dot on the photo.",
    "Ketuk titik pada foto. Setiap keterangan menyebut sumbernya; yang berasal dari ulasan belum dikonfirmasi kedai.": "Tap a dot on the photo. Each note names its source; anything from reviews is not yet confirmed by the shop.",
    "Suasana: Tenang, banyak meja kosong (contoh)": "Atmosphere: Quiet, plenty of free tables (sample)",
    // Info
    "Yang disebut sumber": "What the sources say", "Fasilitas": "Facilities", "catatan.": "notes.",
    "Media": "Media", "Agregator": "Aggregator", "Ulasan pengunjung": "Visitor reviews", "Pemilik usaha": "Business owner",
    "Pertanyaan umum": "Common questions", "Sebelum": "Before", "berangkat.": "you go.",
    "Di mana lokasi Calibre?": "Where is Calibre?", "Kapan jam bukanya?": "When does it open?", "Bagaimana melihat menu dan harga terbaru?": "How do I see the latest menu and prices?",
    "Bagaimana cara memesan lewat website ini?": "How do I order through this website?", "Apa arti label \"Terkini\", \"Historis\", dan \"Belum pasti\" pada menu?": "What do the labels \"Current\", \"Historical\", and \"Unconfirmed\" on the menu mean?",
    "Bagaimana menghubungi kedai?": "How do I contact the shop?",
    "Transparansi": "Transparency", "Tentang": "About", "proyek": "this", "ini.": "project.", "Apa ini": "What this is", "Website ini adalah": "This website is a",
    "tugas / studi desain independen": "student / independent design study", "Yang perlu Anda ketahui": "What you should know", "Pesanan hanya dikirim ke WhatsApp Calibre.": "Orders are only sent to Calibre's WhatsApp.",
    "Tidak ada pembayaran": "No payments", "yang diproses di sini.": "are processed here.", "Privasi dan data Anda": "Privacy and your data", "hanya di browser ini": "only in this browser",
    "Analitik": "Analytics", "tidak aktif": "off", "Hapus semua data saya di browser ini": "Delete all my data in this browser", "Koreksi atau penghapusan konten": "Content corrections or removal",
    // Checkout
    "Checkout": "Checkout", "Susun pesanan, pilih cara bayar, lalu kirim ke WhatsApp Calibre.": "Put your order together, choose how to pay, then send it to Calibre on WhatsApp.",
    "Tidak ada uang yang diproses di situs ini": "No money is processed on this site", ": kedai yang mengonfirmasi stok, harga resmi, dan metode bayar.": ": the shop confirms stock, official prices, and payment method.",
    "Keranjang": "Cart", "Data": "Details", "Pembayaran": "Payment", "Konfirmasi": "Confirm",
    "1. Keranjang": "1. Cart", "2. Data pemesan": "2. Your details", "3. Pembayaran": "3. Payment", "4. Konfirmasi": "4. Confirm",
    "Keranjang kosong.": "Your cart is empty.", "Tambahkan menu dari halaman Menu, lalu kembali ke sini.": "Add items from the Menu page, then come back here.", "Pilih menu": "Choose items",
    "Hapus": "Remove", "Punya kode voucher?": "Have a voucher code?", "Masukkan kode": "Enter code", "Pakai": "Apply", "Contoh kode untuk uji: KOPIBARU, NGOPIHEMAT.": "Sample codes for testing: KOPIBARU, NGOPIHEMAT.",
    "Teman ngopi yang pas": "A good coffee companion", "Minuman penyegar untuk makanan ini": "A refreshing drink for this dish",
    "(belum termasuk pajak atau biaya layanan bila ada)": "(excluding tax or service charge, if any)", "Total": "Total", "Subtotal": "Subtotal", "Perkiraan": "Estimate",
    "Kosongkan": "Clear", "Lanjut: data pemesan": "Next: your details", "Nama": "Name", "Nomor HP / WhatsApp": "Phone / WhatsApp number", "Cara menikmati": "How you'll enjoy it",
    "Makan di tempat": "Dine in", "(dine-in, pilih nomor meja)": "(choose a table number)", "Ambil sendiri": "Pick up", "(pick-up tanpa antre, pilih jam ambil)": "(no queue, choose a pickup time)",
    "Nomor meja": "Table number", "(opsional, jika sudah duduk)": "(optional, if you are already seated)", "Waktu": "Time", "Secepatnya": "As soon as possible", "Siapkan sekarang (±10 menit)": "Prepare now (about 10 min)",
    "Pilihan waktu mengikuti jadwal reguler (WIB). Kedai tetap mengonfirmasi.": "Time options follow the regular schedule (WIB). The shop still confirms.",
    "Catatan untuk kedai": "Note for the shop", "Misalnya: kurangi gula": "For example: less sugar", "Kembali": "Back", "Lanjut: pembayaran": "Next: payment", "Lanjut: konfirmasi": "Next: confirm",
    "Pesanan Anda": "Your order", "Harga contoh studi desain. Belum termasuk pajak atau biaya layanan bila ada. Tidak ada uang diproses di halaman ini.": "Sample prices for the design study. Excludes tax or service charge, if any. No money is processed on this page.",
    "Ubah pesanan": "Edit order", "Tidak ada uang yang dibayar di halaman ini.": "No money is paid on this page.",
    "Pilihan Anda dikirim ke kedai. Waspada penipuan: bayar hanya ke detail yang dikirim langsung oleh kedai di WhatsApp resmi (0812-2941-8452).": "Your choice is sent to the shop. Beware of scams: pay only to details sent directly by the shop on its official WhatsApp (0812-2941-8452).",
    "Pesanan dikirim ke WhatsApp kedai": "Your order goes to the shop's WhatsApp", "Kedai konfirmasi stok dan total": "The shop confirms stock and total", "Anda bayar sesuai metode yang kedai kirim": "You pay using the method the shop sends",
    "Metode pembayaran": "Payment method", "Tunai di kasir": "Cash at the counter", "Bayar saat mengambil atau setelah makan.": "Pay when you pick up or after eating.", "Belum dikonfirmasi kedai": "Not yet confirmed by the shop", "Diterima kedai": "Accepted by the shop",
    "Kartu kredit atau debit di kasir": "Credit or debit card at the counter", "RestaurantGuru menyebut kartu kredit diterima (agregator, belum dikonfirmasi pemilik).": "RestaurantGuru says credit cards are accepted (aggregator, not yet confirmed by the owner).",
    "QRIS": "QRIS", "Pindai kode QRIS di kasir. Ketersediaan dikonfirmasi kedai.": "Scan the QRIS code at the counter. Availability is confirmed by the shop.",
    "Transfer bank": "Bank transfer", "Kedai mengirim detail rekening lewat WhatsApp setelah pesanan diterima. Jangan transfer sebelum dikonfirmasi kedai.": "The shop sends account details via WhatsApp after accepting your order. Do not transfer before the shop confirms.",
    "Bank asal": "Your bank", "Pilih": "Choose", "Bank lain": "Other bank", "E-wallet": "E-wallet", "Kedai mengirim cara bayar lewat WhatsApp. Jangan bayar ke nomor yang tidak dikirim kedai.": "The shop sends payment instructions via WhatsApp. Do not pay to a number the shop did not send.", "Aplikasi": "App",
    "Pilih bank asal.": "Choose your bank.", "Pilih salah satu metode pembayaran.": "Choose a payment method.",
    "Atas nama": "Name", "Cara menikmati ": "How", "Kode pesanan": "Order code", "Bayar online": "Pay online", "Kirim ke WhatsApp": "Send to WhatsApp",
    "Tombol membuka WhatsApp dengan pesan siap kirim. Pesanan baru dianggap dikirim setelah Anda menekan kirim di WhatsApp.": "The button opens WhatsApp with a ready-to-send message. Your order counts as sent only after you press send in WhatsApp.",
    "Pesanan siap dikirim": "Order ready to send", "Selesaikan percakapan di WhatsApp. Kedai akan mengonfirmasi stok, harga resmi, dan cara bayar.": "Finish the conversation on WhatsApp. The shop will confirm stock, official prices, and how to pay.",
    "Dikirim ke WhatsApp": "Sent to WhatsApp", "Dikonfirmasi kedai": "Confirmed by the shop", "Sudah dibayar": "Paid", "Selesai": "Done",
    "Status langsung dari kedai (diperbarui tiap beberapa detik selama halaman ini terbuka).": "Live status from the shop (refreshes every few seconds while this page is open).",
    "Siap diambil": "Ready for pickup", "Diterima kedai": "Received by the shop", "Sedang dibuat": "Being made", "Beri tahu saya saat pesanan siap": "Notify me when my order is ready",
    "Kirim ulang ke WhatsApp": "Resend to WhatsApp", "Cetak ringkasan": "Print summary", "Salin pesan": "Copy message", "Pesan lagi dari awal": "Order again from scratch",
    "Riwayat": "History", "Lihat": "View", "Pesan lagi": "Order again", "Hapus riwayat": "Clear history", "Tersimpan hanya di browser ini.": "Stored only in this browser.",
    "Status dicatat sendiri oleh Anda di perangkat ini; situs tidak tersambung ke kedai.": "You record the status yourself on this device; the site is not connected to the shop.",
    "Ketabang, Surabaya · tertulis Estd 2015 di dinding": "Ketabang, Surabaya · \"Estd 2015\" written on the wall",
    "Foto pada profil Google Maps, Des 2019": "Photo from the Google Maps profile, Dec 2019", "Papan menu pada foto Fabulous Society": "Menu board in the Fabulous Society photo",
    "Ulasan pengunjung di Google Maps": "Visitor reviews on Google Maps", "Harga adalah": "Prices are", "perancang, bukan harga resmi.": "the designer's, not official prices.",
    "Status menu (Terkini, Historis, Belum pasti) menunjukkan seberapa baru sumbernya, bukan jaminan ketersediaan.": "Menu status (Current, Historical, Unconfirmed) shows how recent the source is, not a guarantee of availability.",
    "Tidak ada server, akun, atau cookie pelacak. Favorit, keranjang, riwayat pesanan, dan pengaturan efek disimpan": "No server, accounts, or tracking cookies. Favourites, cart, order history, and effect settings are stored",
    "Belum ada pesanan di perangkat ini.": "No orders on this device yet.",
    "Belum diisi. Pembuat proyek: isi CALIBRE.kontakProyek di js/data.js sebelum situs dibagikan.": "Not filled in yet. Project author: set CALIBRE.kontakProyek in js/data.js before sharing the site.",
    "Foto referensi, bukan foto menu Calibre.": "Reference photo, not a photo of Calibre's menu.",
    "Buka submenu": "Open submenu", "Semua menu": "All items", "Bingung pilih? Tanya barista": "Can't decide? Ask the barista", "Pertanyaan umum": "Common questions", "Fasilitas": "Facilities", "Transparansi": "Transparency",
    "Lewati intro": "Skip intro", "Kopi baik, jeda sejenak.": "Good coffee, a short pause.", "Pembuka Calibre Coffee Roasters": "Calibre Coffee Roasters intro", "Rancangan studi desain independen, bukan situs resmi Calibre.": "Independent design study, not the official Calibre site.",
    "Telepon": "Call", "WhatsApp": "WhatsApp",
    "Coba:": "Try:", "Reset pencarian dan filter": "Reset search and filters", "AC, Wi-Fi, parkir, dari sumber": "AC, Wi-Fi, parking, from sources", "Jam buka, cara pesan, kontak": "Opening hours, how to order, contact", "Sumber data dan privasi": "Data sources and privacy",
    // Footer
    "Efek gerak: aktif": "Motion effects: on", "Efek gerak: mati": "Motion effects: off", "Halaman Pesan": "Order page"
  };

  // Aturan untuk teks bervariabel
  const NOTE = { "Cokelat": "Chocolate", "Busa susu": "Milk foam", "Susu": "Milk", "Karamel": "Caramel", "Malt": "Malt", "Krim": "Cream", "Kakao": "Cocoa", "Alpukat": "Avocado", "Buah": "Fruit", "Teh": "Tea", "Kacang": "Nutty", "Manis": "Sweet", "Earthy": "Earthy", "Pahit": "Bitter", "Citrus": "Citrus", "Floral": "Floral", "Dark choco": "Dark choco" };
  const R = [
    [/^Menampilkan (\d+) dari (\d+) menu(.*)$/, (m) => `Showing ${m[1]} of ${m[2]} items${m[3]}`],
    [/^Hari ini (\d\d\.\d\d) WIB$/, (m) => `Today ${m[1]} WIB`],
    [/^Besok \((.+)\) (\d\d\.\d\d) WIB$/, (m) => `Tomorrow (${m[1]}) ${m[2]} WIB`],
    [/^Foto referensi: (.+)$/, (m) => `Reference photo: ${m[1]}`],
    [/^Harga (Rp [\d.]+)\. Harga contoh pada rancangan studi desain\.$/, (m) => `Price ${m[1]}. Sample price for this design study.`],
    [/^Harga (Rp [\d.]+)\. Harga dari kedai\.$/, (m) => `Price ${m[1]}. Price from the shop.`],
    [/^(Rp [\d.]+) \(harga contoh pada rancangan studi desain; konfirmasi saat memesan\)\.$/, (m) => `${m[1]} (sample price for this design study; confirm when ordering).`],
    [/^(Rp [\d.]+) \(harga dari kedai; dapat berubah; konfirmasi saat memesan\)\.$/, (m) => `${m[1]} (price from the shop; may change; confirm when ordering).`],
    [/^Foto: (.+)$/, (m) => "Photo: " + m[1].replace(/\(atap\)/, "(roof)").replace(/\(fasad di latar\)/, "(facade in background)").replace(/Des /, "Dec ")],
    [/^Sumber: (.+)$/, (m) => `Source: ${m[1]}`],
    [/^\(tanpa tanggal\)$/, () => "(undated)"], [/^\(diperbarui (.+)\)$/, (m) => `(updated ${m[1]})`], [/^\(ulasan (.+)\)$/, (m) => `(reviews ${m[1]})`],
    [/^Pertanyaan (\d) dari 3$/, (m) => `Question ${m[1]} of 3`],
    [/^Pesanan (CLB-\S+) siap diambil!$/, (m) => `Order ${m[1]} is ready for pickup!`],
    [/^(\d+)x (.+)$/, (m) => `${m[1]}× ${m[2]}`],
    [/^Voucher (\S+) dipakai: potongan (Rp [\d.]+)(.*)$/, (m) => `Voucher ${m[1]} applied: discount ${m[2]}${m[3].replace("(contoh)", "(sample)")}`],
    [/^(🍫|🥛|🍊|🌸|🍯|🍑|🥜|🥑|🍃|🌰) (.+)$/, (m) => `${m[1]} ${NOTE[m[2]] || m[2]}`],
    [/^Menurut jadwal reguler, (.+)$/, (m) => "According to the regular schedule, " + m[1].replace("sekarang tutup", "it is closed now").replace("sekarang buka", "it is open now").replace(/Buka hari ini pukul/, "Opens today at").replace("Hari libur bisa berbeda.", "Holidays may differ.").replace(/Tutup pukul/, "Closes at")],
    [/^Buka · tutup (\S+)$/, (m) => `Open · closes ${m[1]}`],
    [/^Tutup · buka (\S+)( besok)?$/, (m) => `Closed · opens ${m[1]}${m[2] ? " tomorrow" : ""}`],
    [/^Rating Google$/, () => "Google rating"],
    [/^(?:(Cerita|Menu|Kunjungi|Pesan|Info) \| )?Calibre Coffee Roasters, Surabaya(?:: .+)? \(Studi Desain\)$/, (m) => (m[1] ? ({ Cerita: "Story", Menu: "Menu", Kunjungi: "Visit", Pesan: "Order", Info: "Info" }[m[1]]) + " | " : "") + "Calibre Coffee Roasters, Surabaya (Design Study)"]
  ];

  const norm = (t) => t.replace(/\s+/g, " ").trim();
  function tr(t) {
    const k = norm(t);
    if (!k) return null;
    if (Object.prototype.hasOwnProperty.call(D, k)) return D[k];
    for (let i = 0; i < R.length; i++) { const m = k.match(R[i][0]); if (m) return R[i][1](m); }
    return null;
  }
  function textNode(n) {
    const v = n.nodeValue; const e = tr(v);
    if (e === null || e === undefined) return;
    const lead = v.match(/^\s*/)[0], trail = v.match(/\s*$/)[0];
    const nv = lead + e + trail;
    if (nv !== v) n.nodeValue = nv;
  }
  const ATTR = ["placeholder", "aria-label", "alt", "title"];
  function attrs(el) {
    for (let i = 0; i < ATTR.length; i++) {
      const v = el.getAttribute && el.getAttribute(ATTR[i]);
      if (v) { const e = tr(v); if (e && e !== v) el.setAttribute(ATTR[i], e); }
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { textNode(root); return; }
    if (root.nodeType !== 1) return;
    if (/^(SCRIPT|STYLE|NOSCRIPT)$/.test(root.tagName)) return;
    attrs(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) { if (!/^(SCRIPT|STYLE)$/.test(n.parentNode.tagName)) textNode(n); } else if (!/^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.tagName)) attrs(n);
    }
  }
  function meta() {
    const d = document.querySelector('meta[name="description"]');
    if (d) d.content = "Independent design study of Calibre Coffee Roasters, a coffee shop on Jl. Walikota Mustajab, Ketabang, Surabaya: sourced menu, opening hours, Google Maps route, and ordering via WhatsApp.";
    const t = tr(document.title); if (t && t !== document.title) document.title = t;
  }
  function catatan() {
    const f = document.querySelector(".site-footer .wrap, .site-footer");
    if (!f || f.querySelector("[data-en-note]")) return;
    const p = document.createElement("p");
    p.setAttribute("data-en-note", ""); p.className = "site-footer__disclaimer";
    p.textContent = "English covers the interface. Menu descriptions, source notes, and FAQ answers remain in Indonesian because they quote Indonesian sources.";
    f.appendChild(p);
  }

  let jadwal = 0;
  const pending = new Set();
  const obs = new MutationObserver((muts) => {
    muts.forEach((m) => {
      if (m.type === "childList") m.addedNodes.forEach((n) => pending.add(n));
      else if (m.type === "characterData") pending.add(m.target);
      else if (m.type === "attributes") pending.add(m.target);
    });
    if (!jadwal) jadwal = setTimeout(() => { jadwal = 0; obs.disconnect(); pending.forEach((n) => { if (document.contains(n)) walk(n); }); pending.clear(); meta(); mulai(); }, 30);
  });
  function mulai() { obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR }); }

  function init() { walk(document.body); meta(); catatan(); mulai(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(init, 0)); else setTimeout(init, 0);
  window.addEventListener("load", () => { walk(document.body); meta(); });
})();
