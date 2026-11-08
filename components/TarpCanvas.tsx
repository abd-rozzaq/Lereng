"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TarpCanvas.module.css";

/**
 * Terpal dengan ceri kopi yang sedang dijemur.
 * Pengunjung bisa "meratakan jemuran" dengan menggerakkan kursor atau mengusap layar,
 * seperti petani Dampit meratakan ceri dengan garuk kayu.
 *
 * Digambar di <canvas>, bukan ratusan elemen DOM, supaya tetap ringan di HP.
 */

type Bean = {
  x: number;
  y: number;
  r: number;
  angle: number;
  color: number; // indeks ke COLORS
  delay: number; // untuk animasi "dituang" saat pertama muncul
};

// Ceri dari merah bata segar sampai coklat tua yang hampir kering
const COLORS = ["#c0392b", "#a32a1e", "#86251c", "#6a2018", "#4f1a12"];
const TARP = "#ffd5bd"; // terpal persik
const POUR_MS = 1100;

// Angka acak dengan seed, supaya susunan ceri sama setiap kali halaman dibuka
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function TarpCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pourRef = useRef<() => void>(() => {});
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let beans: Bean[] = [];
    let tarpLayer: HTMLCanvasElement | null = null;
    let frame = 0;
    let pourStart = 0;
    let pouring = false;
    let last: { x: number; y: number } | null = null;

    function paintTarp() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const layer = document.createElement("canvas");
      layer.width = width * dpr;
      layer.height = height * dpr;
      const t = layer.getContext("2d")!;
      t.scale(dpr, dpr);
      t.fillStyle = TARP;
      t.fillRect(0, 0, width, height);

      // Anyaman terpal
      t.strokeStyle = "rgba(43,26,18,0.05)";
      t.lineWidth = 1;
      t.beginPath();
      for (let x = 0; x < width; x += 5) {
        t.moveTo(x + 0.5, 0);
        t.lineTo(x + 0.5, height);
      }
      for (let y = 0; y < height; y += 5) {
        t.moveTo(0, y + 0.5);
        t.lineTo(width, y + 0.5);
      }
      t.stroke();

      // Lipatan tepi dan lubang tali (mata ayam) di sepanjang pinggir terpal
      t.strokeStyle = "rgba(43,26,18,0.16)";
      t.lineWidth = 2;
      t.strokeRect(10, 10, width - 20, height - 20);
      const spacing = width < 600 ? 64 : 88;
      for (let x = 34; x < width - 20; x += spacing) {
        for (const y of [22, height - 22]) {
          t.beginPath();
          t.arc(x, y, 5.5, 0, Math.PI * 2);
          t.fillStyle = "#b8aa9c";
          t.fill();
          t.beginPath();
          t.arc(x, y, 2.8, 0, Math.PI * 2);
          t.fillStyle = "#2b1a12";
          t.fill();
        }
      }
      tarpLayer = layer;
    }

    function spreadBeans() {
      const random = seeded(17);
      const small = width < 600;
      const r = small ? 4.6 : 5.6;
      // Ceri disebar di area tengah, tepi terpal dibiarkan kosong
      const left = width * 0.06;
      const right = width * 0.94;
      const top = height * 0.12;
      const bottom = height * 0.9;
      const area = (right - left) * (bottom - top);
      const count = Math.min(2400, Math.round((area * 0.5) / (Math.PI * r * r)));
      beans = [];
      for (let i = 0; i < count; i++) {
        const x = left + random() * (right - left);
        const y = top + random() * (bottom - top);
        beans.push({
          x,
          y,
          r: r * (0.85 + random() * 0.3),
          angle: random() * Math.PI,
          color: Math.floor(random() * COLORS.length),
          // Dituang dari kiri ke kanan, seperti dari karung
          delay: (x / width) * 520 + random() * 260,
        });
      }
    }

    function draw(now: number) {
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      if (tarpLayer) ctx!.drawImage(tarpLayer, 0, 0);
      const dpr = canvas!.width / width;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const elapsed = now - pourStart;
      const progressOf = (bean: Bean) => (pouring ? Math.min(1, Math.max(0, (elapsed - bean.delay) / 420)) : 1);

      // Bayangan
      ctx!.fillStyle = "rgba(43,26,18,0.28)";
      ctx!.beginPath();
      for (const bean of beans) {
        const p = progressOf(bean);
        if (p <= 0) continue;
        const y = bean.y - (1 - easeOut(p)) * 36;
        ctx!.moveTo(bean.x + 1.5 + bean.r, y + 2);
        ctx!.ellipse(bean.x + 1.5, y + 2, bean.r, bean.r * 0.88, bean.angle, 0, Math.PI * 2);
      }
      ctx!.fill();

      // Ceri, dikelompokkan per warna supaya cepat digambar
      for (let c = 0; c < COLORS.length; c++) {
        ctx!.fillStyle = COLORS[c];
        ctx!.beginPath();
        for (const bean of beans) {
          if (bean.color !== c) continue;
          const p = progressOf(bean);
          if (p <= 0) continue;
          const y = bean.y - (1 - easeOut(p)) * 36;
          ctx!.moveTo(bean.x + bean.r, y);
          ctx!.ellipse(bean.x, y, bean.r, bean.r * 0.88, bean.angle, 0, Math.PI * 2);
        }
        ctx!.fill();
      }

      // Kilap kecil
      ctx!.fillStyle = "rgba(255,255,255,0.28)";
      ctx!.beginPath();
      for (const bean of beans) {
        const p = progressOf(bean);
        if (p <= 0) continue;
        const y = bean.y - (1 - easeOut(p)) * 36;
        const hx = bean.x - bean.r * 0.35;
        const hy = y - bean.r * 0.35;
        ctx!.moveTo(hx + bean.r * 0.28, hy);
        ctx!.arc(hx, hy, bean.r * 0.28, 0, Math.PI * 2);
      }
      ctx!.fill();

      if (pouring && elapsed > POUR_MS) pouring = false;
      frame = pouring ? requestAnimationFrame(draw) : 0;
    }

    function requestDraw() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function pour() {
      if (reduceMotion.matches) {
        pouring = false;
      } else {
        pouring = true;
        pourStart = performance.now();
      }
      cancelAnimationFrame(frame);
      frame = 0;
      requestDraw();
    }

    function setup(withPour: boolean) {
      const rect = wrap!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      paintTarp();
      spreadBeans();
      if (withPour) pour();
      else requestDraw();
    }

    // Meratakan jemuran: ceri di dekat jari/kursor terdorong menjauh dan ikut arah gerakan
    function rake(x: number, y: number) {
      const radius = width < 600 ? 38 : 48;
      const dx = last ? x - last.x : 0;
      const dy = last ? y - last.y : 0;
      last = { x, y };
      let moved = false;
      for (const bean of beans) {
        const ox = bean.x - x;
        const oy = bean.y - y;
        const dist = Math.hypot(ox, oy);
        if (dist >= radius) continue;
        const strength = (radius - dist) / radius;
        const nx = dist > 0.01 ? ox / dist : Math.random() - 0.5;
        const ny = dist > 0.01 ? oy / dist : Math.random() - 0.5;
        bean.x += nx * strength * 7 + dx * strength * 0.35;
        bean.y += ny * strength * 7 + dy * strength * 0.35;
        bean.angle += strength * 0.2;
        bean.x = Math.min(width - 16, Math.max(16, bean.x));
        bean.y = Math.min(height - 16, Math.max(16, bean.y));
        moved = true;
      }
      if (moved) requestDraw();
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      rake(event.clientX - rect.left, event.clientY - rect.top);
    }
    function onPointerLeave() {
      last = null;
    }

    pourRef.current = pour;
    setup(true);

    let resizeTimer = 0;
    let lastWidth = width;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // Di HP, bar alamat browser mengubah tinggi saat scroll; abaikan perubahan yang hanya tinggi
        const w = wrap!.getBoundingClientRect().width;
        if (Math.abs(w - lastWidth) < 1) return;
        lastWidth = w;
        setup(false);
      }, 150);
    });
    observer.observe(wrap);

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerup", onPointerLeave);
    canvas.addEventListener("pointercancel", onPointerLeave);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerup", onPointerLeave);
      canvas.removeEventListener("pointercancel", onPointerLeave);
    };
  }, []);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        role="img"
        aria-label="Ceri kopi merah dijemur di atas terpal"
      />
      <div className={styles.bar}>
        <p className={styles.hint}>
          {touch ? "Usap ke samping untuk meratakan." : "Gerakkan kursor di atas terpal untuk meratakan jemuran."}
        </p>
        <button type="button" className={styles.reset} onClick={() => pourRef.current()}>
          Tuang ulang
        </button>
      </div>
    </div>
  );
}
