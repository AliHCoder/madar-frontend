import NewsCard from "./NewsCard";
import { Article } from "@/types/news";

export default function NewsGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, i) => (
        <NewsCard key={article.id} article={article} delay={i * 0.1} />
      ))}
    </div>
  );
}
