import type Lenis from "lenis";

// Menu hanya berfungsi sebagai anchor ke bagian-bagian di satu halaman
export const NAV = [
  { id: "beranda", label: "Beranda" },
  { id: "kopi", label: "Kopi" },
  { id: "cerita", label: "Cerita" },
  { id: "kunjungi", label: "Kunjungi" },
];

/**
 * Scroll ke sebuah bagian. Pakai Lenis kalau aktif (lebih halus),
 * kalau tidak (mode kurangi gerakan) pakai scroll bawaan browser tanpa animasi.
 */
export function scrollToSection(id: string, lenis?: Lenis) {
  const target = document.getElementById(id);
  if (!target) return;
  // Hitung posisi tujuan sebagai angka mutlak di halaman (bukan relatif ke posisi scroll
  // saat ini), supaya tetap tepat walau scroll sedang bergerak saat menu diklik.
  // Beranda selalu ke paling atas.
  const destination = id === "beranda" ? 0 : Math.round(target.getBoundingClientRect().top + window.scrollY);
  if (lenis) {
    lenis.scrollTo(destination, { duration: 1.2 });
  } else {
    window.scrollTo(0, destination);
  }
  history.replaceState(null, "", id === "beranda" ? location.pathname : `#${id}`);
}
