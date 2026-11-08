"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { scrollToSection } from "@/lib/nav";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import TarpCanvas from "./TarpCanvas";
import styles from "./Hero.module.css";

/**
 * Terpal menempel di atas layar, lalu teks pembuka naik menutupinya seperti lembaran kertas.
 * Saat tertutup, terpal sedikit mengecil dan meredup supaya terasa "di belakang".
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.92]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.45]);

  function goTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    scrollToSection(id, lenis);
  }

  return (
    <section id="beranda" ref={ref} className={styles.hero} aria-labelledby="judul-utama">
      <div className={styles.tarpSticky}>
        <motion.div className={styles.tarpScale} style={{ scale }}>
          <TarpCanvas />
          <motion.div className={styles.dim} style={{ opacity: dim }} aria-hidden="true" />
        </motion.div>
      </div>

      <div className={styles.sheet}>
        <div className={`container ${styles.intro}`}>
          <h1 id="judul-utama" className={styles.headline}>
            Robusta dari lereng Semeru, dijemur tiga minggu di Dampit.
          </h1>
          <div className={styles.side}>
            <p>
              Kami membeli ceri merah langsung dari kebun-kebun kecil di Dampit, Kabupaten Malang, lalu menyangrainya
              sendiri setiap Selasa. Kopi yang kamu terima paling lama berumur seminggu dari sangrai.
            </p>
            <div className={styles.ctas}>
              <a href="#kopi" className={styles.primary} onClick={(event) => goTo(event, "kopi")}>
                Lihat kopi
              </a>
              <a href="#cerita" className={styles.secondary} onClick={(event) => goTo(event, "cerita")}>
                Cara kami mengolahnya
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
