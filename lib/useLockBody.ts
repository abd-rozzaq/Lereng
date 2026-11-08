"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Untuk panel yang menutupi layar (menu HP, keranjang):
 * mengunci scroll halaman, menutup dengan tombol Esc,
 * menjaga fokus keyboard tetap di dalam panel, dan mengembalikan fokus saat ditutup.
 */
export function useModalBehaviour(active: boolean, panelRef: RefObject<HTMLElement | null>, onClose: () => void) {
  // Simpan onClose di ref supaya efek tidak dijalankan ulang (dan fokus tidak melompat) setiap render
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    // Tunggu panel ter-render dulu sebelum memindahkan fokus
    const raf = requestAnimationFrame(() => focusables()[0]?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [active, panelRef]);
}
