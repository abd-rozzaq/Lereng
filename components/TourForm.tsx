"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./TourForm.module.css";

type Errors = Partial<Record<"name" | "phone" | "date" | "people", string>>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const phone = String(data.get("phone") ?? "").replace(/[\s-]/g, "");
  const date = String(data.get("date") ?? "");
  const people = Number(data.get("people"));

  if (!name) errors.name = "Tulis nama kamu.";
  if (!/^(\+62|62|0)8\d{7,11}$/.test(phone)) errors.phone = "Tulis nomor WhatsApp yang diawali 08 atau +62.";

  if (!date) {
    errors.date = "Pilih tanggal tur.";
  } else {
    const chosen = new Date(`${date}T07:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (chosen.getDay() !== 6) errors.date = "Tur hanya ada hari Sabtu. Pilih tanggal Sabtu.";
    else if (chosen < today) errors.date = "Tanggal itu sudah lewat. Pilih Sabtu berikutnya.";
  }

  if (!Number.isInteger(people) || people < 1 || people > 8) errors.people = "Satu rombongan 1 sampai 8 orang.";
  return errors;
}

export default function TourForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ name: string; date: string; people: number } | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const found = validate(data);
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }
    const date = new Date(`${data.get("date")}T07:00:00`).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    setSent({ name: String(data.get("name")).trim(), date, people: Number(data.get("people")) });
  }

  const field = (name: keyof Errors) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `galat-${name}` : undefined,
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="terkirim"
          className={styles.done}
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className={styles.doneTitle}>Pendaftaran tur terkirim.</p>
          <p>
            Terima kasih, {sent.name}. Tempat untuk {sent.people} orang pada {sent.date} pukul 07.00 kami catat. Ini
            situs demo, jadi tidak ada pesan WhatsApp yang dikirim.
          </p>
          <button type="button" className={styles.again} onClick={() => setSent(null)}>
            Daftar rombongan lain
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="formulir"
          className={styles.form}
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.field}>
            <label htmlFor="name">Nama</label>
            <input id="name" name="name" autoComplete="name" {...field("name")} />
            {errors.name && (
              <p id="galat-name" className={styles.error}>
                {errors.name}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="phone">Nomor WhatsApp</label>
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" {...field("phone")} />
            {errors.phone && (
              <p id="galat-phone" className={styles.error}>
                {errors.phone}
              </p>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="date">Tanggal (Sabtu)</label>
              <input id="date" name="date" type="date" {...field("date")} />
              {errors.date && (
                <p id="galat-date" className={styles.error}>
                  {errors.date}
                </p>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="people">Jumlah orang</label>
              <input
                id="people"
                name="people"
                type="number"
                min={1}
                max={8}
                defaultValue={2}
                inputMode="numeric"
                {...field("people")}
              />
              {errors.people && (
                <p id="galat-people" className={styles.error}>
                  {errors.people}
                </p>
              )}
            </div>
          </div>

          <motion.button type="submit" className={styles.submit} whileTap={{ scale: 0.97 }}>
            Daftar tur
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
