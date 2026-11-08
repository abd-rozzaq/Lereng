import type { Metadata } from "next";
import TourForm from "@/components/TourForm";
import styles from "../subpage.module.css";
import own from "./kunjungi.module.css";

export const metadata: Metadata = { title: "Kunjungi" };

const HOURS = [
  { day: "Senin", time: "Tutup" },
  { day: "Selasa", time: "07.00 sampai 15.00 (hari sangrai)" },
  { day: "Rabu sampai Jumat", time: "09.00 sampai 17.00" },
  { day: "Sabtu", time: "07.00 sampai 14.00 (tur kebun pagi)" },
  { day: "Minggu", time: "Tutup" },
];

export default function KunjungiPage() {
  return (
    <div className="container">
      <header className={styles.head}>
        <h1 className={styles.title}>Kunjungi</h1>
        <p className={styles.lead}>
          Gudang kami terbuka untuk dicicipi. Datang hari Selasa kalau ingin melihat mesin sangrai bekerja, atau ikut
          tur kebun hari Sabtu pagi.
        </p>
      </header>

      <div className={own.grid}>
        <section aria-labelledby="judul-alamat" className={own.info}>
          <h2 id="judul-alamat" className={own.h2}>
            Gudang Lereng
          </h2>
          <address className={own.address}>
            Jl. Kebun Rakyat 12, Dampit
            <br />
            Kabupaten Malang, Jawa Timur
          </address>
          <p>Sekitar 45 menit dari Kota Malang lewat Jalan Raya Dampit. Parkir motor dan mobil di halaman gudang.</p>

          <h3 className={own.h3}>Jam buka</h3>
          <dl className={own.hours}>
            {HOURS.map((row) => (
              <div key={row.day} className={own.hoursRow}>
                <dt>{row.day}</dt>
                <dd>{row.time}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="judul-tur" className={own.tour}>
          <h2 id="judul-tur" className={own.h2}>
            Daftar tur kebun
          </h2>
          <p className={own.tourLead}>
            Sabtu pukul 07.00, dua jam berjalan kaki di kebun Pak Sarwo, lalu mencicipi tiga kopi di gudang. Rp75.000
            per orang, paling banyak delapan orang per rombongan.
          </p>
          <TourForm />
        </section>
      </div>
    </div>
  );
}
