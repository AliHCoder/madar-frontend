// app/archive/[id]/page.tsx
import { redirect } from "next/navigation";

export default async function ArchiveStreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/live/${id}`);
}
