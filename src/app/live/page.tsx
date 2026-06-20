export const revalidate = 5;

// app/live/page.tsx
import LiveCard from "@/components/live/LiveCard";
import Pagination from "@/components/ui/Pagination";
import { liveApi } from "@/lib/api";
import { Radio } from "lucide-react";

const PER_PAGE = 12;

export default async function LivePage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await props.searchParams;
  const currentPage = Math.max(1, Number(pageStr) || 1);

  let liveStreams;
  try {
    liveStreams = await liveApi.getAll(currentPage, PER_PAGE);
  } catch {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Radio size={28} className="text-teal-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            خطا در دریافت پخش‌های زنده مدار
          </p>
        </div>
      </div>
    );
  }

  const allStreams = liveStreams.data || [];
  const total = liveStreams.total || 0;
  const totalPages = liveStreams.totalPages || 1;
  const liveNow = allStreams.filter((s) => s.isLive || s.status === "live");
  const upcoming = allStreams.filter((s) => !s.isLive && s.status !== "live");

  return (
    <div className="space-y-12">
      {/* ─── هدر صفحه ─── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1099a6, #0d7a85)",
              boxShadow: "0 0 25px rgba(16,153,166,0.4)",
            }}
          >
            <Radio size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">
              پخش زنده
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              پخش‌های زنده مدار - {total} برنامه
            </p>
          </div>
        </div>
      </div>

      {/* پخش‌های زنده الان */}
      {liveNow.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-teal-500 animate-pulse shadow-lg shadow-teal-500/50" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              در حال پخش
            </h2>
            <span className="text-xs text-teal-500 font-semibold bg-teal-50 dark:bg-teal-900/40 px-2 py-0.5 rounded-full">
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
            <span className="w-3 h-3 rounded-full bg-teal-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
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
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
            <Radio size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            برنامه‌ای وجود ندارد
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            پخش‌های زنده مدار به زودی اضافه خواهند شد
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/live" />
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
