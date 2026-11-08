"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatRupiah, type Bean } from "@/lib/beans";
import { useCart } from "./CartContext";
import styles from "./BeanPanel.module.css";

// Rentang ketinggian kebun di Dampit yang kami beli, untuk penanda ketinggian
const MIN_ALT = 550;
const MAX_ALT = 950;

const PROCESS_INFO: Record<Bean["process"], string> = {
  Natural: "Dijemur utuh bersama kulitnya.",
  Honey: "Kulit dikupas, lendir manisnya ikut dijemur.",
  Washed: "Dicuci bersih sebelum dijemur.",
  Wine: "Difermentasi tertutup 30 hari sebelum dijemur.",
};

export default function BeanPanel({ bean }: { bean: Bean }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  const altitudePct = ((bean.altitude - MIN_ALT) / (MAX_ALT - MIN_ALT)) * 100;

  return (
    <article className={styles.panel} aria-labelledby={`kopi-${bean.id}`}>
      <div className={styles.top}>
        {bean.thisWeek && <p className={styles.week}>Disangrai Selasa ini</p>}
        <h3 id={`kopi-${bean.id}`} className={styles.name}>
          {bean.name}
        </h3>
        <p className={styles.village}>{bean.village}</p>
      </div>

      <div className={styles.altitude}>
        {/* Garis lereng: titik merah menunjukkan posisi kebun di antara 550 dan 950 mdpl */}
        <div className={styles.slope} aria-hidden="true">
          <svg viewBox="0 0 100 34" preserveAspectRatio="none">
            <path d="M0 33 L100 1 L100 34 L0 34 Z" className={styles.slopeFill} />
            <path d="M0 33 L100 1" className={styles.slopeLine} />
          </svg>
          {/* Titik dibuat terpisah dari SVG supaya tetap bulat walau SVG direntangkan */}
          <span
            className={styles.slopeDot}
            style={{ left: `${altitudePct}%`, top: `${((33 - (altitudePct / 100) * 32) / 34) * 100}%` }}
          />
        </div>
        <p className={styles.mdpl}>{bean.altitude} mdpl</p>
      </div>

      <div className={styles.taste}>
        <p className={styles.process}>
          {bean.process}
          <span>{PROCESS_INFO[bean.process]}</span>
        </p>
        <p className={styles.notes}>{bean.notes}</p>
      </div>

      <div className={styles.buy}>
        <p className={styles.price}>
          {formatRupiah(bean.price)}
          <span> / {bean.weight} g</span>
        </p>
        <motion.button
          type="button"
          className={styles.add}
          data-added={added || undefined}
          onClick={() => {
            cart.add(bean.id);
            setAdded(true);
          }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Tambah ${bean.name} ke keranjang`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? "ok" : "add"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              {added ? "Masuk keranjang" : "Tambah"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <span className="visually-hidden" aria-live="polite">
          {added ? `${bean.name} masuk keranjang` : ""}
        </span>
      </div>
    </article>
  );
}
