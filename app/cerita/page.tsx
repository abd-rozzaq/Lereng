import type { Metadata } from "next";
import Journey from "@/components/Journey";
import Reveal from "@/components/Reveal";
import styles from "../subpage.module.css";
import own from "./cerita.module.css";

export const metadata: Metadata = { title: "Cerita" };

export default function CeritaPage() {
  return (
    <div className="container">
      <header className={styles.head}>
        <h1 className={styles.title}>Cerita</h1>
        <p className={styles.lead}>
          Dampit ada di kaki Semeru, sekitar empat puluh lima menit dari Kota Malang. Tanahnya vulkanik, kebunnya kecil,
          dan hampir semua kopinya robusta. Begini ceri dari sana sampai ke cangkirmu.
        </p>
      </header>

      <Journey />

      <section className={own.farmers} aria-labelledby="judul-petani">
        <Reveal>
          <h2 id="judul-petani" className={own.farmersTitle}>
            Kami membayar ceri merah lebih mahal dari harga pasar, supaya petani mau memetik pelan-pelan.
          </h2>
        </Reveal>
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
      </section>
    </div>
  );
}
