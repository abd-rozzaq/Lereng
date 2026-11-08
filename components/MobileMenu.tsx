"use client";

import { useRef, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useModalBehaviour } from "@/lib/useLockBody";
import { NAV, scrollToSection } from "@/lib/nav";
import styles from "./MobileMenu.module.css";

type Props = { open: boolean; onClose: () => void; activeId: string; onHome: boolean };

export default function MobileMenu({ open, onClose, activeId, onHome }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  useModalBehaviour(open, panelRef, onClose);

  function goTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!onHome) return;
    event.preventDefault();
    onClose();
    // Tunggu menu tertutup dan scroll halaman dibuka lagi, baru meluncur ke bagian tujuan
    window.setTimeout(() => scrollToSection(id, lenis), 60);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-lenis-prevent
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
                  key={item.id}
                  variants={{
                    hidden: { y: 28, opacity: 0 },
                    show: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <a
                    href={onHome ? `#${item.id}` : `/#${item.id}`}
                    className={styles.link}
                    aria-current={activeId === item.id ? "location" : undefined}
                    onClick={(event) => goTo(event, item.id)}
                  >
                    {item.label}
                  </a>
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
