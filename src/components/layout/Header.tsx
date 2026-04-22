"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Search, Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "خانه", href: "/" },
  { label: "سیاسی", href: "/category/politics" },
  { label: "اقتصادی", href: "/category/economy" },
  { label: "ورزشی", href: "/category/sports" },
  { label: "فناوری", href: "/category/tech" },
  { label: "جهان", href: "/category/world" },
  { label: "پخش زنده", href: "/live" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  // ─── ورود اولیه هدر ───────────────────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power4.out" },
    )
      .fromTo(
        logoRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4",
      )
      .fromTo(
        ".nav-link-item",
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.07,
          ease: "power2.out",
        },
        "-=0.3",
      )
      .fromTo(
        ".header-action",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(2)",
        },
        "-=0.3",
      );

    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── انیمیشن منوی موبایل ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (menuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" },
      );
      gsap.fromTo(
        ".mobile-link-item",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.1,
        },
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [menuOpen]);

  // ─── hover روی لینک‌ها ────────────────────────────────────────────────────
  const handleLinkHover = (
    e: React.MouseEvent<HTMLAnchorElement>,
    enter: boolean,
  ) => {
    gsap.to(e.currentTarget, {
      y: enter ? -2 : 0,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  // ─── hover روی دکمه‌ها ────────────────────────────────────────────────────
  const handleBtnHover = (
    e: React.MouseEvent<HTMLButtonElement>,
    enter: boolean,
  ) => {
    gsap.to(e.currentTarget, {
      scale: enter ? 1.15 : 1,
      duration: 0.2,
      ease: "back.out(2)",
    });
  };

  return (
    <>
      {/* گلو اثر پس‌زمینه */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

      <header
        ref={headerRef}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "shadow-[0_8px_32px_rgba(220,38,38,0.15)]"
            : "shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
        }`}
        style={{
          background: scrolled ? "rgba(10,10,10,0.75)" : "rgba(8,8,8,0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(220,38,38,0.25)",
        }}
      >
        {/* لایه شیشه‌ای درخشان */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, rgba(220,38,38,0.04) 100%)",
          }}
        />

        {/* خط نورانی بالا */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(220,38,38,0.6), rgba(255,255,255,0.3), rgba(220,38,38,0.6), transparent)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* لوگو */}
          <Link
            ref={logoRef}
            href="/"
            className="flex items-center gap-2 group"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.05,
                duration: 0.2,
                ease: "back.out(2)",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
            }}
          >
            {/* آیکون */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                boxShadow:
                  "0 0 20px rgba(220,38,38,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <Zap
                size={18}
                className="text-white relative z-10"
                fill="white"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>

            {/* متن لوگو */}
            <div className="flex flex-col leading-none">
              <span
                className="text-2xl font-black tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f1f1f1 50%, #dc2626 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                مدار
              </span>
              <span className="text-[10px] text-red-400 font-medium tracking-widest">
                NEWS AGENCY
              </span>
            </div>
          </Link>

          {/* ناوبری دسکتاپ */}
          <nav ref={navRef} className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-item relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 group"
                style={{
                  color:
                    activeLink === link.href
                      ? "#ffffff"
                      : "rgba(255,255,255,0.7)",
                }}
                onClick={() => setActiveLink(link.href)}
                onMouseEnter={(e) => {
                  handleLinkHover(e, true);
                  if (activeLink !== link.href) {
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  handleLinkHover(e, false);
                  if (activeLink !== link.href) {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.7)";
                  }
                }}
              >
                {/* پس‌زمینه hover */}
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    background: "rgba(220,38,38,0.15)",
                    border: "1px solid rgba(220,38,38,0.2)",
                  }}
                />

                {/* نشانگر لینک فعال */}
                {activeLink === link.href && (
                  <span
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(220,38,38,0.3), rgba(153,27,27,0.2))",
                      border: "1px solid rgba(220,38,38,0.4)",
                      boxShadow:
                        "0 0 12px rgba(220,38,38,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                  />
                )}

                <span className="relative z-10">{link.label}</span>

                {/* خط زیر لینک فعال */}
                {activeLink === link.href && (
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500"
                    style={{ boxShadow: "0 0 6px rgba(220,38,38,0.8)" }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* دکمه‌های سمت راست */}
          <div className="flex items-center gap-2">
            {/* دکمه جستجو */}
            <button
              className="header-action relative p-2.5 rounded-xl transition-all duration-200 group"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                handleBtnHover(e, true);
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(220,38,38,0.2)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(220,38,38,0.4)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 15px rgba(220,38,38,0.3)";
              }}
              onMouseLeave={(e) => {
                handleBtnHover(e, false);
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <Search
                size={18}
                className="text-white/80 group-hover:text-white transition-colors"
              />
            </button>

            {/* دکمه منوی موبایل */}
            <button
              className="header-action md:hidden relative p-2.5 rounded-xl transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              onMouseEnter={(e) => handleBtnHover(e, true)}
              onMouseLeave={(e) => handleBtnHover(e, false)}
            >
              {menuOpen ? (
                <X size={18} className="text-white" />
              ) : (
                <Menu size={18} className="text-white" />
              )}
            </button>
          </div>
        </div>

        {/* منوی موبایل */}
        <div
          ref={mobileMenuRef}
          className="md:hidden overflow-hidden"
          style={{
            height: 0,
            opacity: 0,
            borderTop: "1px solid rgba(220,38,38,0.2)",
            background: "rgba(8,8,8,0.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-link-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  color:
                    activeLink === link.href
                      ? "#ffffff"
                      : "rgba(255,255,255,0.7)",
                  background:
                    activeLink === link.href
                      ? "linear-gradient(135deg, rgba(220,38,38,0.25), rgba(153,27,27,0.15))"
                      : "transparent",
                  border:
                    activeLink === link.href
                      ? "1px solid rgba(220,38,38,0.3)"
                      : "1px solid transparent",
                }}
                onClick={() => {
                  setActiveLink(link.href);
                  setMenuOpen(false);
                }}
                onMouseEnter={(e) => {
                  if (activeLink !== link.href) {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(220,38,38,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeLink !== link.href) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.7)";
                  }
                }}
              >
                {activeLink === link.href && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"
                    style={{ boxShadow: "0 0 8px rgba(220,38,38,0.8)" }}
                  />
                )}
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
