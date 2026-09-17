import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "ماركت بليس أثاث دمياط | أكبر تجمع لمعارض وصناع الأثاث في مصر",
  description: "تسوق وشاهد ريلز وتصاميم أرقى غرف النوم والصالونات والمطابخ المصنعة يدوياً من خشب الزان بدمياط، أو اطلب تفصيل مخصص مباشرة من الورش مع ضمان الجودة 72 ساعة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
