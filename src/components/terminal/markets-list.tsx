"use client";

import { useMemo, useState } from "react";
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
import type { AaveV3Summary } from "@/lib/aave-v3/types";
import Image from "next/image";
import {
  ChainId,
  chainId,
  OrderDirection,
  useAaveChains,
  useAaveMarkets,
} from "@aave/react";
import {
  MIN_APY,
  MIN_TVL,
  AAVE_AND_AVAIL_SUPPORTED_CHAINS,
} from "@/lib/constants";
import { filterByTokens } from "@/lib/aave-v3/filter-by-tokens";
import { filterByMinAPY } from "@/lib/aave-v3/filter-by-min-apy";
import { filterByMinTVL } from "@/lib/aave-v3/filter-by-min-tvl";
import { summarizeAaveV3Market } from "@/lib/aave-v3/summarize-aave-v3-markets";
import { SupplyMarketDialog } from "@/components/terminal/supply-dialog";

type SortField =
  | "chainName"
  | "protocolName"
  | "supplyTokenName"
  | "apy"
  | "tvlUSD";
type SortDirection = "asc" | "desc";

export default function MarketsList() {
  const [protocol, setProtocol] = useState<"Aave" | "Compound" | "All">("All");
  const [sortField, setSortField] = useState<SortField>("apy");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const compoundStats: AaveV3Summary[] = []; // TODO: wire Compound

  const {
    data: markets,
    loading,
    error,
  } = useAaveMarkets({
    chainIds: AAVE_AND_AVAIL_SUPPORTED_CHAINS as ChainId[],
    suppliesOrderBy: { supplyApy: OrderDirection.Desc },
  });

  const aaveStats = useMemo(() => {
    if (!markets) return [];

    console.log("markets", markets);
    const summary = summarizeAaveV3Market(markets);

    const filtered = filterByMinTVL(summary, MIN_TVL);
    const filteredByAPY = filterByMinAPY(filtered, MIN_APY);
    const filteredByTokens = filterByTokens(filteredByAPY, [
      "USDC",
      "USDT",
      "ETH",
    ]);

    return filteredByTokens;
  }, [markets]);

  const displayData = useMemo(() => {
    let data = [];
    if (protocol === "Aave") data = aaveStats;
    else if (protocol === "Compound") data = compoundStats;
    else data = [...aaveStats, ...compoundStats];

    // Sort the data
    return [...data].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case "chainName":
          aValue = a.chainName;
          bValue = b.chainName;
          break;
        case "protocolName":
          aValue = a.protocolName;
          bValue = b.protocolName;
          break;
        case "supplyTokenName":
          aValue = a.supplyTokenName;
          bValue = b.supplyTokenName;
          break;
        case "apy":
          aValue = a.apy;
          bValue = b.apy;
          break;
        case "tvlUSD":
          aValue = a.tvlUSD;
          bValue = b.tvlUSD;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [protocol, aaveStats, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div>
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
            <div
              className="cursor-pointer"
              onClick={async () => {
                // const stats = await getAaveStats();
                // if (stats) setAaveStats(stats);
              }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LucideRefreshCcw size={18} />
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Compare yields with sortable columns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 w-full">
          <div className="flex flex-col gap-4 lg:flex-row ">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-semibold">
                Protocol
              </label>
              <Tabs
                value={protocol}
                onValueChange={(v) => setProtocol(v as any)}
                className="w-full cursor-pointer"
              >
                <TabsList className="w-full bg-background grid grid-cols-3 cursor-pointer">
                  <TabsTrigger value={"All" as any} className="flex-1">
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

          {loading ? (
            <div className="px-4 py-6 text-center text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading markets...
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header with sortable columns */}
              <div className="grid grid-cols-6 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("chainName")}
                    className="px-2 cursor-pointer h-auto"
                  >
                    Chain <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("protocolName")}
                    className="px-2 cursor-pointer h-auto"
                  >
                    Protocol <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("supplyTokenName")}
                    className="px-2 cursor-pointer h-auto"
                  >
                    Suggestions <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("apy")}
                    className="px-2 cursor-pointer h-auto"
                  >
                    APY <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("tvlUSD")}
                    className="px-2 cursor-pointer h-auto"
                  >
                    TVL <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <span className="px-2">Actions</span>
                </div>
              </div>

              {/* Market list */}
              <div className="space-y-2">
                {displayData.map((market, index) => (
                  <div
                    key={`${market.chainId}-${market.supplyTokenAddress}-${index}`}
                    className="grid grid-cols-6 gap-4 px-4 py-3 items-center hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    {/* Chain */}
                    <div className="flex items-center justify-center">
                      <Image
                        src={market.chainLogo}
                        alt={market.chainName}
                        width={16}
                        height={16}
                        className="w-6 h-6 rounded-full"
                      />
                    </div>

                    {/* Protocol */}
                    <div className="flex items-center justify-center text-sm">
                      {market.protocolName}
                    </div>

                    {/* Market */}
                    <div className="flex items-center gap-2">
                      {market.supplyTokenLogo ? (
                        <Image
                          className="w-6 h-6 rounded-full"
                          src={market.supplyTokenLogo}
                          alt={market.supplyTokenName}
                          width={16}
                          height={16}
                        />
                      ) : null}
                      <span className="text-sm">{market.supplyTokenName}</span>
                    </div>

                    {/* APY */}
                    <div className="flex items-center justify-center">
                      <span className="font-medium text-theme-orange text-sm">
                        {market.apy.toFixed(2)}%
                      </span>
                    </div>

                    {/* TVL */}
                    <div className="flex items-center justify-center text-sm">
                      $
                      {new Intl.NumberFormat("en", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      })
                        .format(market.tvlUSD)
                        .toLowerCase()}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center">
                      <SupplyMarketDialog row={market} />
                    </div>
                  </div>
                ))}
              </div>

              {displayData.length === 0 && (
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
