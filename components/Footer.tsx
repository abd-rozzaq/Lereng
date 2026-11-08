"use client";

import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { NAV, scrollToSection } from "@/lib/nav";
import styles from "./Footer.module.css";

export default function Footer() {
  const onHome = usePathname() === "/";
  const lenis = useLenis();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.logo}>Lereng</p>
          <p className={styles.tagline}>Robusta Dampit, disangrai di Malang.</p>
        </div>

        <address className={styles.address}>
          Gudang Lereng
          <br />
          Jl. Kebun Rakyat 12, Dampit
          <br />
          Kabupaten Malang, Jawa Timur
        </address>

        <ul className={styles.links}>
          {NAV.filter((item) => item.id !== "beranda").map((item) => (
            <li key={item.id}>
              <a
                href={onHome ? `#${item.id}` : `/#${item.id}`}
                onClick={(event) => {
                  if (!onHome) return;
                  event.preventDefault();
                  scrollToSection(item.id, lenis);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={`container ${styles.note}`}>
        <p>Lereng adalah merek fiktif yang dibuat untuk portofolio. Dibangun dengan Next.js, Motion, dan Lenis.</p>
      </div>
    </footer>
  );
}
