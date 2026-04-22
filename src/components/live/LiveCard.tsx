// components/live/LiveCard.tsx
"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Eye, Clock } from "lucide-react";
import { LiveStream } from "@/types/news";
import ScrollReveal from "../animations/ScrollReveal";

const categoryColors: Record<string, string> = {
  politics: "bg-red-600",
  tech: "bg-black",
  sports: "bg-red-800",
  economy: "bg-gray-900",
  world: "bg-red-700",
};

export default function LiveCard({
  stream,
  delay = 0,
}: {
  stream: LiveStream;
  delay?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stream.isLive && pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 1.4,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: "power1.out",
      });
    }
  }, [stream.isLive]);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      boxShadow: "0 20px 40px rgba(220,38,38,0.2)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <ScrollReveal delay={delay} direction="up">
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer relative"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Link href={`/live/${stream.id}`}>
          {/* تصویر */}
          <div className="relative h-52 overflow-hidden">
            <Image
              src={stream.thumbnail}
              alt={stream.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* overlay قرمز */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-transparent" />

            {/* برچسب دسته‌بندی */}
            <span
              className={`absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full ${
                categoryColors[stream.category] || "bg-gray-800"
              }`}
            >
              {stream.category}
            </span>

            {/* نشان لایو با نبض */}
            {stream.isLive && (
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <div className="relative">
                  <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 relative z-10">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    پخش زنده
                  </div>
                  <div
                    ref={pulseRef}
                    className="absolute inset-0 bg-red-600 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* تعداد بینندگان */}
            {stream.isLive && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Eye size={14} className="text-red-400" />
                {stream.viewers.toLocaleString("fa-IR")} نفر
              </div>
            )}
          </div>

          {/* محتوا */}
          <div className="p-5">
            <h3 className="text-gray-900 font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
              {stream.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
              {stream.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-red-500" />
                {new Date(stream.startTime).toLocaleTimeString("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {stream.isLive ? (
                <span className="text-red-600 font-bold">در حال پخش</span>
              ) : (
                <span>به زودی</span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </ScrollReveal>
  );
}
