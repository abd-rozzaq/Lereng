"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatRupiah, type Bean } from "@/lib/beans";
import { useCart } from "./CartContext";
import styles from "./BeanRow.module.css";

// Rentang ketinggian kebun di Dampit yang kami beli, untuk penanda ketinggian
const MIN_ALT = 550;
const MAX_ALT = 950;

export default function BeanRow({ bean }: { bean: Bean }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  const altitudePct = ((bean.altitude - MIN_ALT) / (MAX_ALT - MIN_ALT)) * 100;

  return (
    <article className={styles.row} aria-labelledby={`kopi-${bean.id}`}>
      <div className={styles.title}>
        <h3 id={`kopi-${bean.id}`} className={styles.name}>
          {bean.name}
        </h3>
        <p className={styles.village}>{bean.village}</p>
      </div>

      <div className={styles.altitude}>
        <p>
          <strong>{bean.altitude} mdpl</strong>
        </p>
        {/* Garis lereng: titik merah menunjukkan posisi kebun di antara 550 dan 950 mdpl */}
        <svg viewBox="0 0 100 24" className={styles.slope} aria-hidden="true" preserveAspectRatio="none">
          <path d="M0 23 L100 1" className={styles.slopeLine} />
          <circle cx={altitudePct} cy={23 - (altitudePct / 100) * 22} r="3.2" className={styles.slopeDot} />
        </svg>
      </div>

      <div className={styles.taste}>
        <p className={styles.process}>{bean.process}</p>
        <p>{bean.notes}</p>
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
