// app/live/page.tsx
import LiveCard from "@/components/live/LiveCard";
import { liveApi } from "@/lib/api";
import { Radio } from "lucide-react";

export default async function LivePage() {
  let liveStreams;
  try {
    liveStreams = await liveApi.getAll(1, 20);
  } catch {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-center py-20 text-gray-500 text-lg">
          ⚠️ خطا در دریافت پخش‌های زنده
        </p>
      </div>
    );
  }

  const allStreams = liveStreams.data || [];
  const liveNow = allStreams.filter((s) => s.isLive || s.status === "live");
  const upcoming = allStreams.filter((s) => !s.isLive && s.status !== "live");

  return (
    <div className="space-y-12">
      {/* بقیه کد صفحه بدون تغییر */}

      {/* پخش‌های زنده الان */}
      {liveNow.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveNow.map((stream, i) => (
              <LiveCard key={stream.id || i} stream={stream} />
            ))}
          </div>
        </section>
      )}

      {/* برنامه‌های آینده */}
      {upcoming.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((stream, i) => (
              <LiveCard key={stream.id || i} stream={stream} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
