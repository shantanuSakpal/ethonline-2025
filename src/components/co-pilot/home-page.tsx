"use client";

import React from "react";

import { Wallet } from "@/components/co-pilot/wallet";
import { PageHeader } from "@/components/ui/page-header";
import { useJwtContext } from "@lit-protocol/vincent-app-sdk/react";

export default function HomePage() {
  const { authInfo } = useJwtContext();
  const walletAddress = authInfo?.pkp.ethAddress;

  return (
    <main className="relative px-4 sm:px-6 md:px-8 flex justify-center pt-8 sm:pt-16 md:pt-24 pb-8 max-w-2xl mx-auto">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-zinc-100 text-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm w-full">
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
