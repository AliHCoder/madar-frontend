// SidebarLatest.tsx
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types/news";
import ScrollReveal from "../animations/ScrollReveal";
import { Clock } from "lucide-react";

export default function SidebarLatest({ articles }: { articles: Article[] }) {
  return (
    <aside className="space-y-4">
      <h3 className="text-base font-bold border-r-4 border-red-500 pr-3 text-gray-900">
        پربازدیدترین
      </h3>
      <div className="space-y-1">
        {articles.slice(0, 6).map((article, i) => (
          <ScrollReveal key={article.id} delay={i * 0.08} direction="right">
            <Link
              href={`/article/${article.id}`}
              className="flex gap-3 group p-3 rounded-xl transition-colors duration-200 hover:bg-red-50"
            >
              <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={"/assets/images/png/test.jpg"}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col justify-between">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                  {article.title}
                </p>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={11} className="text-red-400" />
                  {article.readTime} دقیقه
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </aside>
  );
}
