import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "GeoMark - GPS Camera",
  description: "Фото с GPS-координатами. Загружайте фото, смотрите на карте, делитесь ссылками.",
  keywords: ["GPS", "фото", "камера", "координаты", "карта", "геолокация"],
  openGraph: {
    title: "GeoMark - GPS Camera",
    description: "Фото с GPS-координатами. Загружайте фото, смотрите на карте, делитесь ссылками.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
