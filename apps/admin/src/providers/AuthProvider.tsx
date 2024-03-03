"use client";

import React, { createContext } from "react";

const AuthContext = createContext({});

export default function ThemeProvider({
  children,
}: React.PropsWithChildren<{}>) {
  return <AuthContext.Provider value="dark">{children}</AuthContext.Provider>;
}
