"use client";
import ConnectWallet from "@/components/blocks/connect-wallet";
import NexusInitButton from "@/components/terminal/nexus-init";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Yield Pilot logo"
              width={36}
              height={36}
              className="rounded-sm"
            />
            <span className="text-lg font-semibold tracking-tight">
              Yield Pilot
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 ">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/terminal"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terminal
            </Link>
            <Link
              href="/co-pilot"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Co-Pilot
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-x-3 items-center justify-center">
              <ConnectWallet />
              <NexusInitButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
