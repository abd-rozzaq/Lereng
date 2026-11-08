import Link from "next/link";
import styles from "./subpage.module.css";

export default function NotFound() {
  return (
    <div className="container">
      <header className={styles.head}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.lead}>
          Halaman ini tidak ada. Mungkin alamatnya salah ketik. <Link href="/">Kembali ke beranda</Link> atau{" "}
          <Link href="/kopi">lihat daftar kopi</Link>.
        </p>
      </header>
    </div>
  );
}
