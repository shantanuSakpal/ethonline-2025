"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-b from-[#0a0f1f] to-[#0b0b0f]">
      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-12">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="mx-auto h-64 w-64 blur-[100px] bg-theme-blue" />
          <div className="mx-auto mt-10 h-56 w-56 blur-[110px] bg-theme-orange" />
        </div>

        <div className="flex flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            Cross-chain lending optimizer
          </span>

          <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            One-click allocation to the highest yields across chains
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Aggregate USDC/ETH from any chain, bridge via Nexus, swap via
            Uniswap, and supply to Aave or Compound in a single transaction
            path.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link href="/terminal">
              <Button className="h-11 px-6 text-white font-medium bg-theme-blue hover:bg-[#0638b9]">
                Launch Terminal
              </Button>
            </Link>
            {/* <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              View Docs
            </a> */}
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            title="Unify Liquidity"
            desc="Consolidate dust and balances across chains into a single destination."
          />
          <Feature
            title="Best Yields"
            desc="Rank Aave/Compound markets by APY, liquidity, and health."
          />
          <Feature
            title="Bridge with Nexus"
            desc="Bridge to the right chain and asset seamlessly using Nexus."
          />
          <Feature
            title="Swap with Uniswap"
            desc="Route into the target token (e.g. tBTC) for deposit."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-2xl border bg-card/60 backdrop-blur p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-semibold">
                Example: tBTC on Aave Base
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                If you have $5 of USDC scattered across chains, we’ll unify to
                Base USDC, swap to tBTC via Uniswap, then supply to Aave Base
                tBTC market.
              </p>
            </div>
            <Link href="/terminal">
              <Button className="h-10 px-5 bg-theme-orange hover:opacity-90">
                Try now!
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-card/60 backdrop-blur p-5">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-theme-blue/20 text-theme-blue ring-1 ring-theme-blue/30">
        <span className="text-sm">★</span>
      </div>
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
