"use client";

import Link from "next/link";
import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useModalBehaviour } from "@/lib/useLockBody";
import { NAV, isActive } from "@/lib/nav";
import styles from "./MobileMenu.module.css";

type Props = { open: boolean; onClose: () => void; pathname: string };

export default function MobileMenu({ open, onClose, pathname }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  useModalBehaviour(open, panelRef, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          // Panel dibuka seperti terpal yang digelar dari atas
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className={styles.top}>
            <span className={styles.logo}>Lereng</span>
            <button type="button" className={styles.close} onClick={onClose}>
              Tutup
            </button>
          </div>

          <nav aria-label="Navigasi utama">
            <motion.ul
              className={styles.list}
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
                hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
            >
              {NAV.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{
                    hidden: { y: 28, opacity: 0 },
                    show: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <Link
                    href={item.href}
                    className={styles.link}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </nav>

          <p className={styles.foot}>Disangrai tiap Selasa di Malang. Dikirim hari yang sama.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
