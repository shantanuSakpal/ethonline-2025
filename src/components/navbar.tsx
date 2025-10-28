"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import WalletConnection from "@/components/nexus/connect-wallet";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ViewUnifiedBalance from "@/components/nexus/view-balance";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-500 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Yield Pilot logo"
              width={36}
              height={36}
              className="rounded-sm"
            />
            <span className="text-xl font-semibold tracking-tight">
              Yield Pilot
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 ">
            <Link
              href="/"
              className={`transition-colors ${
                pathname === "/"
                  ? "text-theme-orange font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/terminal"
              className={`transition-colors ${
                pathname.startsWith("/terminal")
                  ? "text-theme-orange font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Terminal
            </Link>
            {/* <Link
              href="/co-pilot"
              className={`transition-colors ${
                pathname.startsWith("/co-pilot")
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Co-Pilot
            </Link> */}
            <Link
              href="/portfolio"
              className={`transition-colors ${
                pathname.startsWith("/portfolio")
                  ? "text-theme-orange font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Portfolio
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && pathname !== "/" ? (
              <ViewUnifiedBalance />
            ) : (
              <WalletConnection />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
