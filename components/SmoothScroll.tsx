"use client";

import { ReactLenis } from "lenis/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import type { ReactNode } from "react";

/**
 * Smooth scroll dengan Lenis untuk roda mouse dan trackpad.
 * - Di HP, scroll bawaan sistem tetap dipakai (syncTouch: false), karena sudah halus
 *   dan pengguna HP terbiasa dengan rasanya.
 * - Kalau pengunjung memilih "kurangi gerakan", Lenis tidak dipasang sama sekali.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, syncTouch: false, autoRaf: true }}>
      {children}
    </ReactLenis>
  );
}
