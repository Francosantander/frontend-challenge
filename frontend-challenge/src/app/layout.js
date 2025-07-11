import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/globals.scss";
import MSWProvider from "@/components/layout/MSWProvider";
import ClientLayout from "@/components/layout/ClientLayout";

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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
