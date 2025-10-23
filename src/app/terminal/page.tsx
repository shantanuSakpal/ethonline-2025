"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MarketsList from "@/components/terminal/markets-list";
import {
  BridgeAndExecuteButton,
  BridgeButton,
  TransferButton,
  SwapButton,
  useNexus,
} from "@avail-project/nexus-widgets";
import {
  SUPPORTED_CHAINS,
  TOKEN_CONTRACT_ADDRESSES,
  TOKEN_METADATA,
} from "@avail-project/nexus-widgets";
import { Button } from "@/components/ui/button";
import { parseUnits } from "viem";
import { useState } from "react";
import WalletConnection from "@/components/nexus/connect-wallet";
export default function Terminal() {
  const { initializeSdk, isSdkInitialized } = useNexus();
  const [loading, setLoading] = useState(false);

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
    if (!isSdkInitialized) {
      await handleInitializeSDK();
    }
    onClick();
  };

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

      <div
        className="bg-card rounded-lg border border-gray-400 p-6 shadow-sm text-center w-3/4 hidden"
        key={"usdc-aave"}
      >
        <h3 className="text-lg font-semibold mb-4">
          Bridge & Supply USDC on AAVE
        </h3>
        <BridgeAndExecuteButton
          contractAddress={"0xA238Dd80C259a72e81d7e4664a9801593F98d1c5"}
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
            toChainId: SUPPORTED_CHAINS.BASE,
            token: "USDC",
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
      </div>
      <WalletConnection />
    </div>
  );
}
