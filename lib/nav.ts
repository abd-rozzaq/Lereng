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
  // Beranda selalu ke paling atas; bagian lain ke tepi atasnya
  if (lenis) {
    lenis.scrollTo(id === "beranda" ? 0 : target, { duration: 1.2 });
  } else if (id === "beranda") {
    window.scrollTo(0, 0);
  } else {
    target.scrollIntoView();
  }
  history.replaceState(null, "", id === "beranda" ? location.pathname : `#${id}`);
}
