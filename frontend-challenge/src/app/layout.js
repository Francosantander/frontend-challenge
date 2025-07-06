import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/globals.scss";
import Topbar from "@/components/layout/Topbar/Topbar";
import MSWProvider from "@/components/layout/MSWProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MercadoLibre - Buscar productos",
  description: "Encuentra productos, marcas y más en MercadoLibre",
  keywords: "productos, compras, mercadolibre, búsqueda",
  robots: "index, follow",
  openGraph: {
    title: "MercadoLibre - Buscar productos",
    description: "Encuentra productos, marcas y más en MercadoLibre",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MSWProvider />
        <Topbar />
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
