// app/archive/page.tsx
import ArchiveCard from "@/components/archive/ArchiveCard";
import { archiveApi } from "@/lib/api";
import TextReveal from "@/components/animations/TextReveal";
import { Archive } from "lucide-react";

export default async function ArchivePage() {
  let archives;
  try {
    archives = await archiveApi.getAll(1, 20);
  } catch {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-center py-20 text-gray-500 dark:text-gray-400 text-lg">
          ⚠️ خطا در دریافت آرشیو
        </p>
      </div>
    );
  }

  const allArchives = archives.data || [];

  return (
    <div className="space-y-8">
      {/* هدر */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 0 25px rgba(220,38,38,0.4)",
            }}
          >
            <Archive size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              آرشیو
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {allArchives.length} ویدیوی ضبط شده
            </p>
          </div>
        </div>
      </div>

      {allArchives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allArchives.map((stream, i) => (
            <ArchiveCard key={stream.id || i} stream={stream} delay={i * 0.1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <Archive size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            ویدیویی وجود ندارد
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            ویدیوهای ضبط شده به زودی اضافه خواهند شد
          </p>
        </div>
      )}
    </div>
  );
}
