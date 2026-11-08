"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { BEANS } from "@/lib/beans";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import BeanPanel from "./BeanPanel";
import styles from "./BeanRail.module.css";

/**
 * Bagian Kopi: layar "menempel", lalu scroll ke bawah menggeser deretan kopi ke samping.
 * Cara kerjanya: tinggi section = panjang geseran + satu layar. Selama section ini dilewati,
 * isinya menempel (position: sticky) dan progres scroll diubah menjadi geseran horizontal.
 *
 * Mode kurangi gerakan: tidak ada scroll yang "dibajak". Deretan kopi menjadi
 * daftar yang bisa digeser sendiri ke samping.
 */
export default function BeanRail() {
  const reduceMotion = usePrefersReducedMotion();
  const pinned = !reduceMotion;
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [current, setCurrent] = useState(1);

  // Hitung seberapa jauh deretan kopi perlu digeser; dihitung ulang saat ukuran layar berubah
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (value) => -value * distance);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setCurrent(Math.min(BEANS.length, Math.round(value * (BEANS.length - 1)) + 1));
  });

  // Pengguna keyboard: kalau tombol di kopi yang belum terlihat mendapat fokus,
  // halaman di-scroll ke posisi yang menampilkan kopi itu.
  function onFocus(event: FocusEvent<HTMLDivElement>) {
    if (!pinned || !sectionRef.current || !trackRef.current) return;
    viewportRef.current?.scrollTo({ left: 0 });
    const panel = (event.target as HTMLElement).closest("article");
    if (!panel) return;
    const paddingLeft = parseFloat(getComputedStyle(trackRef.current).paddingLeft);
    const shift = Math.min(distance, Math.max(0, panel.offsetLeft - paddingLeft));
    const top = sectionRef.current.getBoundingClientRect().top + window.scrollY + shift;
    if (lenis) lenis.scrollTo(top, { immediate: true });
    else window.scrollTo(0, top);
  }

  return (
    <section
      id="kopi"
      ref={sectionRef}
      className={pinned ? styles.pinned : styles.free}
      style={pinned ? { height: `calc(${distance}px + 100svh)` } : undefined}
      aria-labelledby="judul-kopi"
    >
      <div className={styles.sticky}>
        <div className={`container ${styles.head}`}>
          <h2 id="judul-kopi" className={styles.title}>
            Kopi
          </h2>
          <p className={styles.lead}>
            Enam robusta Dampit dari kebun di ketinggian 600 sampai 900 mdpl. Yang membedakan adalah kebun dan cara ceri
            diproses setelah dipetik.
          </p>
        </div>

        <div className={styles.viewport} ref={viewportRef} onFocus={onFocus}>
          <motion.div className={styles.track} ref={trackRef} style={pinned ? { x } : undefined}>
            {BEANS.map((bean) => (
              <BeanPanel key={bean.id} bean={bean} />
            ))}
          </motion.div>
        </div>

        <div className={`container ${styles.foot}`}>
          {pinned ? (
            <>
              <div className={styles.progressTrack} aria-hidden="true">
                <motion.div className={styles.progressBar} style={{ scaleX: scrollYProgress }} />
              </div>
              <p className={styles.counter} aria-hidden="true">
                Kopi {current} dari {BEANS.length}
              </p>
            </>
          ) : (
            <p className={styles.counter}>Geser ke samping untuk melihat keenam kopi.</p>
          )}
        </div>
      </div>
    </section>
  );
}
