"use client";

import React, { useCallback, useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreateDCA } from "@/components/co-pilot/create-dca";
import { ActiveDcas } from "@/components/co-pilot/active-dcas";
import { Wallet } from "@/components/co-pilot/wallet";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { WalletModal } from "@/components/co-pilot/wallet-modal";
import { useChain } from "@/hooks/useChain";
import { useJwtContext } from "@lit-protocol/vincent-app-sdk/react";
import { ethers } from "ethers";

enum Tab {
  CreateDCA = "create-dca",
  ActiveDCAs = "active-dcas",
  Wallet = "wallet",
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CreateDCA);

  const { chain, usdcContract } = useChain();
  const { authInfo } = useJwtContext();
  const walletAddress = authInfo?.pkp.ethAddress;
  console.log("walletAddress", walletAddress);

  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);

  return (
    <main className="relative px-4 sm:px-6 md:px-8 flex justify-center pt-8 sm:pt-16 md:pt-24 pb-8 max-w-2xl mx-auto">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm w-full">
          <PageHeader
            title="Aave yield agent"
            subtitle="Automated yield strategies for your crypto."
            description="This app uses the Vincent platform to securely and verifiably execute yield strategies for your crypto investments on Aave v3 on Base."
          />

          <Wallet />

          {/* You can add tabs/sections here later if needed */}
        </div>
      </div>
    </main>
  );
}
