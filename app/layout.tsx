import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/big-shoulders-stencil/wght.css";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Lereng | Robusta Dampit",
    template: "%s | Lereng",
  },
  description:
    "Lereng menyangrai robusta dari kebun-kebun kecil di Dampit, lereng Semeru. Disangrai tiap Selasa di Malang. (Merek fiktif untuk portofolio.)",
};

export const viewport: Viewport = {
  themeColor: "#2347a0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <a href="#isi" className="skip-link">
          Lewati ke isi
        </a>
        <Providers>
          <Header />
          <main id="isi">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
