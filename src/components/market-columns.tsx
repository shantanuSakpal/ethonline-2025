"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AaveV3Summary } from "@/lib/aave-v3/types";
import Image from "next/image";
import { SupplyMarketDialog } from "@/components/supply-dialog";

export const marketsColumns: ColumnDef<AaveV3Summary>[] = [
  {
    accessorKey: "chainName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-2 cursor-pointer"
      >
        Chain <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Image
          src={row.original.chainLogo}
          alt={row.original.chainName}
          width={16}
          height={16}
          className="w-6 h-6 rounded-full"
        />
      </div>
    ),
  },
  {
    accessorKey: "protocolName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-2 cursor-pointer"
      >
        Protocol <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => row.original.protocolName,
  },
  {
    id: "market",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-2 cursor-pointer"
      >
        Market <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    sortingFn: (a, b) =>
      (a.original.supplyTokenName || "").localeCompare(
        b.original.supplyTokenName || ""
      ),
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex items-center gap-2">
          {r.supplyTokenLogo ? (
            <Image
              className="w-6 h-6 rounded-full"
              src={r.supplyTokenLogo}
              alt={r.supplyTokenName}
              width={16}
              height={16}
            />
          ) : null}
          <span>{r.supplyTokenName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "apy",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-2 cursor-pointer"
      >
        APY <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium text-theme-orange">
        {row.original.apy.toFixed(2)}%
      </span>
    ),
    sortingFn: "auto",
  },
  {
    accessorKey: "tvlUSD",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-2 cursor-pointer"
      >
        TVL <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) =>
      `$${new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      })
        .format(row.original.tvlUSD)
        .toLowerCase()}`,
    sortingFn: "auto",
  },
  {
    id: "actions",
    header: () => <span className="px-2">Actions</span>,
    cell: ({ row }) => (
      <SupplyMarketDialog
        marketAddress={row.original.marketAddress}
        chainId={row.original.chainId}
        row={row.original}
      />
    ),
    enableSorting: false,
  },
];
