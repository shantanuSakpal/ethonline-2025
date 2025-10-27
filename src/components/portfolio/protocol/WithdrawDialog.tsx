"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { formatUnits, parseUnits, type Address } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAaveMarket } from "@aave/react";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

// ERC20 ABI for approval
const erc20Abi = [
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
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
];

// Aave Pool ABI for withdraw
const aavePoolAbi = [
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "to", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;

export default function WithdrawDialog({
  isOpen,
  onClose,
  position,
  onRefresh,
}: any) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [approvalSuccess, setApprovalSuccess] = useState(false);

  const { data: walletClient } = useWalletClient();

  const { market, currency, apy, balance } = position;

  const { data: aaveMarketData, loading: aaveMarketLoading } = useAaveMarket({
    address: market.address,
    chainId: market.chain.chainId,
  });

  const fromAddress = walletClient?.account?.address as Address | undefined;
  // const chainId = market.chain.chainId;

  // // Extract reserve data
  const matchedReserve = useMemo(() => {
    if (!aaveMarketData?.supplyReserves) return null;
    return aaveMarketData.supplyReserves.find(
      (reserve: any) =>
        reserve.underlyingToken.address.toLowerCase() ===
        currency.address.toLowerCase()
    );
  }, [aaveMarketData, currency.address]);

  const poolAddress = matchedReserve?.market.address;
  const assetAddress = matchedReserve?.underlyingToken.address as Address;
  // The aToken address is the balance address
  const aTokenAddress = matchedReserve?.aToken.address as Address | undefined;

  // Approval transaction hooks
  const {
    writeContractAsync: writeApprovalAsync,
    data: approvalTxHash,
    isPending: isApprovalPending,
  } = useWriteContract();

  const { isLoading: isApprovalLoading, isSuccess: isApprovalSuccess } =
    useWaitForTransactionReceipt({ hash: approvalTxHash });

  // Withdraw transaction hooks
  const {
    writeContractAsync: writeWithdrawAsync,
    data: withdrawTxHash,
    isPending: isWithdrawPending,
  } = useWriteContract();

  const { isLoading: isWithdrawLoading, isSuccess: isWithdrawSuccess } =
    useWaitForTransactionReceipt({ hash: withdrawTxHash });

  // Handle approval success
  useEffect(() => {
    if (isApprovalSuccess) {
      setApprovalSuccess(true);
      toast.success("Approval successful! Click 'Withdraw' to proceed.");
    }
  }, [isApprovalSuccess]);

  // Handle withdraw success
  useEffect(() => {
    if (isWithdrawSuccess) {
      toast.success("Withdraw successful!");
      onClose();
      if (onRefresh) {
        onRefresh();
      }
    }
  }, [isWithdrawSuccess, onClose, onRefresh]);

  // Approval function
  async function handleApprove() {
    if (!aTokenAddress || !poolAddress || !fromAddress || !amount) return;

    try {
      const amountInWei = parseUnits(amount, currency.decimals);

      await writeApprovalAsync({
        address: aTokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [poolAddress, BigInt(amountInWei.toString())],
      });
    } catch (err: any) {
      if (err?.message?.includes("User rejected")) {
        console.log("User rejected approval");
      } else {
        console.error("Approval error:", err);
        setError(err.message || "Approval failed");
      }
    }
  }

  async function handleWithdraw() {
    if (!assetAddress || !fromAddress || !amount || !poolAddress) return;

    try {
      const amountInWei = parseUnits(amount, currency.decimals);

      await writeWithdrawAsync({
        address: poolAddress,
        abi: aavePoolAbi,
        functionName: "withdraw",
        args: [assetAddress, BigInt(amountInWei.toString()), fromAddress],
      });
    } catch (err: any) {
      if (err?.message?.includes("User rejected")) {
        console.log("User rejected withdraw");
      } else {
        console.error("Withdraw error:", err);
        setError(err.message || "Withdraw failed");
      }
    }
  }

  const buttonText = (() => {
    if (isApprovalPending || isApprovalLoading) return "Approving…";
    if (isWithdrawPending || isWithdrawLoading) return "Withdrawing…";
    if (!approvalSuccess) return "Approve & Withdraw";
    return "Withdraw";
  })();

  const handleClick = async () => {
    if (!approvalSuccess) {
      await handleApprove();
    } else {
      await handleWithdraw();
    }
  };

  const isLoading =
    isApprovalPending ||
    isApprovalLoading ||
    isWithdrawPending ||
    isWithdrawLoading;
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
              {Number(balance.amount.value).toFixed(2)} {currency.symbol}
            </span>
          </p>
          <Label className="text-sm text-zinc-400">Amount</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 flex-1"
              max={balance.amount.value}
            />
            <Button
              type="button"
              onClick={() => setAmount(balance.amount.value)}
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 whitespace-nowrap"
            >
              Max
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleClick}
            disabled={
              !amount ||
              !aTokenAddress ||
              isLoading ||
              Number(amount) > Number(balance.amount.value)
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {buttonText}
          </Button>
        </DialogFooter>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {approvalSuccess && !isWithdrawSuccess && (
          <p className="mt-2 text-blue-400 text-sm">
            Token approved. Click "Withdraw" to proceed.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
