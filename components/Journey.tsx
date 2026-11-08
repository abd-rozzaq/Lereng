"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import styles from "./Journey.module.css";

type Step = {
  title: string;
  day: string;
  text: string;
  color: string; // warna biji di tahap ini
  shape: "ceri" | "biji";
};

// Urutan ini memang berurutan (tahap pengolahan), jadi diberi nomor.
const STEPS: Step[] = [
  {
    title: "Petik yang merah saja",
    day: "Hari 1",
    text: "Petani memetik ceri yang sudah merah penuh. Kebun yang sama didatangi tiga sampai empat kali dalam satu musim, karena ceri tidak matang bersamaan.",
    color: "#c8102e",
    shape: "ceri",
  },
  {
    title: "Rendam dan sortir",
    day: "Hari 1",
    text: "Ceri dimasukkan ke bak air. Yang mengapung biasanya kosong atau dimakan hama, jadi dipisahkan.",
    color: "#a3162b",
    shape: "ceri",
  },
  {
    title: "Jemur di atas terpal",
    day: "Hari 2 sampai 22",
    text: "Ceri dijemur di halaman rumah petani dan dibalik setiap dua jam. Kalau hujan, terpal dilipat. Sekitar tiga minggu sampai ceri berbunyi saat diguncang.",
    color: "#5a1a22",
    shape: "ceri",
  },
  {
    title: "Istirahat di karung goni",
    day: "Hari 23 sampai 52",
    text: "Ceri kering disimpan sebulan di gudang supaya kadar airnya rata. Biji yang buru-buru disangrai rasanya tajam dan datar.",
    color: "#4a2a1e",
    shape: "ceri",
  },
  {
    title: "Kupas dan pilih ulang",
    day: "Hari 53 sampai 55",
    text: "Kulit kering digiling, lalu biji hijau dipilih dengan tangan. Biji pecah dan hitam disisihkan.",
    color: "#9aa47a",
    shape: "biji",
  },
  {
    title: "Sangrai di Malang",
    day: "Sekitar hari 60",
    text: "Kami menyangrai setiap Selasa pagi, mencicipi tiap angkatan, lalu mengirim di hari yang sama.",
    color: "#4b2a17",
    shape: "biji",
  },
];

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Garis kemajuan di samping daftar tahap, mengikuti scroll
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 60%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // Tahap yang sedang di tengah layar menjadi tahap aktif
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const step = STEPS[active];

  return (
    <section ref={sectionRef} className={styles.journey} aria-labelledby="judul-perjalanan">
      <h2 id="judul-perjalanan" className="visually-hidden">
        Enam tahap dari ceri sampai sangrai
      </h2>

      <div className={styles.stage} aria-hidden="true">
        <div className={styles.stageInner}>
          <svg viewBox="-60 -60 120 120" className={styles.bean}>
            <motion.ellipse
              cx="0"
              cy="0"
              initial={false}
              animate={{
                rx: step.shape === "ceri" ? 44 : 34,
                ry: step.shape === "ceri" ? 42 : 48,
                fill: step.color,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Garis belahan biji, muncul setelah kulit dikupas */}
            <motion.path
              d="M0 -40 C 12 -18, -12 18, 0 40"
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              initial={false}
              animate={{
                pathLength: step.shape === "biji" ? 1 : 0,
                opacity: step.shape === "biji" ? 1 : 0,
                stroke: active === STEPS.length - 1 ? "#2a160c" : "#6f7a52",
              }}
              transition={{ duration: 0.6 }}
            />
            {/* Kilap ceri segar */}
            <motion.circle
              cx="-16"
              cy="-16"
              r="7"
              fill="#ffffff"
              initial={false}
              animate={{ opacity: active < 2 ? 0.35 : 0 }}
              transition={{ duration: 0.4 }}
            />
          </svg>
          <p className={styles.day}>{step.day}</p>
        </div>
      </div>

      <div className={styles.track}>
        <motion.div className={styles.progress} style={{ scaleY: progress }} aria-hidden="true" />
        <ol className={styles.steps}>
          {STEPS.map((item, index) => (
            <li
              key={item.title}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              data-index={index}
              className={styles.step}
              data-active={index === active || undefined}
            >
              <span className={styles.number}>{index + 1}</span>
              <div>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDay}>{item.day}</p>
                <p className={styles.stepText}>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
