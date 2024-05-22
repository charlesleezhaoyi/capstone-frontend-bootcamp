import React, { FC, useState, useEffect } from "react";
import defaultUserImg from "../../assets/defaultUser.png";

interface ImageWithFallbackProps {
  className?: string;
  alt: string;
  src: string | undefined;
}

export const ImageWithFallback: FC<ImageWithFallbackProps> = ({
  className,
  alt,
  src,
}: ImageWithFallbackProps) => {
  const [profileImg, setProfileImg] = useState<string | undefined>();

  useEffect(function loadProfileImg() {
    setProfileImg(src);
  }, []);

  const loadFallbackImg = () => {
    setProfileImg(defaultUserImg);
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
