"use client";

import { useEffect, useMemo, useState } from "react";
import { useNexus } from "@/providers/NexusProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LucideRefreshCcw } from "lucide-react";
import { getAaveV3Stats } from "@/lib/aave-v3/get-aave-v3-stats";
import type { AaveV3Summary } from "@/lib/aave-v3/types";
import { DataTable } from "@/components/ui/data-table";
import { marketsColumns } from "@/components/terminal/market-columns";

export default function MarketsList() {
  const { nexusSDK } = useNexus();
  const [protocol, setProtocol] = useState<"Aave" | "Compound" | "All">("All");
  const [loading, setLoading] = useState(false);
  const [aaveStats, setAaveStats] = useState<AaveV3Summary[]>([]);
  const compoundStats: AaveV3Summary[] = []; // TODO: wire Compound

  const displayData = useMemo(() => {
    if (protocol === "Aave") return aaveStats;
    if (protocol === "Compound") return compoundStats;
    return [...aaveStats, ...compoundStats];
  }, [protocol, aaveStats]);

  const getAaveStats = async () => {
    try {
      setLoading(true);
      const data = await fetch("/api/get-aave-stats").then((res) => res.json());
      console.log("Aave stats:", data.stats);
      return data.stats;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAaveStats = async () => {
      const stats = await getAaveStats();
      if (stats) setAaveStats(stats);
    };
    fetchAaveStats();
  }, []);

  const getMarketData = async () => {
    const data = await fetch("/api/get-aave-market?marketAddress=0x123").then(
      (res) => res.json()
    );
    console.log("Market data:", data.market);
    return data.market;
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
                const stats = await getAaveStats();
                if (stats) setAaveStats(stats);
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
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-semibold">
                Protocol
              </label>
              <Tabs
                value={protocol}
                onValueChange={(v) => setProtocol(v as any)}
                className="w-full"
              >
                <TabsList className="w-full bg-background grid grid-cols-3">
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
            <DataTable columns={marketsColumns} data={displayData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
