// app/archive/page.tsx
import ArchiveCard from "@/components/archive/ArchiveCard";
import { mockArchivedStreams } from "@/lib/mockLiveData";
import TextReveal from "@/components/animations/TextReveal";

export default function ArchivePage() {
  return (
    <div className="space-y-8">
      <TextReveal
        text="📼 آرشیو پخش‌های زنده"
        className="text-2xl font-bold text-gray-900"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockArchivedStreams.map((stream, i) => (
          <ArchiveCard key={stream.id} stream={stream} delay={i * 0.1} />
        ))}
      </div>
    </div>
  );
}
