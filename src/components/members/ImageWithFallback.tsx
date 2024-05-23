import React, { FC, useState, useEffect } from "react";

interface ImageWithFallbackProps {
  className?: string;
  alt: string;
  src: string | undefined;
  fallback: string;
}

export const ImageWithFallback: FC<ImageWithFallbackProps> = ({
  className,
  alt,
  src,
  fallback,
}: ImageWithFallbackProps) => {
  const [profileImg, setProfileImg] = useState<string | undefined>();

  useEffect(function loadProfileImg() {
    setProfileImg(src);
  }, []);

  const loadFallbackImg = () => {
    setProfileImg(fallback);
  };
  return (
    <img
      className={className}
      alt={alt}
      src={profileImg}
      onError={loadFallbackImg}
    />
  );
};
