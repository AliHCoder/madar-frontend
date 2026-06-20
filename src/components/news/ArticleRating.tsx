"use client";

import { useEffect, useState } from "react";
import { ratingApi } from "@/lib/api";
import StarRating from "@/components/ui/StarRating";

interface Props {
  articleId: string;
}

export default function ArticleRating({ articleId }: Props) {
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);
  const [userScore, setUserScore] = useState<number | null>(null);

  useEffect(() => {
    ratingApi.getRating("article", articleId).then((res) => {
      setRating(res.averageRating || 0);
      setCount(res.ratingCount || 0);
      if (res.userScore) setUserScore(res.userScore);
    }).catch(() => {});
  }, [articleId]);

  const handleRate = async (score: number) => {
    try {
      const res = await ratingApi.submit("article", articleId, score);
      setRating(res.averageRating);
      setCount(res.ratingCount);
      setUserScore(res.userScore);
    } catch {}
  };

  return (
    <div className="flex items-center gap-3 py-4">
      <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
        امتیاز به این مقاله
      </span>
      <StarRating
        rating={rating}
        count={count}
        onRate={handleRate}
        userScore={userScore}
        size="md"
      />
    </div>
  );
}
