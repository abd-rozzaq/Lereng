"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Teks besar yang "terbuka" saat masuk layar. Dipakai hemat: hanya untuk satu kalimat
 * per halaman yang memang ingin kami tonjolkan, bukan untuk setiap bagian.
 *
 * Catatan: clip-path dipasang di elemen dalam. Kalau dipasang di elemen yang dipantau,
 * Chrome menganggap elemen itu tidak terlihat sama sekali, dan animasinya tidak pernah jalan.
 */
export default function Reveal({ children }: { children: ReactNode }) {
  return (
    <motion.div initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.5 }}>
      <motion.div
        variants={{
          hidden: { clipPath: "inset(0 0 100% 0)", y: 30 },
          shown: { clipPath: "inset(0 0 0% 0)", y: 0 },
        }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
