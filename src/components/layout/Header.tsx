"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // ★ اضافه کردن usePathname
import { gsap } from "gsap";
import {
  Search,
  Menu,
  X,
  Zap,
  Home,
  Radio,
  ChevronRight,
  ChevronLeft,
  BookA,
  LayoutGrid,
  Sun,
  Moon,
  FileText,
  HelpCircle,
  Info,
  Mail,
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

const navLinks = [
  { label: "صفحه نخست", href: "/", icon: Home },
  { label: "پخش زنده", href: "/live", icon: Radio },
  { label: "آرشیو", href: "/archive", icon: BookA },
  { label: "دسته بندی ها", href: "/category", icon: LayoutGrid },
];

const footerLinks = [
  { label: "حالت شب", href: "#", isThemeToggle: true },
  { label: "قوانین و مقررات", href: "/rules", icon: FileText },
  { label: "سوالات متداول", href: "/faq", icon: HelpCircle },
  { label: "درباره ما", href: "/about", icon: Info },
  { label: "ارتباط با ما", href: "/contact", icon: Mail },
];

const socialLinks = [
  {
    name: "ایتا",
    icon: "https://static.ketab.tv/ketab-tv-static/front/images/svg/eita.svg",
    href: "#",
  },
  {
    name: "بله",
    icon: "https://static.ketab.tv/ketab-tv-static/front/images/svg/bale.svg",
    href: "#",
  },
  {
    name: "آپارات",
    icon: "https://static.ketab.tv/ketab-tv-static/front/images/svg/aparat.svg",
    href: "#",
  },
  {
    name: "شاد",
    icon: "https://static.ketab.tv/ketab-tv-static/front/images/svg/shad.svg",
    href: "#",
  },
  {
    name: "روبیکا",
    icon: "https://static.ketab.tv/ketab-tv-static/front/images/svg/roobika.svg",
    href: "#",
  },
  {
    name: "یوتیوب",
    icon: "https://static.ketab.tv/ketab-tv-static/front/images/svg/yt.svg",
    href: "#",
  },
  {
    name: "تلگرام",
    icon: "https://static.ketab.tv/ketab-tv-static/front/images/svg/telegram.svg",
    href: "#",
  },
  {
    name: "اینستاگرام",
    icon: "https://static.ketab.tv/ketab-tv-static/front/images/svg/instagram.svg",
    href: "#",
  },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname(); // ★ گرفتن مسیر فعلی

  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(pathname); // ★ شروع با مسیر فعلی
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ★ آپدیت activeLink وقتی pathname تغییر کنه
  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
    );

    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        sidebarRef.current,
        { x: "100%" },
        { x: 0, duration: 0.4, ease: "power3.out" },
      );
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(sidebarRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [menuOpen]);

  useEffect(() => {
    const sidebarWidth = sidebarCollapsed ? 80 : 280;
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${sidebarWidth}px`,
    );
  }, [sidebarCollapsed]);

  const headerHeight = scrolled ? 64 : 80;

  // ★ تابع تشخیص active بودن لینک (برای مسیرهای nested مثل /live/123)
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* نوار بالا - لوگو و سرچ */}
      <div
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
        style={{
          backdropFilter: "blur(20px)",
          boxShadow: scrolled
            ? "0 4px 20px rgba(0,0,0,0.08)"
            : "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        {/* پس‌زمینه با dark: */}
        <div
          className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 border-b border-black/5 dark:border-white/10"
          style={{
            boxShadow: scrolled ? undefined : undefined,
          }}
        />

        <div className="relative max-w-7xl mx-3 pl-4 flex items-center gap-4">
          {/* لوگو و دکمه جمع/باز کردن */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* دکمه جمع/باز کردن سایدبار - فقط دسکتاپ */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-lg transition-colors items-center justify-center
                hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title={sidebarCollapsed ? "باز کردن منو" : "بستن منو"}
            >
              {sidebarCollapsed ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
                }}
              >
                <Zap size={20} className="text-white" fill="white" />
              </div>

              <div className="hidden sm:flex flex-col leading-none text-right">
                <span className="text-2xl font-black text-gray-900 dark:text-white">
                  مدار
                </span>
                <span className="text-[9px] font-medium tracking-widest text-black dark:text-gray-300">
                  NEWS AGENCY
                </span>
              </div>
            </Link>
          </div>

          {/* نوار جستجو */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400"
              />
              <input
                type="text"
                placeholder="جستجو در اخبار، دسته‌بندی‌ها و ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-xl border transition-all text-sm
                  bg-gray-50/80 dark:bg-gray-800/80 
                  border-gray-200 dark:border-gray-700 
                  text-gray-900 dark:text-white 
                  placeholder-gray-400 dark:placeholder-gray-400
                  focus:border-red-500 focus:ring-red-500/20
                  focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* دکمه منو موبایل */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2.5 rounded-lg transition-colors flex-shrink-0
              hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* فاصله برای محتوا */}
      <div style={{ height: `${headerHeight}px` }} />

      {/* Sidebar راست - دسکتاپ */}
      <aside
        className="hidden lg:block fixed right-0 z-40
          bg-white/98 dark:bg-gray-900/98
          border-l border-black/5 dark:border-white/10"
        style={{
          top: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
          width: sidebarCollapsed ? "80px" : "280px",
          backdropFilter: "blur(20px)",
          boxShadow: isDark
            ? "-4px 0 24px rgba(0,0,0,0.3)"
            : "-4px 0 24px rgba(0,0,0,0.1)",
          transition: "width 0.3s ease, top 0.3s ease",
        }}
      >
        <div className="flex flex-col ">
          {/* لینک‌های منو */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.href); // ★ استفاده از تابع جدید

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveLink(link.href)}
                  className={`flex items-center gap-3 px-4 py-3 mx-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-[#F05A28]/20 text-black dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  title={sidebarCollapsed ? link.label : undefined}
                >
                  <Icon
                    size={22}
                    className={`flex-shrink-0 ${
                      isActive
                        ? "text-[#F05A28]"
                        : "text-[#F05A28]/50 group-hover:text-[#F05A28]"
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="font-medium text-sm">{link.label}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <span className="mr-auto w-1.5 h-1.5 rounded-full bg-[#F05A28]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* فوتر با خط نارنجی */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div
              className="h-0.5 bg-gradient-to-l from-[#F05A28] to-transparent"
              style={{ width: "100%" }}
            />
            <div className="py-4 px-3 space-y-1">
              {footerLinks.map((link) => {
                if (link.isThemeToggle) {
                  return (
                    <button
                      key="theme-toggle"
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm
                        text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      title={isDark ? "حالت روز" : "حالت شب"}
                    >
                      {isDark ? (
                        <Sun size={22} className="text-[#F05A28]" />
                      ) : (
                        <Moon size={22} className="text-[#F05A28]" />
                      )}
                      {!sidebarCollapsed && (
                        <span>{isDark ? "حالت روز" : "حالت شب"}</span>
                      )}
                    </button>
                  );
                }

                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm
                      text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    title={sidebarCollapsed ? link.label : undefined}
                  >
                    {Icon && (
                      <Icon
                        size={22}
                        className="text-[#F05A28] flex-shrink-0"
                      />
                    )}
                    {!sidebarCollapsed && <span>{link.label}</span>}
                  </Link>
                );
              })}
            </div>
            <div
              className="h-0.5 bg-gradient-to-l from-[#F05A28] to-transparent"
              style={{ width: "100%" }}
            />
            {/* ایکون‌های شبکه‌های اجتماعی */}
            <div className="px-4 p-4 ">
              <div
                className={`grid gap-2 ${
                  sidebarCollapsed
                    ? "grid-cols-1 place-items-center"
                    : "grid-cols-4"
                }`}
              >
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2  rounded-lg transition-all
                      hover:bg-gray-50 dark:hover:bg-gray-800 group"
                    title={social.name}
                  >
                    <div className="relative w-7 h-7">
                      <Image
                        src={social.icon}
                        alt={social.name}
                        fill
                        className="object-contain transition-transform group-hover:scale-110"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay موبایل */}
      <div
        ref={overlayRef}
        className="lg:hidden fixed inset-0 bg-black/50 z-40 opacity-0 pointer-events-none"
        style={{ display: menuOpen ? "block" : "none" }}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar موبایل */}
      <aside
        ref={sidebarRef}
        className="lg:hidden fixed top-0 right-0 h-full z-50 translate-x-full w-[280px]
          bg-white/98 dark:bg-gray-900/98
          border-l border-black/5 dark:border-white/10"
        style={{
          backdropFilter: "blur(20px)",
          boxShadow: isDark
            ? "-4px 0 24px rgba(0,0,0,0.3)"
            : "-4px 0 24px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex flex-col ">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              منو
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg transition-colors
                hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.href); // ★ استفاده از تابع جدید

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setActiveLink(link.href);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-[#F05A28]/20 text-black dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon
                    size={22}
                    className={`flex-shrink-0 ${
                      isActive
                        ? "text-[#F05A28]"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    }`}
                  />
                  <span className="font-medium text-sm">{link.label}</span>
                  {isActive && (
                    <span className="mr-auto w-1.5 h-1.5 rounded-full bg-[#F05A28]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* فوتر موبایل */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div
              className="h-0.5 bg-gradient-to-l from-[#F05A28] to-transparent"
              style={{ width: "100%" }}
            />
            <div className="py-4 px-2 space-y-1">
              {footerLinks.map((link) => {
                if (link.isThemeToggle) {
                  return (
                    <button
                      key="theme-toggle"
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm
                        text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {isDark ? (
                        <Sun size={22} className="text-[#F05A28]" />
                      ) : (
                        <Moon size={22} className="text-[#F05A28]" />
                      )}
                      <span>{isDark ? "حالت روز" : "حالت شب"}</span>
                    </button>
                  );
                }

                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm
                      text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {Icon && <Icon size={22} className="text-[#F05A28]" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* ایکون‌های شبکه‌های اجتماعی موبایل */}
            <div className="px-2 pb-4">
              <div className="grid grid-cols-4 gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2 rounded-lg transition-all
                      hover:bg-gray-50 dark:hover:bg-gray-800 group"
                    title={social.name}
                  >
                    <div className="relative w-7 h-7">
                      <Image
                        src={social.icon}
                        alt={social.name}
                        fill
                        className="object-contain transition-transform group-hover:scale-110"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
