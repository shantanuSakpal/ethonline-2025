// app/portfolio/[address]/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import dynamic from "next/dynamic";
import { ChainToggle } from "@/components/portfolio/ChainToggle";
import { ChainChoice } from "@/lib/constants";

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

type TabKey = "tokens" | "protocols";

const Tabs: { key: TabKey; label: string }[] = [
  { key: "tokens", label: "Tokens" },
  { key: "protocols", label: "Protocols" },
];

// Lazy-load each section so we don’t even ship their code until needed.
const TokensSection = dynamic(
  () => import("@/components/portfolio/TokenList"),
  {
    ssr: false,
    loading: () => (
      <div className="py-4 text-sm text-gray-400">Loading Tokens…</div>
    ),
  }
);
const ProtocolList = dynamic(
  () => import("@/components/portfolio/ProtocolList"),
  {
    ssr: false,
    loading: () => (
      <div className="py-4 text-sm text-gray-400">Loading protocols…</div>
    ),
  }
);

export default function Portfolio() {
  const { address, isConnecting, isDisconnected } = useAccount();

  // Default to "tokens"; you can also restore from URL hash if you want.
  const [active, setActive] = useState<TabKey>("tokens");
  const [chain, setChain] = useState<ChainChoice>("base");

  // Render just the active pane (so only that component mounts & fetches).
  const ActivePane = useMemo(() => {
    if (!address) return null;
    switch (active) {
      case "tokens":
        return <TokensSection address={address} chain={chain} />;
      case "protocols":
        return <ProtocolList address={address} chain={chain} />;

      default:
        return null;
    }
  }, [active, address, chain]);

  return (
    <div className="px-4 py-6 md:px-8 space-y-4">
      <div className="flex flex-col  gap-3 mb-5">
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        {!isConnecting && !isDisconnected && address && (
          <div className="flex items-center gap-4">
            <ChainToggle
              address={address}
              selected={chain}
              onChange={(c) => setChain(c as ChainChoice)}
            />
            {/* <TotalChainBalance address={address} chain={chain} /> */}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Portfolio sections"
        className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800"
      >
        {Tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              className={`px-3 py-2 text-sm rounded-t-md transition-colors
                ${
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-theme-orange dark:border-theme-orange border-b-transparent"
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Active tab content */}
      <div role="tabpanel" className="mt-2">
        {address ? (
          ActivePane ?? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              Select a tab…
            </div>
          )
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            Connect your wallet to view the portfolio.
          </div>
        )}
      </div>
    </div>
  );
}
