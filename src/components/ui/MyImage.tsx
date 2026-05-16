"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

const isDev = process.env.NODE_ENV === "development";
const DEFAULT_IMAGE = "/assets/images/png/test.jpg";

interface MyImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallback?: string;
}

export function MyImage({ src, fallback, alt, ...props }: MyImageProps) {
  const [hasError, setHasError] = useState(false);

  const finalSrc = hasError
    ? (fallback || DEFAULT_IMAGE)
    : (src || fallback || DEFAULT_IMAGE);

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