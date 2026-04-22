// components/archive/ArchiveCard.tsx
"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Eye, Clock, Play } from "lucide-react";
import { ArchivedStream } from "@/types/news";
import ScrollReveal from "../animations/ScrollReveal";

const categoryColors: Record<string, string> = {
  politics: "bg-red-600",
  tech: "bg-black",
  sports: "bg-red-800",
  economy: "bg-gray-900",
  world: "bg-red-700",
};

export default function ArchiveCard({
  stream,
  delay = 0,
}: {
  stream: ArchivedStream;
  delay?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      boxShadow: "0 20px 40px rgba(220,38,38,0.15)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(playRef.current, {
      scale: 1.1,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(playRef.current, {
      scale: 1,
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
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Link href={`/archive/${stream.id}`}>
          {/* تصویر */}
          <div className="relative h-52 overflow-hidden">
            <Image
              src={stream.thumbnail}
              alt={stream.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* دکمه پلی */}
            <div
              ref={playRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                <Play size={28} className="text-white fill-white mr-1" />
              </div>
            </div>

            {/* برچسب دسته‌بندی */}
            <span
              className={`absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full ${
                categoryColors[stream.category] || "bg-gray-800"
              }`}
            >
              {stream.category}
            </span>

            {/* مدت زمان */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded">
              {stream.duration} دقیقه
            </div>
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
                {new Date(stream.recordedAt).toLocaleDateString("fa-IR")}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} className="text-red-500" />
                {stream.views.toLocaleString("fa-IR")} بازدید
              </span>
            </div>
          </div>
        </Link>
      </div>
    </ScrollReveal>
  );
}
