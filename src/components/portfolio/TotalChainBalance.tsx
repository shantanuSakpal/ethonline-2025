// example usage
import { fetcher } from "@/components/portfolio/Portfolio";
import Image from "next/image";
import useSWR from "swr";

export function TotalChainBalance({
  address,
  chain,
}: {
  address: string;
  chain: "core" | "base";
}) {
  const { data } = useSWR<{ usd_value: number }>(
    `/api/portfolio/total-chain-balance?address=${address}&chain=${chain}`,
    fetcher
  );
  const total = data?.usd_value ?? 0;
  return (
    <div className="flex flex-row items-center justify-center gap-2 px-2 py-1 border rounded-lg">
      <Image
        src={chain === "base" ? "/images/base.png" : "/images/core.png"}
        width={50}
        height={50}
        alt={`${chain} chain image`}
        className="w-10 h-10"
      />
      <div className="text-lg font-bold">${total.toFixed(2)}</div>
    </div>
  );
}
