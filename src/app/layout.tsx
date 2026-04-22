import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import "./globals.css";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "خبرگزاری | آخرین اخبار مدار",
  description: "جدیدترین اخبار ایران و جهان",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-white text-gray-900 antialiased">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
