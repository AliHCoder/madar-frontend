import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ThemeScript } from "@/providers/theme-script";

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
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased">
        <ThemeProvider>
          <Header />
          <main className=" mx-auto p-6 pb-4 lg:mr-[calc(var(--sidebar-width)+1rem)] transition-all duration-300">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
