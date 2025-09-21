"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
      >
        <Badge variant="secondary" className="bg-success/20 text-success-foreground border-success/30">
          Connected
        </Badge>
        <Button variant="outline" onClick={() => disconnect()} className="bg-card border-border hover:bg-muted">
          <Wallet className="w-4 h-4 mr-2" />
          {formatAddress(address)}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    );
  }

  return (
    <Button
      onClick={() => connect({ connector: connectors.find((c) => c.id === "injected") || injected() })}
      disabled={isPending}
      className="bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
