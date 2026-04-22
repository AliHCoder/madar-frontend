// components/stream/StreamPlayer.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Eye, Clock, Calendar, Play } from "lucide-react";
import { LiveStream, ArchivedStream } from "@/types/news";

const categoryColors: Record<string, string> = {
  سیاسی: "bg-red-600",
  فناوری: "bg-black",
  ورزشی: "bg-red-800",
  اقتصادی: "bg-gray-900",
  علم: "bg-blue-700",
  سینما: "bg-purple-700",
  سلامت: "bg-green-700",
};

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

  useEffect(() => {
    if (isLive && (stream as LiveStream).isLive && pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 1.4,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: "power1.out",
      });
    }

    gsap.from(playerRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });
  }, [isLive, stream]);

  const liveStream = isLive ? (stream as LiveStream) : null;
  const archivedStream = !isLive ? (stream as ArchivedStream) : null;

  return (
    <div className="space-y-6">
      {/* پلیر ویدیو */}
      <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl">
        <Image
          src={stream.thumbnail}
          alt={stream.title}
          fill
          priority
          className={`object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-40" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl">
            <Play size={32} className="text-white mr-1" fill="white" />
          </button>
        </div>

        {/* نشان لایو */}
        {liveStream?.isLive && (
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className="relative">
              <div className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 relative z-10">
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
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
        {liveStream?.isLive && (
          <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
            <Eye size={16} className="text-red-400" />
            {liveStream.viewers.toLocaleString("fa-IR")} بیننده
          </div>
        )}
      </div>

      {/* اطلاعات استریم */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-relaxed">
              {stream.title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {stream.description}
            </p>
          </div>
          <span
            className={`${
              categoryColors[stream.category] || "bg-gray-800"
            } text-white text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap mr-4`}
          >
            {stream.category}
          </span>
        </div>

        {/* متا دیتا */}
        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200">
          {liveStream && (
            <>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} className="text-red-500" />
                <span className="text-sm">
                  شروع:{" "}
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
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-red-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {liveStream.viewers.toLocaleString("fa-IR")} بیننده فعال
                  </span>
                </div>
              )}
            </>
          )}

          {archivedStream && (
            <>
              <div className="flex items-center gap-2 text-gray-600">
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
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} className="text-red-500" />
                <span className="text-sm">
                  مدت زمان: {archivedStream.duration} دقیقه
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Eye size={18} className="text-red-500" />
                <span className="text-sm">
                  {archivedStream.views.toLocaleString("fa-IR")} بازدید
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
