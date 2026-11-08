"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { BEANS, PROCESSES, type Process } from "@/lib/beans";
import BeanRow from "./BeanRow";
import styles from "./BeanCatalog.module.css";

type Filter = "Semua" | Process;

const PROCESS_INFO: Record<Filter, string> = {
  Semua: "Enam kopi, empat cara proses.",
  Natural: "Ceri dijemur utuh bersama kulitnya. Hasilnya manis dan berbuah.",
  Honey: "Kulit dikupas, lendir manisnya dibiarkan saat dijemur. Rasa karamel dan gula aren.",
  Washed: "Kulit dan lendir dicuci bersih sebelum dijemur. Rasa bersih, cokelat, dan kakao.",
  Wine: "Ceri difermentasi tertutup selama 30 hari sebelum dijemur. Rasa seperti tape dan anggur.",
};

export default function BeanCatalog() {
  const [filter, setFilter] = useState<Filter>("Semua");
  const visible = filter === "Semua" ? BEANS : BEANS.filter((bean) => bean.process === filter);
  const options: Filter[] = ["Semua", ...PROCESSES];

  return (
    <LayoutGroup>
      <div className={styles.filters} role="group" aria-label="Saring menurut proses">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={styles.chip}
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
          >
            {filter === option && (
              <motion.span
                layoutId="chip-aktif"
                className={styles.chipBg}
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className={styles.chipLabel}>{option}</span>
          </button>
        ))}
      </div>

      <p className={styles.info} aria-live="polite">
        {PROCESS_INFO[filter]}
      </p>

      {/* Saat filter berubah, kopi yang tersisa bergeser ke posisi barunya, bukan melompat */}
      <motion.div layout className={styles.list}>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((bean) => (
            <motion.div
              key={bean.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <BeanRow bean={bean} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
