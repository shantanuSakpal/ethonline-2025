"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, LucideRefreshCcw, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { ChainId, OrderDirection, useAaveMarkets } from "@aave/react";
import {
  MIN_APY,
  MIN_TVL,
  AAVE_AND_AVAIL_SUPPORTED_CHAINS,
} from "@/lib/constants";
import { summarizeAaveV3Market } from "@/lib/aave-v3/summarize-aave-v3-markets";
import { SupplyMarketDialog } from "@/components/terminal/supply-dialog";
import type { AaveV3Summary } from "@/lib/aave-v3/types";
import { getCompoundMarkets } from "@/lib/compound-v3/get-compound-markets";

type SortField =
  | "chainName"
  | "protocolName"
  | "supplyTokenName"
  | "apy"
  | "tvlUSD";
type SortDirection = "asc" | "desc";

// Helper function to clean up protocol names
const formatProtocolName = (name: string): string => {
  if (name.toLowerCase().startsWith("aavev3")) {
    return "Aave v3";
  }
  return name;
};

export default function MarketsList() {
  const [protocol, setProtocol] = useState<"Aave" | "Compound" | "All">("All");
  const [sortField, setSortField] = useState<SortField>("apy");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [markets, setMarkets] = useState<AaveV3Summary[]>([]);
  const [compoundStats, setCompoundStats] = useState<AaveV3Summary[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: rawMarkets, loading: marketsLoading } = useAaveMarkets({
    chainIds: AAVE_AND_AVAIL_SUPPORTED_CHAINS as ChainId[],
    suppliesOrderBy: { supplyApy: OrderDirection.Desc },
  });

  // safely update local state when hook data changes
  useEffect(() => {
    if (rawMarkets) {
      const summarized = summarizeAaveV3Market(rawMarkets);
      setMarkets(summarized);
    }
  }, [rawMarkets]);

  // fetch Compound markets
  useEffect(() => {
    async function fetchCompound() {
      try {
        const compound = await getCompoundMarkets(true);
        setCompoundStats(compound);
        console.log("compound markets --- ", compound);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch Compound markets:", error);
        setLoading(false);
      }
    }
    fetchCompound();
  }, []);

  const displayData = useMemo(() => {
    let data: AaveV3Summary[] = [];

    if (protocol === "Aave") data = markets;
    else if (protocol === "Compound") data = compoundStats;
    else data = [...markets, ...compoundStats];

    // apply filters
    data = data
      .filter((m) => m.tvlUSD >= MIN_TVL)
      .filter((m) => m.apy >= MIN_APY)
      .filter(
        (m) => m.supplyTokenSymbol === "USDC" || m.supplyTokenSymbol === "USDT"
      );

    // apply sorting
    return [...data].sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      switch (sortField) {
        case "chainName":
          return a.chainName.localeCompare(b.chainName) * dir;
        case "protocolName":
          return a.protocolName.localeCompare(b.protocolName) * dir;
        case "supplyTokenName":
          return a.supplyTokenName.localeCompare(b.supplyTokenName) * dir;
        case "apy":
          return (a.apy - b.apy) * dir;
        case "tvlUSD":
          return (a.tvlUSD - b.tvlUSD) * dir;
        default:
          return 0;
      }
    });
  }, [protocol, markets, compoundStats, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field)
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // find top APY market for each protocol
  const topAaveMarket = useMemo(() => {
    const filtered = markets
      .filter((m) => m.tvlUSD >= MIN_TVL)
      .filter((m) => m.apy >= MIN_APY)
      .filter(
        (m) => m.supplyTokenSymbol === "USDC" || m.supplyTokenSymbol === "USDT"
      );
    if (!filtered.length) return null;
    return [...filtered].sort((a, b) => b.apy - a.apy)[0];
  }, [markets]);

  const topCompoundMarket = useMemo(() => {
    const filtered = compoundStats
      .filter((m) => m.tvlUSD >= MIN_TVL)
      .filter((m) => m.apy >= MIN_APY)
      .filter(
        (m) => m.supplyTokenSymbol === "USDC" || m.supplyTokenSymbol === "USDT"
      );
    if (!filtered.length) return null;
    return [...filtered].sort((a, b) => b.apy - a.apy)[0];
  }, [compoundStats]);

  const renderTopYieldCard = (
    market: AaveV3Summary | null,
    protocolName: string
  ) => {
    if (!market) return null;

    return (
      <Card className="mb-6 border border-theme-blue/40 bg-gradient-to-br from-theme-blue/10 to-transparent w-fit">
        <CardContent className="px-6 py-5 flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="border-theme-orange border text-theme-orange text-xs px-2 py-1 rounded-full bg-theme-orange/10">
              Top Yield
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300">
              {protocolName}
            </div>
          </div>
          {/* Headline */}
          <div className="flex items-center gap-2">
            {market.supplyTokenLogo && (
              <Image
                src={market.supplyTokenLogo}
                alt={market.supplyTokenSymbol}
                width={28}
                height={28}
                className="rounded-full"
              />
            )}
            <div className="flex items-center gap-2">
              {market.supplyTokenSymbol}
              <span className="text-sm ">on</span>
              <Image
                src={market.chainLogo}
                alt={market.chainName}
                width={28}
                height={28}
                className="rounded-full"
              />
              <span className="">{market.chainName}</span>
            </div>
          </div>

          {/* APY Highlight */}
          <p className="text-3xl font-bold text-theme-orange">
            {market.apy.toFixed(2)}% APY
          </p>

          {/* Stats Row */}
          <div className="flex gap-6 text-sm text-zinc-400">
            <p>
              TVL:{" "}
              <span className="text-white font-medium">
                $
                {new Intl.NumberFormat("en", { notation: "compact" }).format(
                  market.tvlUSD
                )}
              </span>
            </p>
            <p>
              Liquidity:{" "}
              <span className="text-white font-medium">
                $
                {new Intl.NumberFormat("en", { notation: "compact" }).format(
                  market.totalAvailableLiquidity || 0
                )}
              </span>
            </p>
          </div>

          {/* Supply Button */}
          <div className="relative mt-2 group">
            <div className="absolute -inset-1 bg-theme-blue/40 blur-md rounded-lg opacity-70 group-hover:opacity-100 transition" />
            <div className="relative z-10">
              <SupplyMarketDialog row={market} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      {/* Top Yield Cards */}
      <div className="flex flex-row md:flex-row gap-4 mb-6 ">
        {topAaveMarket && renderTopYieldCard(topAaveMarket, "Aave")}
        {topCompoundMarket && renderTopYieldCard(topCompoundMarket, "Compound")}
      </div>

      <Card className="border-theme-blue/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 w-full justify-between">
            <div className="flex items-center gap-2">
              <p>Market Scanner</p>
              <div className="ml-2 rounded-md bg-theme-blue/15 px-2 py-0.5 text-xs text-theme-blue ring-1 ring-theme-blue/30 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-theme-blue rounded-full"></div>
                <p>Live</p>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            Compare yields with sortable columns.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 w-full">
          {/* Protocol Tabs */}
          <div className="flex flex-col gap-4 lg:flex-row ">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-semibold">
                Protocol
              </label>
              <Tabs
                value={protocol}
                onValueChange={(v) =>
                  setProtocol(v as "Aave" | "Compound" | "All")
                }
                className="w-full cursor-pointer"
              >
                <TabsList className="w-full bg-background grid grid-cols-3 cursor-pointer">
                  <TabsTrigger value="All" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="Aave" className="flex-1">
                    Aave
                  </TabsTrigger>
                  <TabsTrigger value="Compound" className="flex-1">
                    Compound
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="px-4 py-6 text-center text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading markets...
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header */}
              <div className="grid grid-cols-6 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                {[
                  ["chainName", "Chain"],
                  ["protocolName", "Protocol"],
                  ["supplyTokenName", "Token"],
                  ["apy", "APY"],
                  ["tvlUSD", "TVL"],
                ].map(([field, label]) => (
                  <div key={field} className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(field as SortField)}
                      className="px-2 cursor-pointer h-auto"
                    >
                      {label} <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center justify-center">
                  <span className="px-2">Actions</span>
                </div>
              </div>

              {/* Rows */}
              {displayData.length > 0 ? (
                displayData.map((market, index) => (
                  <div
                    key={`${market.chainId}-${market.supplyTokenAddress}-${index}`}
                    className="grid grid-cols-6 gap-4 px-4 py-3 items-center hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <Image
                        src={market.chainLogo}
                        alt={market.chainName}
                        width={16}
                        height={16}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm ml-2">{market.chainName}</span>
                    </div>
                    <div className="flex  justify-center text-sm">
                      {formatProtocolName(market.protocolName)}
                    </div>
                    <div className="flex items-center  gap-2">
                      {market.supplyTokenLogo && (
                        <Image
                          className="w-6 h-6 rounded-full"
                          src={market.supplyTokenLogo}
                          alt={market.supplyTokenName}
                          width={16}
                          height={16}
                        />
                      )}
                      <span className="text-sm">{market.supplyTokenName}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="font-medium text-theme-orange text-sm">
                        {market.apy.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-center text-sm">
                      $
                      {new Intl.NumberFormat("en", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      })
                        .format(market.tvlUSD)
                        .toLowerCase()}
                    </div>
                    <div className="flex items-center justify-center">
                      <SupplyMarketDialog row={market} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-muted-foreground">
                  No markets found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
