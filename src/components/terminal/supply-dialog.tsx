import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { AaveV3Summary } from "@/lib/aave-v3/types";
import { ChainId } from "@aave/react";

type Props = {
  marketAddress: string;
  chainId: ChainId;
  row: AaveV3Summary;
};

export function SupplyMarketDialog({ marketAddress, chainId, row }: Props) {
  const [open, setOpen] = useState(false);
  const [amountUsd, setAmountUsd] = useState<string>("");
  // console.log(row);
  const compactUsd = (n: number) =>
    `$${new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    })
      .format(n)
      .toLowerCase()}`;

  const disabled = row.isPaused || row.isFrozen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          Supply
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {row.chainLogo && (
              <Image
                src={row.chainLogo}
                alt={row.chainName}
                width={28}
                height={28}
                className="w-7 h-7 rounded-full"
              />
            )}
            {row.supplyTokenLogo && (
              <Image
                src={row.supplyTokenLogo}
                alt={row.supplyTokenSymbol}
                width={28}
                height={28}
                className="w-7 h-7 rounded-full -ml-2 ring-2 ring-background"
              />
            )}
            <div className="min-w-0">
              <DialogTitle className="flex items-center gap-2 truncate">
                <span>Supply {row.supplyTokenSymbol}</span>
                <span className="text-xs text-muted-foreground">on</span>
                <span className="rounded-md bg-muted/40 px-2 py-0.5 text-xs">
                  {row.chainName}
                </span>
              </DialogTitle>
              <DialogDescription>
                <span className="inline-flex items-center gap-1 rounded-md bg-theme-blue/15 px-2 py-0.5 text-xs text-theme-blue ring-1 ring-theme-blue/30 mt-2">
                  {row.protocolName}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">APY</div>
              <div className="mt-1 font-semibold text-theme-orange">
                {row.apy.toFixed(2)}%
              </div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">TVL</div>
              <div className="mt-1 font-semibold">{compactUsd(row.tvlUSD)}</div>
            </div>

            <div className="rounded-md border p-3 col-span-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-muted-foreground text-xs">
                    Total market size
                  </div>
                  <div className="mt-1 font-medium">
                    {compactUsd(Number(row.totalMarketSize))}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">
                    Available liquidity
                  </div>
                  <div className="mt-1 font-medium">
                    {compactUsd(Number(row.totalAvailableLiquidity))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="amountUsd">Amount (USD)</Label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </div>
              <Input
                id="amountUsd"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="pl-7"
                value={amountUsd}
                onChange={(e) => setAmountUsd(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              console.log("Supply", { marketAddress, chainId, amountUsd });
            }}
            disabled={disabled || !amountUsd || Number(amountUsd) <= 0}
          >
            Supply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
