"use client";

import { WagmiProvider } from "./wagmi-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>{children}</WagmiProvider>
    </QueryClientProvider>
  );
}
