"use client";

import useSWR from "swr";
import { ComplexProtocol } from "@/app/api/portfolio/protocols/route";
import { ProtocolDetails } from "./protocol/ProtocolDetails";
import { fetcher } from "@/components/portfolio/Portfolio";
import dynamic from "next/dynamic";

export default function ProtocolList({ address }: { address: string }) {
  // Protocols
  const { data, error, isLoading } = useSWR<{ complex: ComplexProtocol[] }>(
    `/api/portfolio/protocols?address=${address}`,
    fetcher
  );

  const protocols = data?.complex ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Protocols section */}
      <section>
        <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-2">
          Protocols
        </h3>

        {isLoading && (
          <div className="py-2 text-sm text-gray-400">Loading protocols...</div>
        )}

        {error && (
          <div className="py-2 text-sm text-red-500">
            Failed to load protocols.
          </div>
        )}

        {!isLoading && !error && (
          <div>
            {protocols.length === 0 ? (
              <div className="py-2 text-sm text-zinc-500 dark:text-zinc-400">
                No protocol data.
              </div>
            ) : (
              protocols.map((p) => <ProtocolDetails key={p.id} protocol={p} />)
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex flex-col gap-1">
          <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-3 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  );
}
