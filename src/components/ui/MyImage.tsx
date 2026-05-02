"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

const isDev = process.env.NODE_ENV === "development";

const DEFAULT_IMAGES: Record<string, string> = {
  article: "/images/default-article.jpg",
  live: "/images/default-live.jpg",
  archive: "/images/default-archive.jpg",
  user: "/images/default-user.jpg",
  default: "/images/png/test.jpg",
};

interface MyImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  type?: "article" | "live" | "archive" | "user" | "default";
  fallback?: string;
}

export function MyImage({
  src,
  type = "default",
  fallback,
  alt,
  ...props
}: MyImageProps) {
  const [hasError, setHasError] = useState(false);

  const fallbackSrc =
    fallback || DEFAULT_IMAGES[type] || DEFAULT_IMAGES.default;
  const finalSrc = src && !hasError ? src : fallbackSrc;

  return (
    <Image
      {...props}
      src={finalSrc}
      alt={alt || "تصویر"}
      unoptimized={isDev}
      onError={() => setHasError(true)}
    />
  );
}
