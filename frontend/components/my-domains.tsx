"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useReadContract } from "wagmi";

// ⚠️ deploy
const CONTRACT_ADDRESS = "0x6b5d2E225b36B604F7c55f93B7922c2B46F5940C";
// ⚠️ build
import ZamaDomainRegistry from "@/abi/ZamaDomainRegistry.json";

interface RawDomain {
  name: string;
  expiresAt: bigint;
  owner: string;
}

interface Domain {
  name: string;
  expiresAt: number;
  owner: string;
}


interface MyDomainsProps {
  account: string;
}


export function MyDomains({ account }: MyDomainsProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  //  domains contract
  const { data, isLoading: isFetching } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ZamaDomainRegistry.abi,
    functionName: "getDomainsByOwner",
    args: [account],
    query: { enabled: !!account },
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const parsed: Domain[] = (data as RawDomain[]).map((d) => ({
        name: `${d.name}.zama`,
        expiresAt: Number(d.expiresAt),
        owner: d.owner,
      }));
      setDomains(parsed);
      setIsLoading(false);
    }
  }, [data]);

  const getStatusBadge = (expiry: number) => {
    const now = Date.now() / 1000;
    if (expiry < now) {
      return <Badge className="bg-destructive/20 text-destructive-foreground border-destructive/30">Expired</Badge>;
    }
    if (expiry - now < 30 * 24 * 60 * 60) {
      return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Expiring Soon</Badge>;
    }
    return <Badge className="bg-success/20 text-success-foreground border-success/30">Active</Badge>;
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp * 1000);
    return d.toISOString().split("T")[0];
  };

  if (!mounted || isLoading || isFetching) {
    return (
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            My Domains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            My Domains
          </CardTitle>
        </CardHeader>
        <CardContent>
          {domains.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">No domains yet</p>
              <p className="text-muted-foreground">Purchase your first domain to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Domain Name</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.map((domain, index) => (
                    <motion.tr
                      key={domain.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-border"
                    >
                      <TableCell className="font-medium text-foreground">{domain.name}</TableCell>
                      <TableCell>{getStatusBadge(domain.expiresAt)}</TableCell>
                      <TableCell className="text-foreground">{formatDate(domain.expiresAt)}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
