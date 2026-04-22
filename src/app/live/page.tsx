// app/live/page.tsx
import LiveCard from "@/components/live/LiveCard";
import { mockLiveStreams } from "@/lib/mockLiveData";
import TextReveal from "@/components/animations/TextReveal";
import { Radio } from "lucide-react";

export default function LivePage() {
  const liveNow = mockLiveStreams.filter((s) => s.isLive);
  const upcoming = mockLiveStreams.filter((s) => !s.isLive);

  return (
    <div className="space-y-12">
      {/* پخش زنده */}
      {liveNow.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  boxShadow:
                    "0 0 20px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <Radio size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black leading-none text-gray-900">
                  پخش زنده
                </h2>
                <p className="text-[11px] text-red-500 font-semibold tracking-widest mt-0.5">
                  LIVE STREAMS
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(220,38,38,0.08)",
                border: "1px solid rgba(220,38,38,0.25)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full bg-red-500 animate-pulse"
                style={{ boxShadow: "0 0 6px rgba(220,38,38,0.7)" }}
              />
              <span className="text-xs text-red-600 font-semibold">
                {mockLiveStreams.filter((s) => s.isLive).length} زنده
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveNow.map((stream, i) => (
              <LiveCard key={stream.id} stream={stream} delay={i * 0.1} />
            ))}
          </div>
        </section>
      )}

      {/* به زودی */}
      {upcoming.length > 0 && (
        <section>
          <TextReveal
            text="📅 برنامه‌های آینده"
            className="text-2xl font-bold mb-6 text-gray-900"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((stream, i) => (
              <LiveCard key={stream.id} stream={stream} delay={i * 0.1} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
