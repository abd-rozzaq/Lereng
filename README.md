# Lereng: situs roastery kopi fiktif dari Dampit, Malang

Situs portofolio yang dibangun dengan **Next.js 16 (App Router)**, **React 19**, **TypeScript**, dan **Motion** (Framer Motion).
Lereng adalah merek fiktif: alamat, petani, dan produknya karangan untuk keperluan portofolio.

## Menjalankan di komputer

Butuh Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Untuk mencoba versi produksi: `npm run build` lalu `npm start`.

## Publikasi ke Vercel (gratis)

1. Buat repository baru di GitHub, lalu upload isi folder ini (tanpa `node_modules` dan `.next`).
2. Masuk ke https://vercel.com dengan akun GitHub, pilih **Add New → Project**, lalu pilih repository tadi.
3. Biarkan semua pengaturan bawaan dan tekan **Deploy**. Vercel mengenali Next.js secara otomatis.
4. Setelah selesai, kamu mendapat tautan seperti `lereng-xxx.vercel.app`. Tautan ini yang dicantumkan di lamaran.

Setiap kali ada perubahan yang di-push ke GitHub, Vercel otomatis memublikasikan versi baru.

## Halaman

| Halaman | Isi |
| --- | --- |
| `/` Beranda | Terpal interaktif, kopi minggu ini, ajakan ke halaman Cerita |
| `/kopi` | Daftar kopi dengan filter proses dan keranjang |
| `/cerita` | Enam tahap dari ceri ke sangrai, mengikuti scroll |
| `/kunjungi` | Alamat, jam buka, formulir tur kebun dengan validasi |

## Animasi dan interaksi

| Bagian | File | Cara kerja |
| --- | --- | --- |
| Terpal jemuran di hero | `components/TarpCanvas.tsx` | Canvas 2D. Ceri "dituang" sekali saat halaman dibuka, lalu bisa diratakan dengan kursor atau usapan jari. Digambar per kelompok warna agar ringan di HP. `touch-action: pan-y` menjaga scroll vertikal tetap normal. |
| Transisi halaman | `app/template.tsx` | Tirai biru ditarik ke atas setiap pindah halaman. Tidak muncul di kunjungan pertama, supaya halaman langsung terlihat. |
| Penanda menu aktif | `components/Header.tsx` | `layoutId` Motion menggeser garis merah ke menu yang dipilih. |
| Header yang bersembunyi | `components/Header.tsx` | Sembunyi saat scroll ke bawah, muncul saat scroll ke atas, agar layar HP tidak tertutup. |
| Menu HP | `components/MobileMenu.tsx` | Panel dibuka dengan `clip-path` dari atas, tautannya muncul berurutan. Esc menutup panel dan fokus keyboard terkunci di dalamnya. |
| Filter kopi | `components/BeanCatalog.tsx` | `layout` dan `AnimatePresence`: baris yang tersisa bergeser ke posisi baru, bukan melompat. |
| Tombol Tambah | `components/BeanRow.tsx` | Label berganti menjadi "Masuk keranjang", dan angka di keranjang ikut memantul. |
| Perjalanan biji | `components/Journey.tsx` | Biji besar yang menempel di layar berubah bentuk dan warna sesuai tahap yang sedang dibaca. Garis merah di samping mengikuti progres scroll. Di HP, biji menjadi pita kecil di atas layar. |
| Judul yang terbuka | `components/Reveal.tsx` | Dipakai hemat, satu kalimat per halaman. |

## Reduced motion (kurangi gerakan)

- `MotionConfig reducedMotion="user"` di `components/Providers.tsx` mematikan animasi posisi dan ukuran untuk pengunjung yang menyalakan "kurangi gerakan" di perangkatnya.
- Tirai transisi halaman disembunyikan lewat CSS `prefers-reduced-motion`.
- Terpal langsung tampil penuh tanpa animasi menuang. Meratakan ceri tetap bisa karena itu digerakkan langsung oleh pengunjung.
- Smooth scroll hanya aktif kalau pengunjung tidak meminta pengurangan gerakan.

Cara mencoba: di iPhone, **Pengaturan → Aksesibilitas → Gerakan → Kurangi Gerakan**. Di Android, **Setelan → Aksesibilitas → Hapus animasi**. Di Chrome desktop, DevTools → Rendering → *Emulate CSS prefers-reduced-motion*.

## Yang sudah diuji

- `next build` berhasil tanpa error TypeScript.
- Desktop 1440 px dan HP 390 px (ukuran iPhone 12 sampai 15): semua halaman tanpa scroll ke samping.
- Meratakan terpal dengan gerakan kursor, filter proses, tambah ke keranjang, keranjang tetap tersimpan setelah halaman dimuat ulang, Esc menutup panel, fokus keyboard pindah ke panel yang dibuka.
- Formulir tur: pesan error untuk nama kosong, nomor WhatsApp yang salah, dan tanggal yang bukan Sabtu; fokus pindah ke kolom pertama yang salah.
- Mode kurangi gerakan: tirai tidak muncul dan terpal langsung tampil.
- Tidak ada error di konsol browser.

Masih perlu dicoba di HP sungguhan setelah dipublikasikan: rasa usapan di terpal, kelancaran scroll di halaman Cerita, dan pemilih tanggal bawaan HP.

## Struktur

```
app/            halaman (App Router), layout, transisi halaman, gaya global
components/     komponen beserta file .module.css masing-masing
lib/            data kopi, navigasi, dan perilaku panel (kunci scroll, Esc, fokus)
```

Data kopi ada di `lib/beans.ts`. Menambah atau mengubah kopi cukup dilakukan di file itu.

## Desain

- **Warna:** biru terpal `#2347A0` (terpal jemuran kopi), merah ceri `#C8102E`, abu vulkanik `#E3E4E0`, basalt `#1F2326`.
- **Huruf:** Big Shoulders Stencil untuk merek dan nama kopi (mengambil gaya cetakan stensil di karung goni), Archivo dengan lebar variabel untuk judul dan teks lainnya.
- **Prinsip:** hanya satu momen besar per halaman. Animasi lain hanya muncul sebagai respons atas tindakan pengunjung.
