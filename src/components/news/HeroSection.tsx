"use client";
import { useState } from "react";
import { MyImage } from "@/components/ui/MyImage";
import Link from "next/link";
import { HeroItem } from "@/types/news";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSectionProps {
  topBanners: HeroItem[];
  sideCards: HeroItem[];
  sliderArticles: HeroItem[];
}

export default function HeroSection({
  topBanners,
  sideCards,
  sliderArticles,
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + sliderArticles.length) % sliderArticles.length,
    );
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % sliderArticles.length);

  const active = sliderArticles[currentSlide];

  if (sliderArticles.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-3" dir="ltr">
      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s ease forwards; }
        .animate-slide-left { animation: slideLeft 0.6s ease forwards; }
        .animate-scale-in { animation: scaleIn 0.8s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        .top-banner:nth-child(1) { animation-delay: 0.1s; opacity: 0; }
        .top-banner:nth-child(2) { animation-delay: 0.25s; opacity: 0; }
        .side-card:nth-child(1) { animation-delay: 0.4s; opacity: 0; }
        .side-card:nth-child(2) { animation-delay: 0.55s; opacity: 0; }
      `}</style>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {topBanners.slice(0, 2).map((banner) => (
          <Link
            key={banner.id}
            href={banner.link}
            className="relative h-[100px] rounded-xl overflow-hidden group block"
          >
            <MyImage
              src={banner.image || "/assets/images/png/test.jpg"}
              alt={banner.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex justify-end items-center px-4">
              <h3 className="text-white font-black text-sm text-right leading-snug line-clamp-2">
                {banner.title}
              </h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
          </Link>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-2 gap-3">
        {topBanners.slice(0, 2).map((banner) => (
          <Link
            key={banner.id}
            href={banner.link}
            className="top-banner animate-fade-in relative h-[100px] lg:h-[120px] rounded-xl overflow-hidden group block"
          >
            <MyImage
              src={banner.image || "/assets/images/png/test.jpg"}
              alt={banner.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex justify-end items-center px-4 lg:px-5 gap-3">
              <h3 className="text-white font-black text-sm lg:text-lg xl:text-xl text-right leading-snug line-clamp-2">
                {banner.title}
              </h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-3 h-[400px] sm:h-[450px] md:h-[520px]">
        <div className="hidden md:flex flex-col gap-3 text-right h-full">
          {sideCards.slice(0, 2).map((card) => (
            <Link
              key={card.id}
              href={card.link}
              className="side-card animate-slide-left relative flex-1 rounded-xl overflow-hidden group block"
            >
              <MyImage
                src={card.image || "/assets/images/png/test.jpg"}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
                <h3 className="text-white font-black text-xs lg:text-sm leading-snug line-clamp-2">
                  {card.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="main-slider animate-scale-in relative rounded-xl overflow-hidden group h-full">
          <MyImage
            src={active.image || "/assets/images/png/test.jpg"}
            alt={active.title}
            fill
            className="object-cover transition-all duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 to-transparent" />

          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
          >
            <ChevronLeft size={16} className="sm:w-5 sm:h-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
          >
            <ChevronRight size={16} className="sm:w-5 sm:h-5 text-white" />
          </button>

          <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 z-10">
            {sliderArticles.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className="transition-all duration-300"
                style={{
                  width: i === currentSlide ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === currentSlide ? "#FF5722" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
            <p className="text-gray-300 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">
              {active.author}
            </p>
            <Link href={active.link}>
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl text-right font-black leading-tight mb-2 sm:mb-4 max-w-2xl hover:text-orange-300 transition-colors duration-300 cursor-pointer">
                {active.title}
              </h2>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:hidden">
        {sideCards.slice(0, 2).map((card) => (
          <Link
            key={card.id}
            href={card.link}
            className="relative h-[150px] rounded-xl overflow-hidden group block"
          >
            <MyImage
              src={card.image || "/assets/images/png/test.jpg"}
              alt={card.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-white font-bold text-xs leading-snug line-clamp-2">
                {card.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
