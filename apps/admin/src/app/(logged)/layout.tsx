"use client"

import Loader from "@/components/loader";
import { getSession, getUser, isLogin, refreshToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import { navigate } from "../actions/navigate";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    (async () => {
      if (!await isLogin()) {
        await refreshToken();
        if (!await isLogin()) {
          navigate("/login?error=You are not authorized to access this page. Please login to continue.");
          return
        }
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <div className="w-screen h-screen flex items-center justify-center"><Loader /></div>
  }
  return <>{children}</>;
}