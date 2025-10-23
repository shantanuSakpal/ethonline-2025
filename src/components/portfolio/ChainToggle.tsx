"use client";

import { SUPPORTED_CHAINS, supportedChains } from "@/lib/constants";
import Image from "next/image";
import useSWR from "swr";

type ChainId = string; // dynamic keys from Debank

type UsedChain = {
  id: ChainId; // e.g., "base", "core", "eth", ...
  name: string;
  logo_url: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ChainToggle({
  address,
  selected,
  onChange,
  allowedChains = supportedChains,
}: {
  address: string;
  selected: ChainId;
  onChange: (c: ChainId) => void;
  allowedChains?: ChainId[]; // if provided, we only show these ids in order
}) {
  const { data: chainsResp } = useSWR<{ chains: UsedChain[] }>(
    address ? `/api/portfolio/used-chains?address=${address}` : null,
    fetcher
  );

  const allChains = (chainsResp?.chains || []) as UsedChain[];
  const filtered = allowedChains.length
    ? (allowedChains
        .map((id) => allChains.find((c) => c.id === id))
        .filter(Boolean) as UsedChain[])
    : allChains;
  const displayChains = filtered.length ? filtered : [];

  // Fetch each displayed chain balance dynamically in one SWR
  const balances = useSWR(
    address && displayChains.length
      ? ["balances", address, displayChains.map((c) => c.id).join(",")]
      : null,
    async () => {
      const entries = await Promise.all(
        displayChains.map(async (c) => {
          const res = await fetch(
            `/api/portfolio/total-chain-balance?address=${address}&chain=${c.id}`
          );
          try {
            const json = await res.json();
            return [c.id, json?.usd_value ?? 0] as const;
          } catch {
            return [c.id, 0] as const;
          }
        })
      );
      return Object.fromEntries(entries) as Record<string, number>;
    }
  );

  const chainUsd = (id: string) => balances.data?.[id] ?? 0;
  const total = displayChains.reduce((s, c) => s + chainUsd(c.id), 0);
  const pct = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);

  const pill = (c: UsedChain) => {
    const isActive = selected === c.id;
    const usd = chainUsd(c.id);
    const percent = pct(usd);
    const label = c.name || c.id.toUpperCase();
    const imgSrc = c.logo_url;
    return (
      <button
        key={c.id}
        aria-pressed={isActive}
        onClick={() => onChange(c.id)}
        className={`flex items-center gap-3 rounded-full px-3 py-2 border transition ${
          isActive
            ? "border-theme-orange bg-orange-50 dark:bg-orange-950/30"
            : "border-zinc-200 dark:border-zinc-700"
        }`}
        title={label}
      >
        <span className="relative h-8 w-8 overflow-hidden rounded-full ">
          <Image src={imgSrc} alt={label} fill sizes="32px" />
        </span>
        <div className="flex flex-col items-start leading-tight">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {label}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">${usd.toFixed(0)}</span>
            <span className="text-xs text-zinc-500">{percent}%</span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex items-center gap-3">
      {displayChains.map((c) => pill(c))}
    </div>
  );
}
