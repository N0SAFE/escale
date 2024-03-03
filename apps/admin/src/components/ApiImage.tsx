import Image, { ImageProps } from "next/image";
import React from "react";

type ApiImageProps = {
  identifier: number;
};

export default function ApiImage({
  identifier,
  alt,
  ...props
}: ApiImageProps & Omit<ImageProps, "src">) {
  return (
    <Image
      alt={alt}
      {...props}
      src={process.env.NEXT_PUBLIC_API_URL + "/attachment/image/" + identifier}
    />
  );
}
