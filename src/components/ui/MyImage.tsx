"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

const DEFAULT_IMAGE = "/assets/images/png/test.jpg";
const WATERMARK = "/images/logo - only - 1000p - FLAT.png";

interface MyImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallback?: string;
  watermark?: boolean;
}

export function MyImage({
  src,
  fallback,
  alt,
  watermark = true,
  ...props
}: MyImageProps) {
  const [hasError, setHasError] = useState(false);

  const finalSrc = hasError
    ? (fallback || DEFAULT_IMAGE)
    : (src || fallback || DEFAULT_IMAGE);

  const img = (
    <Image
      {...props}
      src={finalSrc}
      alt={alt || "تصویر"}
      unoptimized
      onError={() => setHasError(true)}
    />
  );

  if (!watermark) return img;

  return (
    <div className={props.fill ? "relative w-full h-full" : "relative"}>
      {img}
      <img
        src={WATERMARK}
        alt=""
        width={56}
        height={56}
        className="absolute bottom-2 right-2 w-11 h-11 opacity-60 pointer-events-none z-10 object-contain"
      />
    </div>
  );
}