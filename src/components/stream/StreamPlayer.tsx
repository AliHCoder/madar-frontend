"use client";

import { useRef, useEffect, useState } from "react";
import { MyImage } from "@/components/ui/MyImage";
import { gsap } from "gsap";
import {
  Eye,
  Clock,
  Calendar,
  Play,
  Users,
  Tag,
  Maximize2,
} from "lucide-react";
import { LiveStream, ArchivedStream } from "@/types/news";
import CategoryBadge from "@/components/common/CategoryBadge";

export default function StreamPlayer({
  stream,
  isLive,
}: {
  stream: LiveStream | ArchivedStream;
  isLive: boolean;
}) {
  const playerRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Determine stream type once
  const liveStream = isLive ? (stream as LiveStream) : null;
  const archivedStream = !isLive ? (stream as ArchivedStream) : null;
  const hasPlayedEntrance = useRef(false);

  // Cleanup any lingering tweens when component unmounts
  useEffect(() => {
    return () => {
      if (pulseRef.current) gsap.killTweensOf(pulseRef.current);
      if (playerRef.current) gsap.killTweensOf(playerRef.current);
    };
  }, []);

  // Main animation effect – runs only when live status changes
  useEffect(() => {
    // Pulse animation for live streams
    if (isLive && liveStream?.isLive && pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 1.4,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: "power1.out",
      });
    }

    // Entrance animation – run only once per component mount
    if (!hasPlayedEntrance.current && playerRef.current) {
      gsap.from(playerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });
      hasPlayedEntrance.current = true;
    }
  }, [isLive, liveStream?.isLive]);

  return (
    <div ref={playerRef} className="space-y-6">
      {/* ─── پلیر ویدیو ─── */}
      <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl dark:shadow-gray-900/50 bg-black">
        {/* حالت پخش نشده - نمایش thumbnail */}
        {!isPlaying && (
          <>
            <MyImage
              src={stream.thumbnail}
              alt={stream.title}
              fill
              priority
              className={`object-cover transition-all duration-700 ${
                imageLoaded ? "opacity-40 scale-105" : "opacity-0 scale-100"
              }`}
              onLoad={() => setImageLoaded(true)}
            />

            {/* overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-transparent" />

            {/* دکمه پخش مرکزی */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(true)}
                className="group relative"
              >
                {/* حلقه بیرونی */}
                <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-white/30 animate-ping" />
                {/* دکمه اصلی */}
                <div className="relative w-20 h-20 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-red-500/50">
                  <Play
                    size={32}
                    className="text-white ml-1 transition-transform group-hover:scale-110"
                    fill="white"
                  />
                </div>
              </button>
            </div>

            {/* ─── نشان لایو (فقط برای پخش زنده فعال) ─── */}
            {liveStream?.isLive && (
              <div className="absolute top-6 left-6 z-20">
                <div className="relative">
                  <div className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 relative z-10 backdrop-blur-sm">
                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                    پخش زنده
                  </div>
                  <div
                    ref={pulseRef}
                    className="absolute inset-0 bg-red-600 rounded-full opacity-70"
                  />
                </div>
              </div>
            )}

            {/* ─── نشان upcoming (برای پخش‌های آینده) ─── */}
            {liveStream &&
              !liveStream.isLive &&
              liveStream.status === "upcoming" && (
                <div className="absolute top-6 left-6 z-20">
                  <div className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm">
                    <Clock size={14} />
                    به زودی
                  </div>
                </div>
              )}

            {/* ─── نشان ended (برای پخش‌های تمام شده) ─── */}
            {liveStream && liveStream.status === "ended" && (
              <div className="absolute top-6 left-6 z-20">
                <div className="bg-gray-800 dark:bg-gray-700 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm">
                  پایان یافته
                </div>
              </div>
            )}

            {/* ─── اطلاعات پایین تصویر ─── */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
              {liveStream?.isLive && (
                <div className="bg-black/70 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                  <Eye size={16} className="text-red-400" />
                  {liveStream.viewers.toLocaleString("fa-IR")} بیننده
                </div>
              )}

              {archivedStream && (
                <div className="bg-black/70 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                  <Clock size={16} className="text-red-400" />
                  {archivedStream.duration} دقیقه
                </div>
              )}
            </div>
          </>
        )}
        {/* ─── حالت پخش (وقتی کاربر play زد) ─── */}
        {isPlaying && (
          <div className="w-full h-full bg-black">
            {stream.embedUrl ? (
              <iframe
                src={stream.embedUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                src={isLive ? liveStream?.streamUrl : archivedStream?.videoUrl}
                className="w-full h-full"
                controls
                autoPlay
                playsInline
                muted // <--- این خط حتما باید اضافه شود تا مرورگر اجازه پخش خودکار بدهد
              />
            )}
          </div>
        )}
      </div>

      {/* ─── اطلاعات استریم ─── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-8 shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-800">
        {/* هدر با کتگوری */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-relaxed">
              {stream.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed">
              {stream.description}
            </p>
          </div>

          {/* CategoryBadge */}
          <CategoryBadge category={stream.category} variant="solid" />
        </div>

        {/* ─── Quality Badge (برای آرشیو) ─── */}
        {archivedStream?.quality && (
          <div className="mb-4">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              <Maximize2 size={12} />
              {archivedStream.quality}
            </span>
          </div>
        )}

        {/* ─── متادیتا ─── */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          {/* اطلاعات لایو */}
          {liveStream && (
            <>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar size={18} className="text-red-500" />
                <span className="text-sm">
                  {liveStream.status === "upcoming" ? "شروع:" : "شروع:"}{" "}
                  {new Date(liveStream.startTime).toLocaleString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {liveStream.isLive && (
                <>
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-red-500" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {liveStream.viewers.toLocaleString("fa-IR")} بیننده فعال
                    </span>
                  </div>
                  {liveStream.chatEnabled && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-semibold">
                      💬 چت زنده فعال
                    </span>
                  )}
                </>
              )}
            </>
          )}

          {/* اطلاعات آرشیو */}
          {archivedStream && (
            <>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar size={18} className="text-red-500" />
                <span className="text-sm">
                  ضبط شده:{" "}
                  {new Date(archivedStream.recordedAt).toLocaleDateString(
                    "fa-IR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock size={18} className="text-red-500" />
                <span className="text-sm">
                  مدت زمان: {archivedStream.duration} دقیقه
                </span>
              </div>
            </>
          )}

          {/* ─── تگ‌ها ─── */}
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Tag size={16} className="text-red-400" />
            <span className="text-sm">{stream.category.slug}</span>
          </div>
        </div>

        {/* ─── هایلایت‌های آرشیو ─── */}
        {archivedStream?.highlights && archivedStream.highlights.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              لحظات مهم
            </h3>
            <div className="space-y-2">
              {archivedStream.highlights.map((highlight, index) => (
                <button
                  key={index}
                  className="w-full text-right px-4 py-2 rounded-lg 
                    dark:bg-gray-800 
                    hover:bg-red-50 dark:hover:bg-red-900/20 
                    text-sm text-gray-700 dark:text-gray-300 
                    hover:text-red-600 dark:hover:text-red-400 
                    transition-colors flex items-center gap-2"
                >
                  <Play size={14} className="text-red-500 flex-shrink-0" />
                  {highlight}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
