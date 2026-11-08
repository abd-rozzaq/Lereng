"use client";

import { useEffect, useState } from "react";

/**
 * Membaca pengaturan "kurangi gerakan" setelah halaman terpasang di browser.
 * Render pertama selalu false (sama dengan hasil render server), supaya HTML server
 * dan browser tidak berbeda (menghindari error hydration). Ikut berubah kalau
 * pengguna mengganti pengaturan saat halaman masih terbuka.
 */
export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduce;
}
