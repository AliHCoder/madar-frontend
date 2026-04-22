// app/live/[id]/page.tsx
import { notFound } from "next/navigation";
import StreamPlayer from "@/components/stream/StreamPlayer";
import { mockLiveStreams, mockArchivedStreams } from "@/lib/mockLiveData";

export default async function LiveStreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // جستجو در لایوها
  const liveStream = mockLiveStreams.find((s) => s.id === id);
  if (liveStream) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <StreamPlayer stream={liveStream} isLive={true} />
        </div>
      </div>
    );
  }

  // جستجو در آرشیو
  const archivedStream = mockArchivedStreams.find((s) => s.id === id);
  if (archivedStream) {
    return (
      <div className="min-h-screenpy-12 px-4">
        <div className="max-w-6xl mx-auto">
          <StreamPlayer stream={archivedStream} isLive={false} />
        </div>
      </div>
    );
  }

  notFound();
}
