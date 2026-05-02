// components/archive/ArchiveCard.tsx
"use client";
import { useRef } from "react";
import { MyImage } from "@/components/ui/MyImage";
import Link from "next/link";
import { gsap } from "gsap";
import { Eye, Clock, Play } from "lucide-react";
import { ArchivedStream } from "@/types/news";
import ScrollReveal from "../animations/ScrollReveal";
import CategoryBadge from "@/components/common/CategoryBadge";

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
        className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 cursor-pointer"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Link href={`/archive/${stream.id}`}>
          <div className="relative h-52 overflow-hidden">
            <MyImage
              src={stream.thumbnail || "/assets/images/png/test.jpg"}
              alt={stream.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* دکمه پلی */}
            <div
              ref={playRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-500 transition-colors">
                <Play size={28} className="text-white fill-white ml-1" />
              </div>
            </div>

            {/* CategoryBadge */}
            <div className="absolute top-3 right-3 z-20">
              <CategoryBadge
                category={stream.category}
                variant="solid"
                size="sm"
              />
            </div>

            {/* مدت زمان */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Clock size={12} />
              {stream.duration} دقیقه
            </div>

            {/* کیفیت */}
            {stream.quality && (
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {stream.quality}
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
              {stream.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
              {stream.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-red-500" />
                {new Date(stream.recordedAt).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </Link>

        {/* افکت hover */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-red-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </ScrollReveal>
  );
}
