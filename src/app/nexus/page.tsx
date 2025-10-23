"use client";
import WalletConnection from "@/components/nexus/connect-wallet";
import Nexus from "@/components/nexus/nexus";
import ViewUnifiedBalance from "@/components/nexus/view-balance";
import { Activity } from "lucide-react";
import React from "react";
import { useAccount } from "wagmi";

export default function page() {
  const { status } = useAccount();

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Use Avail Nexus</h1>
          <p className="text-lg text-muted-foreground font-semibold">
            Allow users to seamlessly move tokens into your dApp, no bridging,
            and no confusion. Connect your wallet to experience the Nexus
            Effect.
          </p>
        </div>
        {status === "connected" && (
          <div className="flex items-center flex-col gap-y-2">
            <ViewUnifiedBalance />
            <Nexus />
          </div>
        )}

        <div className="text-center">
          {status === "disconnected" && (
            <Activity className="animate-pulse mx-auto" />
          )}
          <WalletConnection />
        </div>
      </div>
    </div>
  );
}
