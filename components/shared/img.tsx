"use client";

import React from "react";
import Image, { ImageProps } from "next/image";

interface Props extends Omit<ImageProps, "src"> {
  src: string;
  className?: string;
  lcp?: boolean; // прапорець для LCP-зображень
}

export const Img: React.FC<Props> = ({
  src,
  width = 900,
  height = 900,
  alt,
  className = "",
  onLoad,
  onError,
  lcp = false,
  ...otherProps
}) => {
  const imageUrl = `${process.env.NEXT_PUBLIC_STORAGE_APP_URL}/${src}`;

  return (
    <Image
      src={imageUrl}
      alt={alt || ""}
      width={width}
      height={height}
      className={`w-full h-auto ${className}`}
      onLoadingComplete={onLoad as any}
      onError={onError}
      priority={lcp}          // пріоритетне завантаження тільки для LCP
      fetchPriority={lcp ? "high" : undefined} // явно для браузера
      {...otherProps}
    />
  );
};
