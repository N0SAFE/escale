"use client";

import React from "react";

type CLickHandlerProps = {
  onClick: () => void;
};

export default function ClickHandler({
  onClick,
  className,
  children,
}: React.PropsWithChildren<
  CLickHandlerProps & Omit<React.HtmlHTMLAttributes<HTMLDivElement>, "onClick">
>) {
  return (
    <div onClick={(e) => onClick()} className={className}>
      {children}
    </div>
  );
}
