// components/video/VideoPlayer.tsx
"use client";

import { useState } from "react";
import { LiveStream, ArchivedStream } from "@/types/news";
import { Maximize, Volume2, Pause } from "lucide-react";
import PlayButton from "@/components/ui/PlayButton";

type VideoPlayerProps =
  | { type: "live"; data: LiveStream }
  | { type: "archive"; data: ArchivedStream };

export default function VideoPlayer({ type, data }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const sourceUrl = type === "live" ? data.streamUrl : data.videoUrl;
  const embedUrl = data.embedUrl;

  // می‌تونید از video.js، hls.js یا پلیر سفارشی استفاده کنید
  return (
    <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
      {/* اگر embed داره از iframe استفاده کن */}
      {embedUrl && !isPlaying ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* تصویر thumbnail */}
          <img
            src={data.thumbnail}
            alt={data.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />

          {/* دکمه پخش */}
          <div className="relative z-10">
            <PlayButton size={64} onClick={() => setIsPlaying(true)} />
          </div>

          {/* نشان زنده */}
          {type === "live" && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-teal-600">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold">زنده</span>
            </div>
          )}
        </div>
      ) : (
        /* حالت پخش */
        <div className="relative w-full h-full">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />

          {/* کنترل‌های سفارشی می‌تونید اضافه کنید */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 dark:from-black/90 to-transparent">
            <div className="flex items-center justify-between text-white">
              <button className="p-1 hover:bg-white/20 rounded">
                <Pause size={18} />
              </button>
              <div className="flex items-center gap-3">
                <button className="p-1 hover:bg-white/20 rounded">
                  <Volume2 size={18} />
                </button>
                <button className="p-1 hover:bg-white/20 rounded">
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* اطلاعات ویدیو */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {type === "archive" && (
          <span className="px-2 py-1 rounded bg-black/70 text-white text-xs">
            {data.duration} دقیقه
          </span>
        )}
        {type === "live" && data.viewers > 0 && (
          <span className="px-2 py-1 rounded bg-black/70 text-white text-xs">
            {data.viewers.toLocaleString()} بیننده
          </span>
        )}
      </div>
    </div>
  );
}
