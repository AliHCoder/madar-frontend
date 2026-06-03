import Link from "next/link";

export default function TagLink({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tag/${encodeURIComponent(tag)}`}
      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 
        hover:bg-red-50 dark:hover:bg-red-900/30 
        text-gray-600 dark:text-gray-400 
        hover:text-red-600 dark:hover:text-red-400 
        text-xs font-medium rounded-full transition-colors"
    >
      #{tag}
    </Link>
  );
}
