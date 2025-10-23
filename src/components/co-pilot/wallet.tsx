"use client";

import React, { useCallback, useMemo, useState } from "react";
import { ethers } from "ethers";
import {
  LogOut,
  RefreshCcw,
  Copy,
  Check,
  WalletIcon,
  ArrowDownToLine,
} from "lucide-react";

import { useJwtContext } from "@lit-protocol/vincent-app-sdk/react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { WalletModal } from "@/components/co-pilot/wallet-modal";
import { useBalance } from "wagmi";
import { base } from "wagmi/chains";

const formatAddress = (address: string | undefined) => {
  if (!address) return "Loading...";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const Wallet: React.FC = () => {
  const USDC_ON_BASE_ADDRESS = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";

  const [copied, setCopied] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { authInfo, logOut } = useJwtContext();

  const {
    data: usdcBalanceData,
    isError: isErrorUsdc,
    isLoading: isLoadingUsdc,
    refetch: refetchUsdc,
  } = useBalance({
    address: authInfo?.pkp.ethAddress as `0x${string}` | undefined,
    chainId: base.id,
    token: USDC_ON_BASE_ADDRESS as `0x${string}`,
  });

  const {
    data: ethBalanceData,
    isError: isErrorEth,
    isLoading: isLoadingEth,
    refetch: refetchEth,
  } = useBalance({
    address: authInfo?.pkp.ethAddress as `0x${string}` | undefined,
    chainId: base.id,
  });

  const isLoading = isLoadingEth || isLoadingUsdc;
  const errorMsg =
    isErrorEth || isErrorUsdc ? "Failed to fetch wallet balance" : null;

  const ethDisplay = useMemo(() => {
    if (!ethBalanceData) return "0.000000";
    const value = ethers.formatUnits(
      ethBalanceData.value,
      ethBalanceData.decimals ?? 18
    );
    return `${Number(value).toFixed(6)}`;
  }, [ethBalanceData]);
  console.log("ethbalance --- ", ethBalanceData);
  console.log("usdcBalance --- ", usdcBalanceData);

  const usdcDisplay = useMemo(() => {
    if (!usdcBalanceData) return "0.00";
    const value = ethers.formatUnits(
      usdcBalanceData.value,
      usdcBalanceData.decimals ?? 6
    );
    return `${Number(value).toFixed(2)}`;
  }, [usdcBalanceData]);

  const refreshBalances = useCallback(async () => {
    console.log("refreshing balances...");
    await Promise.allSettled([
      refetchEth?.() as Promise<unknown>,
      refetchUsdc?.() as Promise<unknown>,
    ]);
  }, [refetchEth, refetchUsdc]);

  const copyAddress = useCallback(async () => {
    const address = authInfo?.pkp.ethAddress;
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy address to clipboard", err);
    }
  }, [authInfo?.pkp.ethAddress]);

  return (
    <div data-test-id="wallet" className="w-full space-y-4 text-white">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span
            className="text-sm font-medium"
            style={{
              fontFamily: "Poppins, system-ui, sans-serif",
              color: "var(--footer-text-color, #121212)",
            }}
          >
            Wallet Address
          </span>
          <div className="flex items-center gap-2">
            <a
              href={`${base.blockExplorers.default.url}/address/${authInfo?.pkp.ethAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:opacity-80"
              title={authInfo?.pkp.ethAddress}
              style={{
                fontFamily:
                  '"Encode Sans Semi Expanded", system-ui, sans-serif',
                color: "#FF4205",
              }}
            >
              {formatAddress(authInfo?.pkp.ethAddress)}
            </a>
            <button
              onClick={copyAddress}
              disabled={!authInfo?.pkp.ethAddress}
              title={copied ? "Copied!" : "Copy address"}
              aria-label="Copy wallet address"
              className="p-0 bg-transparent border-none cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? (
                <Check className="h-5 w-5" style={{ color: "#FF4205" }} />
              ) : (
                <Copy className="h-5 w-5" style={{ color: "#FF4205" }} />
              )}
            </button>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span
            className="text-sm font-medium"
            style={{
              fontFamily: "Poppins, system-ui, sans-serif",
              color: "var(--footer-text-color, #121212)",
            }}
          >
            Network
          </span>
          <a
            href="https://basescan.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
          >
            <img
              src="/external-logos/base-logo.svg"
              alt="Base"
              className="w-4 h-4"
            />
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-md"
              style={{
                fontFamily: "Poppins, system-ui, sans-serif",
                backgroundColor: "#0052FF",
                color: "white",
              }}
            >
              {base.name}
            </span>
          </a>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/external-logos/eth.svg" alt="ETH" className="w-4 h-4" />
            <span
              className="text-sm font-medium"
              style={{
                fontFamily: "Poppins, system-ui, sans-serif",
                color: "var(--footer-text-color, #121212)",
              }}
            >
              ETH Balance
            </span>
          </div>
          <span
            className="text-sm font-medium"
            style={{
              fontFamily: '"Encode Sans Semi Expanded", system-ui, sans-serif',
              color: "var(--footer-text-color, #121212)",
            }}
          >
            {isLoading ? "Loading..." : `${ethDisplay} ${base.name}`}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/external-logos/usdc-coin-logo.svg"
              alt="USDC"
              className="w-4 h-4"
            />
            <span
              className="text-sm font-medium"
              style={{
                fontFamily: "Poppins, system-ui, sans-serif",
                color: "var(--footer-text-color, #121212)",
              }}
            >
              USDC Balance
            </span>
          </div>
          <span
            className="text-sm font-medium"
            style={{
              fontFamily: '"Encode Sans Semi Expanded", system-ui, sans-serif',
              color: "var(--footer-text-color, #121212)",
            }}
          >
            {isLoading ? "Loading..." : `${usdcDisplay} USDC`}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            backgroundColor: "#fff1f0",
            color: "#ff4d4f",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span role="img" aria-label="Error">
            ⚠️
          </span>{" "}
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          className="flex-1 min-w-0 "
          disabled={isLoading}
          onClick={refreshBalances}
        >
          {isLoading ? (
            <>
              <Spinner variant="destructive" size="sm" />{" "}
              <span className="truncate">Refreshing...</span>
            </>
          ) : (
            <>
              <RefreshCcw className="flex-shrink-0" />{" "}
              <span className="truncate">Refresh Balance</span>
            </>
          )}
        </Button>
        <Button className="flex-1 min-w-0" onClick={() => setIsModalOpen(true)}>
          <ArrowDownToLine className="flex-shrink-0" />{" "}
          <span className="truncate">Deposit</span>
        </Button>
        <Button
          className="flex-1 min-w-0"
          onClick={() =>
            window.open(
              `https://dashboard.heyvincent.ai/user/appId/${process.env.NEXT_PUBLIC_VINCENT_APP_ID}/wallet`,
              "_blank"
            )
          }
        >
          <WalletIcon className="flex-shrink-0" />{" "}
          <span className="truncate">Withdraw</span>
        </Button>
      </div>
      <Button className="w-full bg-red-300 hover:bg-red-400" onClick={logOut}>
        <LogOut className="flex-shrink-0 " />{" "}
        <span className="truncate">Log Out</span>
      </Button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        walletAddress={authInfo?.pkp.ethAddress}
      />
    </div>
  );
};
