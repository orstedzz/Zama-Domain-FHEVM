
"use client";
// EIP-1193 provider type helper
type EIP1193Provider = {
  isMetaMask?: boolean;
  isOkxWallet?: boolean;
  isRabbit?: boolean;
  [key: string]: unknown;
};

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ChevronDown, LogOut, Network } from "lucide-react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState, useRef } from "react";

// Snowfall effect component
function Snowfall({ count = 40 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const flakes: HTMLDivElement[] = [];
    for (let i = 0; i < count; i++) {
      const flake = document.createElement("div");
      flake.className = "snowflake";
      flake.style.left = Math.random() * 100 + "%";
      flake.style.animationDuration = 2 + Math.random() * 3 + "s";
      flake.style.opacity = String(0.5 + Math.random() * 0.5);
      flake.style.fontSize = 12 + Math.random() * 16 + "px";
      flake.textContent = "❄️";
      flakes.push(flake);
      ref.current.appendChild(flake);
    }
    return () => {
      flakes.forEach(flake => flake.remove());
    };
  }, [count]);
  return <div ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";


export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!mounted) return null;

  if (isConnected && address) {
    return (
      <motion.div
        {...({} as HTMLMotionProps<"div">)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
      >
        <Badge variant="secondary" className="bg-success/20 text-success-foreground border-success/30">
          Connected
        </Badge>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="outline" className="bg-card border-border hover:bg-muted flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              {formatAddress(address)}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="z-50 min-w-[180px] rounded-md border bg-popover p-2 shadow-md">
            <DropdownMenu.Label className="px-2 py-1 text-xs text-muted-foreground">Network</DropdownMenu.Label>
            <DropdownMenu.Item disabled className="flex items-center gap-2 px-2 py-2 text-foreground">
              <Network className="w-4 h-4" />
              Sepolia
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-border" />
            <DropdownMenu.Item onSelect={() => disconnect()} className="flex items-center gap-2 px-2 py-2 text-destructive cursor-pointer">
              <LogOut className="w-4 h-4" />
              Disconnect
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </motion.div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="bg-gradient-to-r from-blue-300 via-indigo-200 to-white text-blue-900 font-semibold rounded-full px-6 py-2 shadow-lg hover:from-blue-400 hover:to-indigo-300 transition-all duration-200 border border-blue-100"
      >
        <span className="mr-2">❄️</span>
  {isPending ? "Connecting..." : "Connect Wallet"}
      </Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <>
            <Dialog.Overlay className="fixed inset-0 bg-blue-100/40 z-50 backdrop-blur-md" />
            {/* Snowfall background */}
            <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
              <Snowfall count={40} />
            </div>
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6 shadow-2xl border-2 border-blue-200">
            <Dialog.Title className="text-xl font-bold text-blue-700 mb-2 text-center flex items-center justify-center gap-2">Select Wallet <span>❄️</span></Dialog.Title>
            <p className="text-xs text-indigo-500 mb-4 text-center bg-blue-50 rounded-lg px-2 py-1">
              ⚠️ If you have multiple wallet extensions (MetaMask, OKX, Rabbit), please disable the ones you are not using to ensure your transaction goes through the correct wallet!
            </p>
            <div className="flex flex-col gap-3">
              {["MetaMask", "OKX Wallet", "Rabbit Wallet"].map((label) => {
                let isInstalled = false;
                const eth = (window as unknown as { ethereum?: EIP1193Provider & { providers?: EIP1193Provider[] } }).ethereum;
                if (label === "MetaMask") {
                  if (eth?.isMetaMask) isInstalled = true;
                  else if (Array.isArray(eth?.providers)) {
                    isInstalled = eth.providers.some((p) => !!p.isMetaMask);
                  }
                }
                if (label === "OKX Wallet") {
                  if ((window as { okxwallet?: unknown }).okxwallet) isInstalled = true;
                  else if (eth?.isOkxWallet) isInstalled = true;
                  else if (Array.isArray(eth?.providers)) {
                    isInstalled = eth.providers.some((p) => !!p.isOkxWallet);
                  }
                }
                if (label === "Rabbit Wallet") {
                  if (eth?.isRabbit) isInstalled = true;
                  else if (Array.isArray(eth?.providers)) {
                    isInstalled = eth.providers.some((p) => !!p.isRabbit);
                  }
                }
                return (
                  <Button
                    key={label}
                    onClick={() => {
                      const injectedConnector = connectors.find((c) => c.id === "injected");
                      if (injectedConnector) {
                        connect({ connector: injectedConnector });
                        setOpen(false);
                      }
                    }}
                    disabled={!isInstalled || isPending}
                    className={`justify-start rounded-xl py-3 px-4 font-medium text-base shadow-md border-2 border-blue-200 bg-white/80 hover:bg-blue-100 transition-all duration-150 ${isInstalled ? "text-blue-700" : "text-gray-400"}`}
                    variant="outline"
                  >
                    <span className="mr-2">{label}</span>
                    {!isInstalled && <span className="text-xs italic">(chưa cài)</span>}
                  </Button>
                );
              })}
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" className="w-full mt-6 rounded-xl text-indigo-500 font-semibold border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-all">Cancel</Button>
            </Dialog.Close>
            </Dialog.Content>
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
          </>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
