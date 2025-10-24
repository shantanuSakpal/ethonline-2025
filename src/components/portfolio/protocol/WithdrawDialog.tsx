"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWalletClient } from "wagmi";
import { EnsoClient } from "@ensofinance/sdk";
import { formatUnits, parseUnits, type Address } from "viem";
import {
  useWriteContract,
  useReadContracts,
  useWaitForTransactionReceipt,
} from "wagmi";
import { bigDecimal, evmAddress, useAaveMarket } from "@aave/react";
import { Label } from "@/components/ui/label";

// ABI for token approval
const erc20Abi = [
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
];

export default function WithdrawDialog({ isOpen, onClose, position }: any) {
  const { data: walletClient } = useWalletClient();
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [route, setRoute] = useState<any>(null);
  const [approval, setApproval] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { market, currency, apy, balance } = position;

  const {
    data: aaveMarketData,
    loading: aaveMarketLoading,
    error: aaveMarketError,
  } = useAaveMarket({
    address: market.address,
    chainId: market.chain.chainId,
  });

  const chainId = market.chain.chainId;
  const fromAddress = walletClient?.account?.address as
    | `0x${string}`
    | undefined;

  // Read token decimals
  const { data: metaData } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: currency.address as Address,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ],
    query: { enabled: !!currency.address },
  });
  const decimals =
    typeof metaData?.[0]?.result === "number" ? metaData[0].result : 18;

  const {
    writeContractAsync,
    data: txHash,
    isPending: isWriting,
  } = useWriteContract();
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({ hash: txHash });

  // Fetch Enso route and approval data
  useEffect(() => {
    if (!fromAddress || !amount || !decimals || aaveMarketLoading) return;
    let cancelled = false;
    // Find the supply reserve that matches the underlying token (user's supplied asset)
    const matchedReserve = aaveMarketData?.supplyReserves.find(
      (reserve: any) =>
        reserve.underlyingToken.address.toLowerCase() ===
        currency.address.toLowerCase()
    );

    // Extract its aToken address to use as tokenIn for Enso withdraw
    const aTokenAddress = matchedReserve?.aToken?.address;
    const supplyTokenAddress = matchedReserve?.underlyingToken?.address;

    console.log("Matched reserve:", matchedReserve);
    console.log("Using aToken for withdraw:", aTokenAddress);

    const fetchRoute = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_ENSO_API_KEY!;
        const enso = new EnsoClient({ apiKey });
        const amountIn = parseUnits(amount, decimals).toString();
        const slippagePct = parseFloat(slippage) * 100;

        if (!aTokenAddress || !supplyTokenAddress) {
          setError("No matching aToken found for this asset in Aave market");
          setLoading(false);
          return;
        }

        const [approvalData, routeData] = await Promise.all([
          enso.getApprovalData({
            fromAddress,
            tokenAddress: aTokenAddress,
            amount: amountIn,
            chainId,
          }),
          enso.getRouteData({
            chainId,
            fromAddress,
            receiver: fromAddress,
            amountIn: [amountIn],
            tokenIn: [aTokenAddress],
            tokenOut: [supplyTokenAddress],
            slippage: slippagePct,
            routingStrategy: "router",
          }),
        ]);

        if (!cancelled) {
          setApproval(approvalData);
          setRoute(routeData);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to fetch route");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRoute();
    return () => {
      cancelled = true;
    };
  }, [
    amount,
    slippage,
    fromAddress,
    chainId,
    currency.address,
    decimals,
    aaveMarketData,
  ]);

  async function handleApprove() {
    if (!approval) return;
    try {
      await writeContractAsync({
        address: approval.tx.to as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [approval.spender, BigInt(approval.amount)],
      });
      setApprovalSuccess(true);
    } catch (err: any) {
      if (err?.message?.includes("User rejected")) {
        console.log({ "user rejected approval": err });
      } else {
        console.error("Approval error:", err);
      }
    }
  }

  async function handleWithdraw() {
    if (!route) return;
    try {
      console.log("Executing withdraw transaction...");
      await walletClient?.sendTransaction({
        chain: undefined,
        account: fromAddress!,
        to: route.tx.to as Address,
        value: BigInt(route.tx.value),
        data: route.tx.data as `0x${string}`,
      });
      setWithdrawSuccess(true);
      console.log(`Withdraw successful on ${chainId}.`);
      // close the dialog
      onClose();
    } catch (err: any) {
      if (err?.message?.includes("User rejected")) {
        console.log("User rejected withdraw.");
      } else {
        console.log("Withdraw error:", err);
      }
    }
  }

  const buttonText = (() => {
    if (aaveMarketLoading) return "Fetching market data…";
    if (loading) return "Fetching route…";
    if (isWriting || isTxLoading) return "Processing…";
    if (!approvalSuccess) return "Approve Token";
    return "Withdraw Tokens";
  })();

  const handleClick = async () => {
    if (!approvalSuccess) await handleApprove();
    else await handleWithdraw();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Withdraw {currency.symbol}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-zinc-400">
            Available:{" "}
            <span className="text-zinc-100 font-medium">
              {balance.amount.value} {currency.symbol}
            </span>
          </p>
          <Label className="text-sm text-zinc-400">Amount</Label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-zinc-100"
          />
          <Label className="text-sm text-zinc-400">Slippage</Label>
          <Input
            type="number"
            placeholder="Slippage (%)"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-zinc-100"
          />

          {route && (
            <div className="text-xs text-zinc-400 mt-2 space-y-1">
              <p>
                Est. Output:{" "}
                <span className="text-zinc-100">
                  {formatUnits(BigInt(route.amountOut ?? "0"), decimals)}{" "}
                  {currency.symbol}
                </span>
              </p>
              <p>
                Min Output:{" "}
                <span className="text-zinc-100">
                  {formatUnits(BigInt(route.minAmountOut ?? "0"), decimals)}{" "}
                  {currency.symbol}
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleClick}
            disabled={
              !amount ||
              loading ||
              isWriting ||
              isTxLoading ||
              aaveMarketLoading
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {buttonText}
          </Button>
        </DialogFooter>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {approvalSuccess && !withdrawSuccess && (
          <p className="mt-2 text-blue-400 text-sm">
            Token approved. You can now withdraw.
          </p>
        )}
        {withdrawSuccess && (
          <p className="mt-2 text-green-400 text-sm">Withdraw successful.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
