import Image from "next/image";
import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const NextImage = ({ src, alt, width, height }: ImageProps) => {
  return <Image src={src} width={width} height={height} alt={alt} />;
};

export default NextImage;
NextImage.defaultProps = {
  src: "https://www.homesforbolton.org.uk/choice/images/shared/noimagethumb.jpg",
  atl: "No Image",
  width: 900,
  height: 500,
};
