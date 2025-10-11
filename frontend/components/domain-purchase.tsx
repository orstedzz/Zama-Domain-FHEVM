"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Coins } from "lucide-react";
import { motion } from "framer-motion";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useSwitchChain } from "wagmi";
import { parseEther } from "viem";

// ⚠️ deploy
const CONTRACT_ADDRESS = "0x6b5d2E225b36B604F7c55f93B7922c2B46F5940C";
// ⚠️ import ABI 
import ZamaDomainRegistry from "@/abi/ZamaDomainRegistry.json";

export function DomainPurchase() {
  const { isConnected } = useAccount();
  const { chains, switchChain } = useSwitchChain();
  const [domainName, setDomainName] = useState("");
  const [duration, setDuration] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pricePerYear = 0.001; // ETH
  const totalPrice = duration * pricePerYear;

  // wagmi writeContract
  const { data: txHash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const purchaseDomain = async () => {
    if (!domainName.trim() || !isConnected) return;

    // Tự động switch sang Sepolia nếu chưa đúng chain
    const sepoliaChain = chains.find((c) => c.id === 11155111);
    if (switchChain && sepoliaChain) {
      try {
        await switchChain({ chainId: sepoliaChain.id });
      } catch {
        // user từ chối hoặc extension không hỗ trợ
        return;
      }
    }

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ZamaDomainRegistry.abi,
      functionName: "buyDomain",
      args: [domainName.trim(), BigInt(duration)],
      value: parseEther(totalPrice.toString()),
    });
  };

  if (!mounted) return null;

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          Purchase Domain
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchase-domain" className="text-foreground">
              Domain Name
            </Label>
            <div className="relative">
              <Input
                id="purchase-domain"
                placeholder="Enter domain name"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                className="bg-input border-border text-foreground pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">.zama</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-foreground">
              Duration (Years)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="10"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Number.parseInt(e.target.value) || 1))}
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>

        <motion.div
          className="p-4 rounded-lg bg-muted/50 border border-border"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-foreground font-medium">Total Price</span>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-xl font-bold text-foreground">{totalPrice.toFixed(3)} ETH</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {pricePerYear} ETH per year × {duration} year{duration > 1 ? "s" : ""}
          </div>
        </motion.div>

        <Button
          onClick={purchaseDomain}
          disabled={!domainName.trim() || !isConnected || isPending || isConfirming}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {isPending || isConfirming ? "Processing..." : `Buy ${domainName ? `${domainName}.zama` : "Domain"}`}
        </Button>

        {isSuccess && (
          <p className="text-sm text-success text-center">
            Successfully purchased {domainName}.zama for {duration} year{duration > 1 ? "s" : ""}!
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive text-center">
            {error.message || "Purchase failed. Please try again."}
          </p>
        )}

        {!isConnected && (
          <p className="text-sm text-muted-foreground text-center">Connect your wallet to purchase domains</p>
        )}
      </CardContent>
    </Card>
  );
}
