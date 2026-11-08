"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { CartProvider } from "./CartContext";
import SmoothScroll from "./SmoothScroll";

/**
 * reducedMotion="user": kalau pengunjung menyalakan "kurangi gerakan" di HP/komputernya,
 * Motion otomatis mematikan animasi posisi dan ukuran, dan hanya menyisakan perubahan opasitas.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <CartProvider>{children}</CartProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}
