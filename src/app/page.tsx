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
            Put your idle stablecoins to work!
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Aggregate your idle USDC/USDT/ETH from all chains, bridge and supply
            to get highest yeild - all in a single transaction path.
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
            desc="Consolidate stablecoins from across chains and stake it with a single click. No bridging hassle. No jumping through multiple protocols "
          />
          <Feature
            title="Gas Optimization"
            desc="Intelligent gas fee optimization and batch transactions to minimize costs while maximizing your net returns across chains."
          />
          <Feature
            title="Best Yields"
            desc="Rank Aave/Compound markets by APY, liquidity, health and risk."
          />
          <Feature
            title="One platform for all Defi"
            desc="You can supply/stake , withdraw and manager all your positions wihout ever leaving Yield Pilot."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-2xl border border-theme-orange  bg-card/60 backdrop-blur p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-semibold">
                Example: Lending 50 USDC on Aave Base market
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                If you have $50 of USDC scattered across chains, we'll unify
                them and then supply to Aave Base market all in one transaction.
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
    <div className="rounded-xl border border-zinc-600 bg-card/60 backdrop-blur p-5">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-theme-blue/20 text-theme-blue ring-1 ring-theme-blue/30">
        <span className="text-sm">★</span>
      </div>
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
