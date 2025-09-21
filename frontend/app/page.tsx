"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { DomainSearch } from "@/components/domain-search"
import { DomainPurchase } from "@/components/domain-purchase"
import { MyDomains } from "@/components/my-domains"
import { Wallet, Globe, Shield, Zap } from "lucide-react"
import { useAccount } from "wagmi"

export default function DomainRegistryPage() {
  const { address, isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Zama Registry</h1>
              <p className="text-sm text-muted-foreground">Decentralized Domain Names</p>
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
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Secure Your Digital Identity</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Register your .zama domain on the blockchain. Own your identity, control your future.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
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
