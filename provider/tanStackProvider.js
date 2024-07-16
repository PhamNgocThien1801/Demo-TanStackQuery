"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const TanStackProvider = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default TanStackProvider;
