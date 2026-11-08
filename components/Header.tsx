"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { useCart } from "./CartContext";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";
import { NAV, scrollToSection } from "@/lib/nav";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const cart = useCart();
  const lenis = useLenis();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeId, setActiveId] = useState("beranda");
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  // Header bersembunyi saat scroll ke bawah dan muncul lagi saat scroll ke atas,
  // supaya layar HP tidak tertutup header terus-menerus.
  useMotionValueEvent(scrollY, "change", (y) => {
    const goingDown = y > lastY.current;
    lastY.current = y;
    setHidden(goingDown && y > 160);
  });

  // Penanda menu mengikuti bagian yang sedang dibaca (scrollspy)
  useEffect(() => {
    if (!onHome) return;
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveId(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome]);

  const showHeader = !hidden || menuOpen || cart.isOpen;

  // Elemen lain yang menempel di atas layar membaca tanda ini supaya tidak tertutup header
  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-hidden", !showHeader);
  }, [showHeader]);

  function goTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!onHome) return; // di halaman lain (404), biarkan tautan membuka beranda
    event.preventDefault();
    scrollToSection(id, lenis);
  }

  return (
    <>
      <motion.header
        className={styles.header}
        animate={{ y: showHeader ? 0 : "-100%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={`container ${styles.inner}`}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="Lereng, ke bagian atas"
            onClick={(event) => goTo(event, "beranda")}
          >
            Lereng
          </Link>

          <nav aria-label="Navigasi utama" className={styles.nav}>
            <ul>
              {NAV.map((item) => {
                const active = onHome && activeId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={onHome ? `#${item.id}` : `/#${item.id}`}
                      onClick={(event) => goTo(event, item.id)}
                      aria-current={active ? "location" : undefined}
                      className={styles.link}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="nav-penanda"
                          className={styles.marker}
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                    </a>
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

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeId={onHome ? activeId : ""} onHome={onHome} />
      <CartDrawer />
    </>
  );
}
