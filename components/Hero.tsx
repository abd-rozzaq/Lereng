"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { scrollToSection } from "@/lib/nav";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import TarpCanvas from "./TarpCanvas";
import styles from "./Hero.module.css";

/**
 * Terpal menempel di atas layar, lalu lembaran teks pembuka naik menutupinya.
 * Saat tertutup, terpal sedikit mengecil dan meredup supaya terasa "di belakang".
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.9]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.5]);

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
          <p className={styles.kicker}>Robusta Dampit, disangrai tiap Selasa di Malang</p>
          <h1 id="judul-utama" className={styles.headline}>
            Dari lereng Semeru, dijemur tiga minggu
          </h1>
          <p className={styles.lead}>
            Kami membeli ceri merah langsung dari kebun-kebun kecil di Dampit, lalu menyangrainya sendiri. Kopi yang
            kamu terima paling lama berumur seminggu dari sangrai.
          </p>
          <div className={styles.ctas}>
            <a href="#kopi" className="btn btn-oranye" onClick={(event) => goTo(event, "kopi")}>
              Lihat kopi
              <span className="btn-panah" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <a href="#cerita" className="btn btn-garis" onClick={(event) => goTo(event, "cerita")}>
              Cara kami mengolahnya
            </a>
          </div>
        </div>

        {/* Foto produk: bagian pertama yang terlihat setelah lembaran menutupi terpal */}
        <div className={`container ${styles.photoWrap}`}>
          <figure className={styles.photo}>
            <Image
              src="/images/lereng-still-life.avif"
              alt="Kemasan kopi Lereng di meja kayu bersama secangkir kopi, biji kopi sangrai, dan bubuk kopi"
              width={1536}
              height={1024}
              sizes="(max-width: 1280px) 92vw, 1280px"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
