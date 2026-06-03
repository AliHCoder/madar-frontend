"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  rating: number;
  count: number;
  onRate?: (score: number) => void;
  userScore?: number | null;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  count,
  onRate,
  userScore,
  size = "md",
}: Props) {
  const [hover, setHover] = useState(0);

  const sizeMap = { sm: 14, md: 18, lg: 24 };
  const iconSize = sizeMap[size];

  return (
    <div className="flex items-center gap-2" dir="ltr">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!onRate}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => onRate && setHover(star)}
            onMouseLeave={() => onRate && setHover(0)}
            className={`${onRate ? "cursor-pointer" : "cursor-default"} transition-transform ${
              onRate && hover ? "hover:scale-110" : ""
            }`}
          >
            <Star
              size={iconSize}
              className={`transition-all ${
                (hover || userScore ? (hover || userScore || 0) >= star : rating >= star)
                  ? "fill-yellow-400 text-yellow-400"
                  : rating >= star - 0.5
                    ? "fill-yellow-400/50 text-yellow-400"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
              }`}
            />
          </button>
        ))}
      </div>
      {count > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {rating.toFixed(1)} ({count.toLocaleString("fa-IR")})
        </span>
      )}
    </div>
  );
}
