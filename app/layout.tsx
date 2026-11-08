import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "@fontsource-variable/unbounded/wght.css";
import "lenis/dist/lenis.css";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Lereng | Robusta Dampit",
  description:
    "Lereng menyangrai robusta dari kebun-kebun kecil di Dampit, lereng Semeru. Disangrai tiap Selasa di Malang. (Merek fiktif untuk portofolio.)",
};

export const viewport: Viewport = {
  themeColor: "#f3eee7",
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
