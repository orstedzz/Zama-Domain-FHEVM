"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReadContract, useAccount } from "wagmi";

// ⚠️  deploy
const CONTRACT_ADDRESS = "0x6b5d2E225b36B604F7c55f93B7922c2B46F5940C";

// ⚠️ import ABI  
import ZamaDomainRegistry from "@/abi/ZamaDomainRegistry.json";

export function DomainSearch() {
  const { isConnected } = useAccount();
  const [domainName, setDomainName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // contract check availability
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ZamaDomainRegistry.abi,
    functionName: "isDomainAvailable",
    args: submittedName ? [submittedName] : undefined,
    query: {
      enabled: Boolean(submittedName), // domainName
    },
  });

  const handleCheck = () => {
    if (domainName.trim()) {
      setSubmittedName(domainName.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheck();
  };

  const availability = data === undefined ? null : data ? "available" : "taken";

  if (!mounted) return null;

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Search Domain
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="domain" className="text-foreground">
            Domain Name
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="domain"
                placeholder="Enter domain name"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-input border-border text-foreground pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">.zama</span>
            </div>
            <Button
              onClick={handleCheck}
              disabled={!domainName.trim() || isLoading || !isConnected}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Checking..." : "Check"}
            </Button>
          </div>
          {!isConnected && (
            <p className="text-sm text-muted-foreground">Connect your wallet to check domain availability</p>
          )}
        </div>

        <AnimatePresence>
          {availability && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/50"
            >
              {availability === "available" ? (
                <>
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{domainName}.zama is available!</p>
                    <p className="text-sm text-muted-foreground">You can register this domain</p>
                  </div>
                  <Badge className="bg-success/20 text-success-foreground border-success/30">Available</Badge>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{domainName}.zama is already taken</p>
                    <p className="text-sm text-muted-foreground">Try a different name</p>
                  </div>
                  <Badge className="bg-destructive/20 text-destructive-foreground border-destructive/30">Taken</Badge>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
