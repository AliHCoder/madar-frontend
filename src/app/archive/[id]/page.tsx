export const dynamic = "force-dynamic";

// app/archive/[id]/page.tsx
import { notFound } from "next/navigation";
import { archiveApi } from "@/lib/api";
import StreamPlayer from "@/components/stream/StreamPlayer";
import CategoryBadge from "@/components/common/CategoryBadge";
import { Calendar, Clock, Eye, Play, Tag } from "lucide-react";
import Link from "next/link";

export default async function ArchiveDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let stream;
  try {
    stream = await archiveApi.getById(id);
  } catch {
    notFound();
  }

  if (!stream) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* پلیر */}
      <StreamPlayer stream={stream} isLive={false} />

      {/* لینک برگشت */}
      <div className="text-center">
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
        >
          ← بازگشت به آرشیو
        </Link>
      </div>
    </div>
  );
}

// ─── SEO ───
export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  try {
    const stream = await archiveApi.getById(id);
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
