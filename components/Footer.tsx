import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.logo}>Lereng</p>
          <p className={styles.tagline}>Robusta Dampit, disangrai di Malang.</p>
        </div>

        <address className={styles.address}>
          Gudang Lereng
          <br />
          Jl. Kebun Rakyat 12, Dampit
          <br />
          Kabupaten Malang, Jawa Timur
        </address>

        <ul className={styles.links}>
          <li>
            <Link href="/kopi">Kopi</Link>
          </li>
          <li>
            <Link href="/cerita">Cerita</Link>
          </li>
          <li>
            <Link href="/kunjungi">Kunjungi</Link>
          </li>
        </ul>
      </div>

      <div className={`container ${styles.note}`}>
        <p>Lereng adalah merek fiktif yang dibuat untuk portofolio. Dibangun dengan Next.js dan Motion.</p>
      </div>
    </footer>
  );
}
