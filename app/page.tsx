import Hero from "@/components/Hero";
import BeanRail from "@/components/BeanRail";
import Journey from "@/components/Journey";
import Reveal from "@/components/Reveal";
import TourForm from "@/components/TourForm";
import styles from "./page.module.css";

const HOURS = [
  { day: "Senin", time: "Tutup" },
  { day: "Selasa", time: "07.00 sampai 15.00 (hari sangrai)" },
  { day: "Rabu sampai Jumat", time: "09.00 sampai 17.00" },
  { day: "Sabtu", time: "07.00 sampai 14.00 (tur kebun pagi)" },
  { day: "Minggu", time: "Tutup" },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <BeanRail />

      <section id="cerita" aria-labelledby="judul-cerita">
        <div className={styles.band}>
          <div className="container">
            <h2 id="judul-cerita" className={styles.sectionTitleLight}>
              Cerita
            </h2>
            <Reveal>
              <p className={styles.bandTitle}>Dari ceri merah ke cangkirmu butuh sekitar enam puluh hari.</p>
            </Reveal>
            <p className={styles.bandText}>
              Dampit ada di kaki Semeru, sekitar empat puluh lima menit dari Kota Malang. Tanahnya vulkanik, kebunnya
              kecil, dan hampir semua kopinya robusta. Tiga minggu di terpal, sebulan di karung goni, lalu satu pagi di
              mesin sangrai. Kami tidak mempercepat satu pun tahapnya.
            </p>
          </div>
        </div>

        <div className={`container ${styles.journeyWrap}`}>
          <Journey />

          <div className={styles.farmers}>
            <p className={styles.farmersTitle}>
              Kami membayar ceri merah lebih mahal dari harga pasar, supaya petani mau memetik pelan-pelan.
            </p>
            <div className="prose">
              <p>
                Tengkulak biasanya membeli ceri campur: merah, kuning, dan hijau dalam satu karung. Petik campur lebih
                cepat, tapi rasanya jadi pahit dan kusam.
              </p>
              <p>
                Lereng bekerja dengan empat belas petani di Srimulyo, Sumbersuko, Baturetno, dan Tirtoyudo. Harga ceri
                merah kami sepakati di awal musim, jadi petani tahu berapa yang akan mereka terima sebelum memetik.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="kunjungi" className={`container ${styles.visit}`} aria-labelledby="judul-kunjungi">
        <div className={styles.visitHead}>
          <h2 id="judul-kunjungi" className={styles.sectionTitle}>
            Kunjungi
          </h2>
          <p className={styles.lead}>
            Gudang kami terbuka untuk dicicipi. Datang hari Selasa kalau ingin melihat mesin sangrai bekerja, atau ikut
            tur kebun hari Sabtu pagi.
          </p>
        </div>

        <div className={styles.visitGrid}>
          <div className={styles.info}>
            <h3 className={styles.h3}>Gudang Lereng</h3>
            <address className={styles.address}>
              Jl. Kebun Rakyat 12, Dampit
              <br />
              Kabupaten Malang, Jawa Timur
            </address>
            <p>Sekitar 45 menit dari Kota Malang lewat Jalan Raya Dampit. Parkir motor dan mobil di halaman gudang.</p>

            <h3 className={`${styles.h3} ${styles.hoursTitle}`}>Jam buka</h3>
            <dl className={styles.hours}>
              {HOURS.map((row) => (
                <div key={row.day} className={styles.hoursRow}>
                  <dt>{row.day}</dt>
                  <dd>{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.tour}>
            <h3 className={styles.tourTitle}>Daftar tur kebun</h3>
            <p className={styles.tourLead}>
              Sabtu pukul 07.00, dua jam berjalan kaki di kebun Pak Sarwo, lalu mencicipi tiga kopi di gudang.
              Rp75.000 per orang, paling banyak delapan orang per rombongan.
            </p>
            <TourForm />
          </div>
        </div>
      </section>
    </>
  );
}
