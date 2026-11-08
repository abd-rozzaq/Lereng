# Lereng: situs roastery kopi fiktif dari Dampit, Malang

Situs satu halaman yang dibangun dengan **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Motion** (Framer Motion), dan **Lenis** untuk smooth scroll.
Lereng adalah merek fiktif: alamat, petani, dan produknya karangan untuk keperluan portofolio.

## Menjalankan di komputer

Butuh Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Untuk mencoba versi produksi: `npm run build` lalu `npm start`.

## Publikasi

Repository ini tersambung ke Vercel. Setiap commit ke branch `main` otomatis dipublikasikan dalam sekitar satu menit.

## Susunan halaman

Semua bagian ada di satu halaman (`app/page.tsx`). Menu di header, menu HP, dan footer hanya berfungsi sebagai anchor.

| Bagian | Komponen | Isi |
| --- | --- | --- |
| `#beranda` | `components/Hero.tsx` | Terpal jemuran interaktif dan teks pembuka |
| `#kopi` | `components/BeanRail.tsx` | Enam kopi dalam deretan yang bergeser ke samping saat di-scroll |
| `#cerita` | `components/Journey.tsx` | Enam tahap dari ceri ke sangrai |
| `#kunjungi` | `app/page.tsx`, `components/TourForm.tsx` | Alamat, jam buka, formulir tur kebun |

## Animasi dan interaksi

| Bagian | File | Cara kerja |
| --- | --- | --- |
| Smooth scroll | `components/SmoothScroll.tsx` | Lenis menghaluskan scroll roda mouse dan trackpad. Di HP, scroll bawaan sistem tetap dipakai. |
| Menu anchor + scrollspy | `components/Header.tsx`, `lib/nav.ts` | Klik menu meluncur ke bagiannya lewat Lenis. Garis merah di menu bergeser sendiri mengikuti bagian yang sedang dibaca (IntersectionObserver + `layoutId`). |
| Terpal jemuran | `components/TarpCanvas.tsx` | Canvas 2D. Ceri "dituang" saat halaman dibuka, lalu bisa diratakan dengan kursor atau usapan jari. `touch-action: pan-y` menjaga scroll vertikal di HP tetap normal. |
| Hero sticky | `components/Hero.tsx` | Terpal menempel di atas, lalu lembaran teks naik menutupinya. Terpal sedikit mengecil dan meredup saat tertutup. |
| Kopi horizontal | `components/BeanRail.tsx` | Bagian Kopi menempel selama scroll, dan progres scroll vertikal diubah menjadi geseran horizontal. Ada garis progres dan penunjuk "Kopi 3 dari 6". Kalau tombol di kopi yang belum terlihat mendapat fokus keyboard, halaman di-scroll sampai kopi itu terlihat. |
| Perjalanan biji | `components/Journey.tsx` | Biji besar menempel di layar dan berubah bentuk serta warna sesuai tahap yang sedang dibaca. Di HP, biji menjadi pita kecil di atas layar. |
| Info kunjungan sticky | `app/page.module.css` | Di desktop, alamat dan jam buka ikut menempel saat formulir di sebelahnya di-scroll. |
| Header | `components/Header.tsx` | Sembunyi saat scroll ke bawah, muncul saat scroll ke atas. Elemen sticky lain menyesuaikan posisinya. |
| Menu HP dan keranjang | `components/MobileMenu.tsx`, `components/CartDrawer.tsx` | Scroll halaman (termasuk Lenis) dihentikan selama panel terbuka. Esc menutup panel, dan fokus keyboard terkunci di dalamnya. |
| Tombol Tambah | `components/BeanPanel.tsx` | Label berganti menjadi "Masuk keranjang", dan angka di keranjang ikut memantul. |

## Reduced motion (kurangi gerakan)

- Lenis tidak dipasang, jadi scroll kembali ke perilaku bawaan browser.
- Bagian Kopi tidak "membajak" scroll. Deretan kopi menjadi daftar yang bisa digeser sendiri ke samping (scroll snap).
- `MotionConfig reducedMotion="user"` mematikan animasi posisi dan ukuran. Terpal langsung tampil penuh tanpa animasi menuang dan tidak mengecil saat tertutup.
- Preferensi ini dibaca setelah halaman terpasang (`lib/usePrefersReducedMotion.ts`), supaya HTML dari server dan browser tetap sama.

Cara mencoba: di iPhone, **Pengaturan → Aksesibilitas → Gerakan → Kurangi Gerakan**. Di Android, **Setelan → Aksesibilitas → Hapus animasi**. Di Chrome desktop, DevTools → Rendering → *Emulate CSS prefers-reduced-motion*.

## Font

Dua font dari Google Fonts, disimpan langsung di proyek lewat Fontsource, jadi situs tidak perlu memanggil server Google saat dibuka:

- **Bayon** untuk judul, nama merek, dan nama kopi. Selalu huruf kapital, ramping, dan tebal.
- **Manrope** (`@fontsource-variable/manrope`) untuk teks dan antarmuka.

## Yang sudah diuji

- `next build` berhasil tanpa error TypeScript.
- Desktop 1440 px dan HP 390 px: tidak ada scroll ke samping, menu anchor mendarat tepat di bagiannya, penanda menu mengikuti bagian yang dibaca.
- Bagian Kopi bergeser horizontal saat di-scroll. Fokus keyboard ke kopi yang tersembunyi membuat kopi itu tampil.
- Halaman tidak ikut ter-scroll saat keranjang terbuka, dan scroll kembali normal setelah ditutup.
- Mode kurangi gerakan: Lenis mati, bagian Kopi menjadi daftar geser biasa, tidak ada error hydration.
- Tidak ada error di konsol browser.

Masih perlu dicoba di HP sungguhan: rasa scroll di bagian Kopi, usapan di terpal, dan pemilih tanggal bawaan HP.

## Struktur

```
app/            halaman, layout, gaya global
components/     komponen beserta file .module.css masing-masing
lib/            data kopi, navigasi anchor, perilaku panel, deteksi kurangi gerakan
public/images/  foto produk (still life di hero, mockup kemasan di bagian Cerita)
```

Gambar di `public/` dipanggil tanpa kata `public`, misalnya `/images/lereng-kemasan.avif`. Komponen `next/image` otomatis menyajikan ukuran dan format yang sesuai layar pengunjung.

Data kopi ada di `lib/beans.ts`. Menambah atau mengubah kopi cukup dilakukan di file itu. Bagian Kopi akan menghitung ulang panjang geserannya sendiri.

## Desain

Arah visual terinspirasi gaya situs kopi modern: latar krem hangat, wadah besar bersudut bulat, tombol berbentuk pil, dan judul kapital yang tebal. Tata letak dan isinya tetap milik Lereng.

- **Warna** (semua token ada di `app/globals.css`):

  | Token | Warna | Dipakai untuk |
  | --- | --- | --- |
  | `--krem` | `#FAF0E0` | Latar halaman |
  | `--permukaan` | `#FCF7EE` | Kartu kopi, kartu info, kolom isian |
  | `--terpal` | `#F2C79A` | Terpal jemuran di hero |
  | `--oranye` | `#FF8342` | Tombol utama, penanda menu, progres, label |
  | `--karat` | `#7D2C0F` | Teks utama, blok gelap (Cerita, formulir, footer) |
  | `--karat-tua` | `#5A1F08` | Teks di atas oranye |
  | `--karat-muda` | `#AF4F29` | Teks sekunder |
  | `--persik` | `#FFEFD5` | Teks terang di atas karat |

- **Kontras (WCAG AA):** teks utama 8.3 : 1, teks sekunder 4.7 : 1, teks di atas oranye 5.3 : 1, teks terang di atas karat 8.3 : 1. Oranye tidak pernah dipakai sebagai warna teks di latar terang (hanya 2.2 : 1).
- **Sudut:** `--radius-xl` untuk wadah besar, `--radius-lg` untuk kartu, `--radius-pill` untuk tombol dan label.
- **Tombol bersama:** kelas `.btn`, `.btn-oranye`, `.btn-garis`, dan `.btn-panah` ada di `app/globals.css`.
- **Prinsip:** hanya satu momen besar di setiap bagian. Animasi lain hanya muncul sebagai respons atas tindakan pengunjung.
