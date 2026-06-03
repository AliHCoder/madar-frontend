export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import StreamPlayer from "@/components/stream/StreamPlayer";
import { liveApi, archiveApi } from "@/lib/api";
import { LiveStream, ArchivedStream } from "@/types/news";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function StreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let stream: LiveStream | ArchivedStream | null = null;
  let isLive = false;

  try {
    stream = await liveApi.getById(id);
    isLive = true;
  } catch {
    try {
      stream = await archiveApi.getById(id);
    } catch {
      notFound();
    }
  }

  if (!stream) notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ─── هدر صفحه ─── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 mb-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link
              href="/"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              خانه
            </Link>
            <ArrowRight size={12} />
            {stream.category && (
              <Link
                href={`/category/${stream.category.slug}`}
                className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {stream.category.name}
              </Link>
            )}
            <ArrowRight size={12} />
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
              {stream.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ─── محتوای اصلی ─── */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <StreamPlayer stream={stream} isLive={isLive} />

        {/* ─── پیشنهادات مرتبط ─── */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            ویدیوهای مرتبط
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const stream = await liveApi
      .getById(id)
      .catch(() => archiveApi.getById(id));

    return {
      title: stream.title,
      description: stream.description,
      openGraph: {
        title: stream.title,
        description: stream.description,
        images: [stream.thumbnail],
        type: "video.other",
      },
    };
  } catch {
    return {
      title: "ویدیو یافت نشد",
      description: "متاسفانه ویدیوی مورد نظر یافت نشد.",
    };
  }
}
