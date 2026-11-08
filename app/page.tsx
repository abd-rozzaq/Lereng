import Link from "next/link";
import TarpCanvas from "@/components/TarpCanvas";
import BeanRow from "@/components/BeanRow";
import Reveal from "@/components/Reveal";
import { BEANS } from "@/lib/beans";
import styles from "./page.module.css";

export default function HomePage() {
  const thisWeek = BEANS.filter((bean) => bean.thisWeek);

  return (
    <>
      <section aria-labelledby="judul-utama">
        <TarpCanvas />
        <div className={`container ${styles.intro}`}>
          <h1 id="judul-utama" className={styles.headline}>
            Robusta dari lereng Semeru, dijemur tiga minggu di Dampit.
          </h1>
          <div className={styles.introSide}>
            <p>
              Kami membeli ceri merah langsung dari kebun-kebun kecil di Dampit, Kabupaten Malang, lalu menyangrainya
              sendiri setiap Selasa. Kopi yang kamu terima paling lama berumur seminggu dari sangrai.
            </p>
            <div className={styles.ctas}>
              <Link href="/kopi" className={styles.primary}>
                Lihat kopi
              </Link>
              <Link href="/cerita" className={styles.secondary}>
                Cara kami mengolahnya
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={`container ${styles.week}`} aria-labelledby="judul-minggu-ini">
        <div className={styles.weekHead}>
          <h2 id="judul-minggu-ini">Disangrai Selasa ini</h2>
          <Link href="/kopi" className={styles.textLink}>
            Semua kopi
          </Link>
        </div>
        <div>
          {thisWeek.map((bean) => (
            <BeanRow key={bean.id} bean={bean} />
          ))}
        </div>
      </section>

      <section className={styles.band} aria-labelledby="judul-hari">
        <div className="container">
          <Reveal>
            <h2 id="judul-hari" className={styles.bandTitle}>
              Dari ceri merah ke cangkirmu butuh sekitar enam puluh hari.
            </h2>
          </Reveal>
          <p className={styles.bandText}>
            Tiga minggu di terpal, sebulan di karung goni, lalu satu pagi di mesin sangrai. Kami tidak mempercepat
            satu pun tahapnya.
          </p>
          <Link href="/cerita" className={styles.bandLink}>
            Ikuti perjalanannya
          </Link>
        </div>
      </section>
    </>
  );
}
