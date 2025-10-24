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
import { Separator } from "@/components/ui/separator";
import type { AaveV3Summary } from "@/lib/aave-v3/types";
import {
  BridgeAndExecuteButton,
  EthereumProvider,
  SUPPORTED_CHAINS_IDS,
  SUPPORTED_TOKENS,
  TOKEN_CONTRACT_ADDRESSES,
  TOKEN_METADATA,
  useNexus,
} from "@avail-project/nexus-widgets";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import ViewUnifiedBalance from "@/components/nexus/view-balance";

type Props = {
  row: AaveV3Summary;
};

export function SupplyMarketDialog({ row }: Props) {
  const [open, setOpen] = useState(false);
  const { initializeSdk, isSdkInitialized } = useNexus();
  const [loading, setLoading] = useState(false);
  const { isConnected, isDisconnected, status, connector } = useAccount();
  // console.log(row);
  const compactUsd = (n: number) =>
    `$${new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    })
      .format(n)
      .toLowerCase()}`;

  const disabled = row.isPaused || row.isFrozen;

  const handleInitializeSDK = async () => {
    if (isSdkInitialized) return;
    setLoading(true);
    try {
      await initializeSdk();
    } catch (error) {
      console.error("Unable to initialize SDK:", error);
    } finally {
      setLoading(false);
    }
  };

  const widgetButtonClick = async (onClick: () => void) => {
    console.log("row", row);
    if (!isSdkInitialized) {
      await handleInitializeSDK();
    }
    onClick();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          Supply
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md border border-zinc-500 bg-zinc-900">
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
            <div className="min-w-0 flex flex-col items-start">
              <DialogTitle className="flex items-center gap-2 truncate">
                <span>Supply {row.supplyTokenSymbol}</span>
                <span className="">on</span>
                <span className="">{row.chainName}</span>
              </DialogTitle>
              <DialogDescription>
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-0.5 text-xs text-theme-orange ring-1 ring-theme-orange/30 mt-2">
                  {row.protocolName}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border border-zinc-600 p-3">
              <div className="text-muted-foreground">APY</div>
              <div className="mt-1 font-semibold text-theme-orange">
                {row.apy.toFixed(2)}%
              </div>
            </div>
            <div className="rounded-md border border-zinc-600 p-3">
              <div className="text-muted-foreground">TVL</div>
              <div className="mt-1 font-semibold">{compactUsd(row.tvlUSD)}</div>
            </div>
            <div className="rounded-md border border-zinc-600 p-3">
              <div className="text-muted-foreground text-xs">
                Total market size
              </div>
              <div className="mt-1 font-medium">
                {compactUsd(Number(row.totalMarketSize))}
              </div>
            </div>
            <div className="rounded-md border border-zinc-600 p-3">
              <div className="text-muted-foreground text-xs">
                Available liquidity
              </div>
              <div className="mt-1 font-medium">
                {compactUsd(Number(row.totalAvailableLiquidity))}
              </div>
            </div>
          </div>

          <Separator />
        </div>

        <div className="w-full flex justify-center">
          {isConnected && (
            <BridgeAndExecuteButton
              className="w-full"
              contractAddress={row.marketAddress}
              contractAbi={
                [
                  {
                    inputs: [
                      {
                        internalType: "address",
                        name: "asset",
                        type: "address",
                      },
                      {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                      },
                      {
                        internalType: "address",
                        name: "onBehalfOf",
                        type: "address",
                      },
                      {
                        internalType: "uint16",
                        name: "referralCode",
                        type: "uint16",
                      },
                    ],
                    name: "supply",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                  },
                ] as const
              }
              functionName="supply"
              buildFunctionParams={(token, amount, _chainId, user) => {
                const decimals = TOKEN_METADATA[token].decimals;
                const amountWei = parseUnits(amount, decimals);
                const tokenAddr = TOKEN_CONTRACT_ADDRESSES[token][_chainId];
                return { functionParams: [tokenAddr, amountWei, user, 0] };
              }}
              prefill={{
                toChainId: row.chainId as SUPPORTED_CHAINS_IDS,
                token: row.supplyTokenSymbol as SUPPORTED_TOKENS,
              }}
            >
              {({ onClick, isLoading }) => (
                <Button
                  onClick={() => widgetButtonClick(onClick)}
                  disabled={isLoading || loading}
                  className="w-full font-bold rounded-lg"
                >
                  {loading
                    ? "Initializing..."
                    : isLoading
                    ? "Processing…"
                    : "Bridge & Stake"}
                </Button>
              )}
            </BridgeAndExecuteButton>
          )}

          {isDisconnected && (
            <div className="text-center text-sm text-muted-foreground">
              Please connect your wallet to supply
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
