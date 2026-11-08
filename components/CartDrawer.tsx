"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatRupiah, getBean } from "@/lib/beans";
import { useModalBehaviour } from "@/lib/useLockBody";
import { useCart } from "./CartContext";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const cart = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const [ordered, setOrdered] = useState(false);

  function close() {
    cart.close();
    setOrdered(false);
  }

  useModalBehaviour(cart.isOpen, panelRef, close);

  function placeOrder() {
    cart.clear();
    setOrdered(true);
  }

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <motion.div
          key="latar"
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        />
      )}
      {cart.isOpen && (
        <motion.div
          key="panel"
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-keranjang"
          data-lenis-prevent
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 380, damping: 40 }}
        >
          <div className={styles.head}>
            <h2 id="judul-keranjang">Keranjang</h2>
            <button type="button" className={styles.close} onClick={close}>
              Tutup
            </button>
          </div>

          {ordered ? (
            <div className={styles.empty} role="status">
              <p className={styles.emptyTitle}>Pesanan demo tercatat.</p>
              <p>
                Lereng adalah merek fiktif, jadi tidak ada pembayaran atau pengiriman. Di situs sungguhan, langkah ini
                membuka halaman pembayaran.
              </p>
            </div>
          ) : cart.items.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Keranjang masih kosong.</p>
              <p>Pilih kopi dari daftar, lalu tekan Tambah.</p>
            </div>
          ) : (
            <>
              <ul className={styles.list}>
                <AnimatePresence initial={false}>
                  {cart.items.map((item) => {
                    const bean = getBean(item.id);
                    if (!bean) return null;
                    return (
                      <motion.li
                        key={item.id}
                        layout
                        className={styles.item}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className={styles.itemInner}>
                          <div>
                            <p className={styles.name}>{bean.name}</p>
                            <p className={styles.meta}>
                              {bean.process}, {bean.weight} g
                            </p>
                          </div>
                          <div className={styles.qty} role="group" aria-label={`Jumlah ${bean.name}`}>
                            <button
                              type="button"
                              onClick={() => cart.setQty(item.id, item.qty - 1)}
                              aria-label={item.qty === 1 ? `Hapus ${bean.name}` : `Kurangi ${bean.name}`}
                            >
                              −
                            </button>
                            <span aria-live="polite">{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => cart.setQty(item.id, item.qty + 1)}
                              aria-label={`Tambah ${bean.name}`}
                            >
                              +
                            </button>
                          </div>
                          <p className={styles.price}>{formatRupiah(bean.price * item.qty)}</p>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>

              <div className={styles.foot}>
                <p className={styles.total}>
                  <span>Total</span>
                  <span>{formatRupiah(cart.total)}</span>
                </p>
                <p className={styles.note}>Ongkir dihitung saat pembayaran. Situs ini demo portofolio.</p>
                <motion.button
                  type="button"
                  className={styles.checkout}
                  onClick={placeOrder}
                  whileTap={{ scale: 0.97 }}
                >
                  Pesan sekarang
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
