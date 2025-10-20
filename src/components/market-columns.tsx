"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AaveV3Summary } from "@/lib/aave-v3/types";
import Image from "next/image";

export const marketsColumns: ColumnDef<AaveV3Summary>[] = [
  {
    accessorKey: "chainName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-2"
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
        className="px-2"
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
        className="px-2"
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
        className="px-2"
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
        className="px-2"
      >
        TVL <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => `$${Intl.NumberFormat().format(row.original.tvlUSD)}`,
    sortingFn: "auto",
  },
];
