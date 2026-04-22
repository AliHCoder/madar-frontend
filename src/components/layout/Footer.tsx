import Link from "next/link";
import ScrollReveal from "../animations/ScrollReveal";

const footerLinks = {
  دسته‌بندی‌ها: [
    { label: "سیاسی", href: "/category/politics" },
    { label: "اقتصادی", href: "/category/economy" },
    { label: "ورزشی", href: "/category/sports" },
    { label: "فناوری", href: "/category/tech" },
    { label: "جهان", href: "/category/world" },
  ],
  خبرگزاری: [
    { label: "درباره ما", href: "/about" },
    { label: "تماس با ما", href: "/contact" },
    { label: "تبلیغات", href: "/advertise" },
    { label: "کارنامه", href: "/careers" },
  ],
  حقوقی: [
    { label: "حریم خصوصی", href: "/privacy" },
    { label: "قوانین استفاده", href: "/terms" },
    { label: "کوکی‌ها", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <h2 className="text-white text-2xl font-extrabold mb-4">مدار</h2>
              <p className="text-sm leading-relaxed text-gray-400">
                جدیدترین و مهم‌ترین اخبار ایران و جهان را دنبال کنید. ما متعهد
                به ارائه اطلاعات دقیق و به‌روز هستیم.
              </p>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-white font-bold mb-4">{title}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} خبرگزاری. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              RSS
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              توییتر
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              اینستاگرام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
