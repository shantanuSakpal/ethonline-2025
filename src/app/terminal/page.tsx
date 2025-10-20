"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MarketsList from "@/components/markets-list";

export default function Terminal() {
  return (
    <div className="flex flex-col gap-8 p-5">
      <header className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Yield Terminal</h1>
          <p className="text-sm text-muted-foreground">
            Unify • Bridge • Swap • Deposit — in one flow.
          </p>
        </div>
        {/* <div className="flex items-center gap-3">
          <ConnectWallet />
          <NexusInitButton />
        </div> */}
      </header>

      <div>
        <MarketsList />
      </div>

      <Card className="border-theme-orange/30">
        <CardHeader>
          <CardTitle>Flow Explanation</CardTitle>
          <CardDescription>
            What happens when you click “One-click Allocate”.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Fetch balances and compute unified USDC/ETH across chains.</li>
            <li>Bridge to destination chain using Nexus.</li>
            <li>
              Swap to target token (e.g. tBTC) via Uniswap on destination chain.
            </li>
            <li>Deposit to the selected protocol market.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
