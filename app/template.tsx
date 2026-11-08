"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import styles from "./template.module.css";

// Next.js memasang ulang template.tsx setiap pindah halaman.
// Kunjungan pertama tidak diberi tirai, supaya halaman langsung terlihat saat dibuka.
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const [animate] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <>
      {animate && (
        // Tirai biru ditarik ke atas seperti terpal yang digulung
        <motion.div
          aria-hidden="true"
          className={styles.curtain}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
      <motion.div
        initial={animate ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
