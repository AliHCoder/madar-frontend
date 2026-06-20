export const revalidate = 15;

// app/archive/page.tsx
import ArchiveCard from "@/components/archive/ArchiveCard";
import Pagination from "@/components/ui/Pagination";
import { archiveApi } from "@/lib/api";
import TextReveal from "@/components/animations/TextReveal";
import { Archive } from "lucide-react";

const PER_PAGE = 12;

export default async function ArchivePage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await props.searchParams;
  const currentPage = Math.max(1, Number(pageStr) || 1);

  let archives;
  try {
    archives = await archiveApi.getAll(currentPage, PER_PAGE);
  } catch {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Archive size={28} className="text-teal-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            خطا در دریافت آرشیو مدار
          </p>
        </div>
      </div>
    );
  }

  const allArchives = archives.data || [];
  const total = archives.total || 0;
  const totalPages = archives.totalPages || 1;

  return (
    <div className="space-y-8">
      {/* هدر */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1099a6, #0d7a85)",
              boxShadow: "0 0 25px rgba(16,153,166,0.4)",
            }}
          >
            <Archive size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">
              آرشیو
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {total} ویدیوی ضبط شده
            </p>
          </div>
        </div>
      </div>

      {allArchives.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArchives.map((stream, i) => (
              <ArchiveCard key={stream.id || i} stream={stream} delay={i * 0.1} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/archive" />
        </>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
            <Archive size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
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

export async function generateMetadata() {
  return {
    title: "آرشیو",
    description: "آرشیو ویدیوهای ضبط شده مدار",
  };
}
