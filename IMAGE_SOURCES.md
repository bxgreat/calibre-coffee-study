# IMAGE_SOURCES.md: sumber, atribusi, dan lisensi gambar (v4)

Diperiksa: **19 Oktober 2026**.

## Jenis gambar di situs

| Jenis | Sumber | Status |
|---|---|---|
| **Foto referensi menu (30)** | **Wikimedia Commons**, foto umum dari internet | Berlisensi bebas (CC0, domain publik, CC BY, CC BY-SA). Atribusi tertera pada kartu/detail dan di bawah. **Bukan foto menu Calibre**; hanya referensi visual |
| Foto hidangan Calibre (2) | Potongan foto blog Fabulous Society, Mar 2019 (Spaghetti Aglio Olio, Chocolate Croissant) | Pihak ketiga, belum ada izin tertulis; kutipan dengan kredit |
| Foto kedai (3, halaman Cerita dan pembuka) | Profil Google Maps (Des 2019) dan Fabulous Society (Mar 2019) | Pihak ketiga, belum ada izin tertulis; kutipan dengan kredit |
| Ilustrasi vektor (tile Beranda, cadangan) | Dibuat perancang, `js/art.js` | Milik proyek |
| Gelas es kopi 3D di hero | Dibuat perancang, `js/cup3d.js` | Milik proyek |

## Tentang permintaan "ambil foto asli di internet untuk referensi"

Foto **tidak** diambil dari Pinterest atau Google Images: ketentuan situs tersebut melarang pengambilan otomatis dan hak ciptanya tidak jelas. Foto dicari lewat **API Wikimedia Commons** dengan penyaringan lisensi (hanya CC0, domain publik, CC BY, CC BY-SA), lalu dipilih secara visual per menu (tinjauan lembar kontak), diubah ukuran ke 800 px WebP, dan dicatat penulis serta halaman sumbernya.
Syarat lisensi: **CC BY / CC BY-SA mewajibkan atribusi** (sudah tampil di kartu/detail dan di tabel ini); CC BY-SA mewajibkan karya turunan dibagikan dengan lisensi yang sama (foto di sini dipotong/diubah ukurannya saja). Foto generik ini tidak boleh diklaim sebagai foto menu Calibre; setiap kartu berlabel "Foto referensi".
Cara menggantinya: taruh foto asli Calibre (dengan izin) di `assets/img/`, lalu ubah `foto` pada item di `js/menu-data.js` (hapus `referensi: true`).

## Foto referensi (Wikimedia Commons)

| Berkas | Dipakai untuk menu | Penulis | Lisensi | Halaman sumber |
|---|---|---|---|---|
| `ref-calibre-latte-800.webp` | Calibre Latte | Kgbo | CC BY-SA 4.0 | [A cup of cappuccino at Indooroopilly Shopping ](https://commons.wikimedia.org/wiki/File:A_cup_of_cappuccino_at_Indooroopilly_Shopping_Centre.JPG) |
| `ref-cappuccino-800.webp` | Cappuccino | Frettie | CC BY 3.0 | [Cappuccino with latte art on Coffee Right in B](https://commons.wikimedia.org/wiki/File:Cappuccino_with_latte_art_on_Coffee_Right_in_Brno,_Brno-City_District.jpg) |
| `ref-iced-latte-800.webp` | Iced Latte | Michael Scialdone | CC BY 2.0 | [Iced White Mocha in a Glass Jug.jpg](https://commons.wikimedia.org/wiki/File:Iced_White_Mocha_in_a_Glass_Jug.jpg) |
| `ref-espresso-milo-800.webp` | Espresso Milo | Gpkp | CC BY-SA 4.0 | [Hot chocolate drink (2025).jpg](https://commons.wikimedia.org/wiki/File:Hot_chocolate_drink_(2025).jpg) |
| `ref-tiramisu-affogato-800.webp` | Tiramisu Affogato | Ewan Munro from London, UK | CC BY-SA 2.0 | [Vinoteca, Smithfield, London (4485849609).jpg](https://commons.wikimedia.org/wiki/File:Vinoteca,_Smithfield,_London_(4485849609).jpg) |
| `ref-espresso-creamy-avocado-800.webp` | Espresso Creamy Avocado | Tony Webster | CC BY 2.0 | [Iced Coffee in Glass - Sunshine Coffee - Laram](https://commons.wikimedia.org/wiki/File:Iced_Coffee_in_Glass_-_Sunshine_Coffee_-_Laramie_Cafe_(53838344552).jpg) |
| `ref-manual-brew-single-origin-800.webp` | Manual Brew / Single Origin | Indigo.udm | CC BY 4.0 | [Tasty Coffee pourover V60 bloom 2025.jpg](https://commons.wikimedia.org/wiki/File:Tasty_Coffee_pourover_V60_bloom_2025.jpg) |
| `ref-black-coffee-pourover-800.webp` | Black Coffee (Pour Over) | User:GorillaWarfare | CC BY-SA 1.0 | [Coffee pour over using Hario cone.jpg](https://commons.wikimedia.org/wiki/File:Coffee_pour_over_using_Hario_cone.jpg) |
| `ref-caffe-misto-800.webp` | Caffè Misto | Frettie | CC BY 3.0 | [Making of Latte art of cappuccino on Coffee Ri](https://commons.wikimedia.org/wiki/File:Making_of_Latte_art_of_cappuccino_on_Coffee_Right_in_Brno,_Brno-City_District.jpg) |
| `ref-aeropress-800.webp` | Aeropress Coffee | Bean Poet | CC BY-SA 2.0 | [Aeropress coffee maker inverted.jpg](https://commons.wikimedia.org/wiki/File:Aeropress_coffee_maker_inverted.jpg) |
| `ref-french-press-800.webp` | French Press Coffee | Infrogmation | CC BY-SA 2.0 | [French Press coffee making 05.jpg](https://commons.wikimedia.org/wiki/File:French_Press_coffee_making_05.jpg) |
| `ref-kopi-tubruk-800.webp` | Kopi Tubruk | Mo Riza from New York, USA | CC BY 2.0 | [Kopi Tubruk Jakarta.jpg](https://commons.wikimedia.org/wiki/File:Kopi_Tubruk_Jakarta.jpg) |
| `ref-double-choco-800.webp` | Double Choco | MochaMilk | CC BY-SA 4.0 | [Cup of Hot Chocolate.jpg](https://commons.wikimedia.org/wiki/File:Cup_of_Hot_Chocolate.jpg) |
| `ref-chai-latte-800.webp` | Chai Latte | Andy Li | CC0 | [Chai Latte - The Flour Pot Bakery 2026-05-20.j](https://commons.wikimedia.org/wiki/File:Chai_Latte_-_The_Flour_Pot_Bakery_2026-05-20.jpg) |
| `ref-red-velvet-latte-800.webp` | Red Velvet Latte | SilminaJ | CC BY-SA 4.0 | [Red Velvet Latte.jpg](https://commons.wikimedia.org/wiki/File:Red_Velvet_Latte.jpg) |
| `ref-creamy-avocado-800.webp` | Creamy Avocado | Jameswasswa | CC BY-SA 4.0 | [Ovacado juice in a drinking glass.jpg](https://commons.wikimedia.org/wiki/File:Ovacado_juice_in_a_drinking_glass.jpg) |
| `ref-green-tea-latte-800.webp` | Green Tea Latte | Irvan Ary Maulana | CC BY-SA 4.0 | [Matcha tea latte with rosetta latte art.jpg](https://commons.wikimedia.org/wiki/File:Matcha_tea_latte_with_rosetta_latte_art.jpg) |
| `ref-teh-panas-800.webp` | Teh Panas | Dev Jadiya | CC0 | [Chai cups (Hot Milk Tea) 02.jpg](https://commons.wikimedia.org/wiki/File:Chai_cups_(Hot_Milk_Tea)_02.jpg) |
| `ref-teh-dingin-800.webp` | Teh Dingin | Renee Comet (photographer) | Public domain | [NCI iced tea.jpg](https://commons.wikimedia.org/wiki/File:NCI_iced_tea.jpg) |
| `ref-mango-peach-frappe-800.webp` | Mango Peach Frappe | Vivekpat30 | CC BY-SA 4.0 | [Fresh-mango-smoothie 01.jpg](https://commons.wikimedia.org/wiki/File:Fresh-mango-smoothie_01.jpg) |
| `ref-froot-loops-blast-frappe-800.webp` | Froot Loops Blast Frappe | Ewelina Podrez-Siama | CC BY 2.0 | [Frappe - coffee milkshake with whipped cream a](https://commons.wikimedia.org/wiki/File:Frappe_-_coffee_milkshake_with_whipped_cream_and_chocolate_(KETO,_LCHF,_Low_Carb,_Gluten_free,_FIT)_-_52774791604.jpg) |
| `ref-spaghetti-pedas-cakalang-800.webp` | Spaghetti Pedas Cakalang | Bairuilong | CC BY-SA 4.0 | [Spaghetti aglio e olio KB.jpg](https://commons.wikimedia.org/wiki/File:Spaghetti_aglio_e_olio_KB.jpg) |
| `ref-cream-of-mushroom-soup-800.webp` | Cream of Mushroom Soup | Ceeseven | CC BY-SA 4.0 | [Bowl of Cream of Mushroom Soup.JPG](https://commons.wikimedia.org/wiki/File:Bowl_of_Cream_of_Mushroom_Soup.JPG) |
| `ref-kentang-goreng-800.webp` | Kentang Goreng | Chris Woodrich | CC BY-SA 4.0 | [Cajun fries from Popeyes Louisiana Kitchen, St](https://commons.wikimedia.org/wiki/File:Cajun_fries_from_Popeyes_Louisiana_Kitchen,_Stratford,_Ontario,_2025-08-04.jpg) |
| `ref-potato-nachos-supreme-800.webp` | Potato Nachos Supreme | Krista | CC BY 2.0 | [Frankie & Johnny's debris nachos, New Orleans.](https://commons.wikimedia.org/wiki/File:Frankie_%26_Johnny%27s_debris_nachos,_New_Orleans.jpg) |
| `ref-smoke-beef-bitterballen-800.webp` | Smoke Beef & Mozzarella Bitterballen | Andy Li | CC0 | [Bitterballen with Dijon mustard - Taproom ‘t B](https://commons.wikimedia.org/wiki/File:Bitterballen_with_Dijon_mustard_-_Taproom_%E2%80%98t_Blauwe_Theehuis_2024-11-26.jpg) |
| `ref-banana-nutella-spring-roll-800.webp` | Banana Nutella & Cheese Spring Roll | Herbertkikoy | CC BY-SA 4.0 | [Pinoy Turon.jpg](https://commons.wikimedia.org/wiki/File:Pinoy_Turon.jpg) |
| `ref-kaya-butter-toast-800.webp` | Kaya Butter Toast | Bahnfrend | CC BY-SA 4.0 | [Kaya toast with butter set, Ya Kun Kaya Toast,](https://commons.wikimedia.org/wiki/File:Kaya_toast_with_butter_set,_Ya_Kun_Kaya_Toast,_KLIA1,_2025_(01).jpg) |
| `ref-shrimp-money-bag-800.webp` | Shrimp Money Bag | lazy fri13th | CC BY 2.0 | [Deep-fried wontons.jpg](https://commons.wikimedia.org/wiki/File:Deep-fried_wontons.jpg) |
| `ref-waffle-800.webp` | Waffle | TheCulinaryGeek | CC BY 2.0 | [Waffles with maple syrup and butter on a white](https://commons.wikimedia.org/wiki/File:Waffles_with_maple_syrup_and_butter_on_a_white_plate.jpg) |

Catatan kecocokan: foto adalah **jenis** hidangan yang serupa, bukan menu persis. Contoh: "Espresso Milo" memakai foto minuman cokelat-kopi bertabur bubuk; "Teh Panas" memakai teh susu dalam gelas; "Kentang Goreng" memakai kentang bumbu Cajun; "Froot Loops Blast Frappe" memakai frappe krim kocok.

## Foto Calibre dan foto kedai

| Aset | Dipakai di | Sumber asli | Atribusi |
|---|---|---|---|
| `gmaps-interior-2019` | Cerita (polaroid), tile Beranda, og:image | Foto interior pada profil Google Maps, "Des 2019" | Foto pada profil Google Maps (pengunggah tidak tercantum pada tampilan terbatas) |
| `fabsoc-fasad-2019` | Cerita (polaroid), latar pembuka | IMG_4098, Fabulous Society, 30 Mar 2019 | Fabulous Society (Rekatery) |
| `fabsoc-atap-kaca-2019` | Cerita (polaroid), foto pembuka | IMG_4117, Fabulous Society | Fabulous Society |
| `menu-aglio-olio-2019-800` | Kartu "Spaghetti Aglio Olio" | Potongan IMG_4133, Fabulous Society | Fabulous Society, Mar 2019 |
| `menu-croissant-2019-800` | Kartu "Chocolate Croissant" | Potongan IMG_4133 | Fabulous Society, Mar 2019 |

Semua foto di bagian ini tanpa lisensi tertulis; sebelum dipublikasikan di luar studi, minta izin atau ganti dengan foto milik Calibre.
