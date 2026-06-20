// components/live/LiveCard.tsx
import { MyImage } from "@/components/ui/MyImage";
import Link from "next/link";
import { Eye, Clock } from "lucide-react";
import { LiveStream } from "@/types/news";
import CategoryBadge from "@/components/common/CategoryBadge";

export default function LiveCard({
  stream,
}: {
  stream: LiveStream;
}) {
  const isLiveNow = stream.isLive;
  const borderClass = isLiveNow
    ? "border-[#1099a6] shadow-[0_0_20px_rgba(16,153,166,0.15)]"
    : "border-gray-100 dark:border-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.08)]";
  const bgClass = isLiveNow ? "dark:bg-gray-800/95" : "dark:bg-gray-800";

  return (
    <div className={`group ${bgClass} rounded-2xl overflow-hidden ${borderClass} cursor-pointer relative hover:shadow-[0_20px_40px_rgba(16,153,166,0.2)] transition-all duration-300 h-full flex flex-col`}>
      <Link href={`/live/${stream.id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <MyImage
            src={stream.thumbnail || "/assets/images/png/test.jpg"}
            alt={stream.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {isLiveNow && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1099a6]/20 to-transparent" />
          )}

          {stream.category && (
            <div className="absolute top-3 right-3 z-20">
              <CategoryBadge category={stream.category} variant="solid" size="sm" />
            </div>
          )}

          {isLiveNow && (
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-red-600/30">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                زنده
              </div>
            </div>
          )}

          {!isLiveNow && stream.status === "upcoming" && (
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                به زودی
              </div>
            </div>
          )}

          {isLiveNow && (
            <div className="absolute bottom-3 left-3 z-20 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Eye size={14} className="text-red-400" />
              {stream.viewers.toLocaleString("fa-IR")} نفر
            </div>
          )}
        </div>

        <div className={`p-5 flex-1 flex flex-col justify-between ${isLiveNow ? "bg-[#1099a6]/5" : ""}`}>
          <div className="flex items-start gap-2 mb-2">
            {isLiveNow && (
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse mt-1.5 flex-shrink-0 shadow-lg shadow-red-600/50" />
            )}
            <h3 className={`font-bold text-lg leading-snug line-clamp-2 transition-colors duration-200 ${isLiveNow ? "text-[#1099a6] dark:text-[#1099a6]" : "text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-[#1099a6]"}`}>
              {stream.title}
            </h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {stream.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-teal-500" />
              {new Date(stream.startTime).toLocaleTimeString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isLiveNow ? (
              <span className="text-red-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                زنده
              </span>
            ) : stream.status === "upcoming" ? (
              <span className="text-teal-500 font-semibold">به زودی</span>
            ) : (
              <span className="text-gray-400">پایان یافته</span>
            )}
          </div>
        </div>
      </Link>

      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1099a6] to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isLiveNow ? "scale-x-100" : ""}`} />
    </div>
  );
}