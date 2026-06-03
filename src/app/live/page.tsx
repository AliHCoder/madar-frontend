export const dynamic = "force-dynamic";

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
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Radio size={28} className="text-red-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            خطا در دریافت پخش‌های زنده مدار
          </p>
        </div>
      </div>
    );
  }

  const allStreams = liveStreams.data || [];
  const liveNow = allStreams.filter((s) => s.isLive || s.status === "live");
  const upcoming = allStreams.filter((s) => !s.isLive && s.status !== "live");

  return (
    <div className="space-y-12">
      {/* ─── هدر صفحه ─── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 0 25px rgba(220,38,38,0.4)",
            }}
          >
            <Radio size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              پخش زنده
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              پخش‌های زنده مدار - {allStreams.length} برنامه
            </p>
          </div>
        </div>
      </div>

      {/* پخش‌های زنده الان */}
      {liveNow.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              در حال پخش
            </h2>
            <span className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
              {liveNow.length} زنده
            </span>
          </div>
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
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-orange-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              برنامه‌های آینده
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((stream, i) => (
              <LiveCard key={stream.id || i} stream={stream} />
            ))}
          </div>
        </section>
      )}

      {/* وضعیت خالی */}
      {liveNow.length === 0 && upcoming.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <Radio size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            برنامه‌ای وجود ندارد
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            پخش‌های زنده مدار به زودی اضافه خواهند شد
          </p>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: "پخش زنده",
    description: "پخش‌های زنده مدار - آخرین اخبار و برنامه‌های زنده",
  };
}
