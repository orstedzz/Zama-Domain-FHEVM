"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { DomainSearch } from "@/components/domain-search"
import { DomainPurchase } from "@/components/domain-purchase"
import { MyDomains } from "@/components/my-domains"
import { Wallet, Globe, Shield, Zap } from "lucide-react"

import { useAccount } from "wagmi"
import { useEffect, useRef } from "react"

// Snowfall effect component (toàn trang)
function Snowfall({ count = 60 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const flakes: HTMLDivElement[] = [];
    for (let i = 0; i < count; i++) {
      const flake = document.createElement("div");
      flake.className = "snowflake";
      flake.style.left = Math.random() * 100 + "%";
      flake.style.animationDuration = 2 + Math.random() * 4 + "s";
      flake.style.opacity = String(0.18 + Math.random() * 0.22); // mờ hơn
      flake.style.fontSize = 8 + Math.random() * 8 + "px"; // nhỏ hơn
      flake.style.color = "#fff"; // màu trắng
      flake.textContent = "❄️";
      flakes.push(flake);
      ref.current.appendChild(flake);
    }
    return () => {
      flakes.forEach(flake => flake.remove());
    };
  }, [count]);
  return <div ref={ref} className="pointer-events-none fixed inset-0 z-40 w-full h-full" />;
}

export default function DomainRegistryPage() {
  const { address, isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-100 relative">
      {/* Snowfall background toàn trang */}
      <Snowfall count={60} />
      <style jsx global>{`
        .snowflake {
          position: absolute;
          top: -2em;
          user-select: none;
          animation-name: snow-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes snow-fall {
          to {
            transform: translateY(110vh);
          }
        }
      `}</style>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-orange-200 bg-gradient-to-r from-orange-100 via-pink-100 to-yellow-50/80 backdrop-blur-sm sticky top-0 z-50 shadow-md"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-200 via-pink-200 to-yellow-100 flex items-center justify-center shadow">
              <Globe className="w-7 h-7 text-orange-500 drop-shadow" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-orange-600 drop-shadow-sm">Zama Registry</h1>
              <p className="text-sm text-pink-500 font-semibold">Decentralized Domain Names</p>
            </div>
          </div>
          <WalletConnect />
        </div>
      </motion.header>

      {/* Main Content */}
  <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-orange-500 mb-4 text-balance drop-shadow">🌸 Secure Your Digital Identity 🌸</h2>
          <p className="text-xl text-pink-500 text-balance max-w-2xl mx-auto font-semibold">
            Register your <span className="bg-yellow-100 rounded px-2">.zama</span> domain on the blockchain.<br />
            <span className="text-orange-400">Own your identity, control your future.</span>
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-gradient-to-br from-orange-100 via-pink-50 to-yellow-50 border-orange-200 shadow-md">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-orange-400 mx-auto mb-3 drop-shadow" />
              <h3 className="font-semibold text-foreground mb-2">Secure</h3>
              <p className="text-sm text-muted-foreground">Blockchain-secured ownership</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Fast</h3>
              <p className="text-sm text-muted-foreground">Instant domain resolution</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 text-center">
              <Wallet className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Decentralized</h3>
              <p className="text-sm text-muted-foreground">You own your domain</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Domain Search and Purchase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          <DomainSearch />
          <DomainPurchase />
        </motion.div>

        {/* My Domains */}
        {isConnected && address && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <MyDomains account={address} />
          </motion.div>
        )}
      </main>
    </div>
  )
}
