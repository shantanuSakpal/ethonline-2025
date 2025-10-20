import { AaveV3Summary } from "@/lib/aave-v3/types";
import { Market } from "@aave/client";

export const filterByMinTVL = (
  markets: AaveV3Summary[],
  minTVL: number
): AaveV3Summary[] => {
  return markets.filter((market) => market.tvlUSD >= minTVL);
};
