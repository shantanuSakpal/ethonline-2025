"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { supportedMarkets } from "@/lib/aave-v3/markets";
import { evmAddress, useUserSupplies } from "@aave/react";
import WithdrawDialog from "@/components/portfolio/protocol/WithdrawDialog";

export default function UserAaveSupplies() {
  const { address } = useAccount();
  const [selectedPosition, setSelectedPosition] = useState<any>(null);

  if (!address)
    return (
      <div className="text-center py-10 text-gray-500">
        Connect your wallet to view your supplies.
      </div>
    );

  const { data, error, loading } = useUserSupplies({
    markets: supportedMarkets,
    user: evmAddress(address),
  });

  const handleRefresh = async () => {
    // Wait a bit for the transaction to be indexed
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Trigger a page reload to refresh all portfolio data
    window.location.reload();
  };

  if (error) {
    //@ts-ignore
    return <p className="text-red-500 text-center mt-8">Error: {error.name}</p>;
  }

  if (loading) {
    return (
      <p className="text-gray-400 text-center mt-8">Loading positions...</p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-8">
        No Aave supply positions found.
      </p>
    );
  }

  return (
    <section className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm md:text-base border-collapse">
          <thead>
            <tr className="text-zinc-400 bg-zinc-900">
              <th className="py-3 px-4 text-left rounded-l-lg">Chain</th>
              <th className="py-3 px-4 text-left ">Asset</th>
              <th className="py-3 px-4 text-left">APY</th>
              <th className="py-3 px-4 text-left">Balance</th>
              <th className="py-3 px-4 text-left">USD Value</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((pos) => {
                const usdValue = parseFloat(pos.balance?.usd || "0");
                return usdValue >= 0.0001; // filter out tiny balances
              })
              .map((pos, i) => {
                const { market, currency, balance, apy } = pos;
                const usdValue = parseFloat(balance.usd).toFixed(2);
                const tokenValue = balance.amount.value;

                return (
                  <tr
                    key={i}
                    className="border-t border-zinc-800 hover:bg-zinc-900/60 transition-colors"
                  >
                    {/* Chain */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src={market.chain.icon}
                          alt={market.chain.name}
                          width={16}
                          height={16}
                          className="rounded-full"
                        />
                        <span className="text-zinc-100">
                          {market.chain.name}
                        </span>
                      </div>
                    </td>
                    {/* Asset */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-white ring-1 ring-zinc-300 dark:ring-zinc-700">
                          <Image
                            src={currency.imageUrl}
                            alt={currency.symbol}
                            fill
                            sizes="32px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-zinc-100">
                            {currency.symbol}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {currency.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* APY */}
                    <td className="py-4 px-4 text-green-500 font-medium">
                      {parseFloat(apy.formatted).toFixed(2)}%
                    </td>

                    {/* Balance */}
                    <td className="py-4 px-4 text-zinc-100 tabular-nums">
                      {tokenValue}
                    </td>

                    {/* USD Value */}
                    <td className="py-4 px-4 text-zinc-100 tabular-nums">
                      ${usdValue}
                    </td>

                    {/* Withdraw Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          console.log("pos --- ", pos);
                          setSelectedPosition(pos);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition-all"
                      >
                        Withdraw
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {selectedPosition && (
        <WithdrawDialog
          isOpen={!!selectedPosition}
          onClose={() => setSelectedPosition(null)}
          position={selectedPosition}
          onRefresh={handleRefresh}
        />
      )}
    </section>
  );
}
