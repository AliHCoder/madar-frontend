// components/archive/ArchiveCard.tsx
import { MyImage } from "@/components/ui/MyImage";
import Link from "next/link";
import { Clock } from "lucide-react";
import PlayButton from "@/components/ui/PlayButton";
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
  return (
    <ScrollReveal delay={delay} direction="up">
      <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(16,153,166,0.15)] transition-shadow duration-300 h-full flex flex-col">
        <Link href={`/archive/${stream.id}`} className="flex-1 flex flex-col">
          <div className="relative aspect-video overflow-hidden">
            <MyImage
              src={stream.thumbnail || "/assets/images/png/test.jpg"}
              alt={stream.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute inset-0 flex items-center justify-center">
              <PlayButton size={64} />
            </div>

            {stream.category && (
              <div className="absolute top-3 right-3 z-20">
                <CategoryBadge category={stream.category} variant="solid" size="sm" />
              </div>
            )}

            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Clock size={12} />
              {stream.duration} دقیقه
            </div>

            {stream.quality && (
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {stream.quality}
              </div>
            )}
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <h3 className="text-gray-900 dark:text-gray-100 font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-[#1099a6] transition-colors duration-200">
              {stream.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
              {stream.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
              {stream.showRecordedAt === true && (
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-teal-500" />
                {new Date(stream.recordedAt).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              )}
            </div>
          </div>
        </Link>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-600 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </ScrollReveal>
  );
}