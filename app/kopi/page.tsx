import type { Metadata } from "next";
import BeanCatalog from "@/components/BeanCatalog";
import styles from "../subpage.module.css";

export const metadata: Metadata = { title: "Kopi" };

export default function KopiPage() {
  return (
    <div className="container">
      <header className={styles.head}>
        <h1 className={styles.title}>Kopi</h1>
        <p className={styles.lead}>
          Semua kopi kami robusta Dampit, dari kebun di ketinggian 600 sampai 900 mdpl. Yang membedakan adalah kebun
          dan cara ceri diproses setelah dipetik.
        </p>
      </header>
      <BeanCatalog />
    </div>
  );
}
