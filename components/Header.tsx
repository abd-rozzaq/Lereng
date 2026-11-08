"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCart } from "./CartContext";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";
import { NAV, isActive } from "@/lib/nav";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const cart = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  // Di HP, header bersembunyi saat scroll ke bawah dan muncul lagi saat scroll ke atas,
  // supaya layar kecil tidak tertutup header terus-menerus.
  useMotionValueEvent(scrollY, "change", (y) => {
    const goingDown = y > lastY.current;
    lastY.current = y;
    setHidden(goingDown && y > 160);
  });

  useEffect(() => setMenuOpen(false), [pathname]);

  const showHeader = !hidden || menuOpen || cart.isOpen;

  // Elemen lain yang menempel di atas layar (pita biji di halaman Cerita) membaca tanda ini
  // supaya tidak tertutup header.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-hidden", !showHeader);
  }, [showHeader]);

  return (
    <>
      <motion.header
        className={styles.header}
        animate={{ y: showHeader ? 0 : "-100%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={`container ${styles.inner}`}>
          <Link href="/" className={styles.logo} aria-label="Lereng, ke beranda">
            Lereng
          </Link>

          <nav aria-label="Navigasi utama" className={styles.nav}>
            <ul>
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={active ? "page" : undefined} className={styles.link}>
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="nav-penanda"
                          className={styles.marker}
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.actions}>
            <button type="button" className={styles.cartButton} onClick={cart.open} aria-haspopup="dialog">
              Keranjang
              <AnimatePresence initial={false} mode="popLayout">
                {cart.count > 0 && (
                  <motion.span
                    key={cart.count}
                    className={styles.badge}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  >
                    <span className="visually-hidden">, isi </span>
                    {cart.count}
                    <span className="visually-hidden"> bungkus</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
            >
              <span className={styles.menuIcon} aria-hidden="true">
                <span />
                <span />
              </span>
              Menu
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
      <CartDrawer />
    </>
  );
}
