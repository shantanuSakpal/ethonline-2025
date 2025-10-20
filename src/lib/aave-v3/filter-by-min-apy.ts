import { AaveV3Summary } from "@/lib/aave-v3/types";

export const filterByMinAPY = (
  markets: AaveV3Summary[],
  minAPY: number
): AaveV3Summary[] => {
  return markets.filter((market) => market.apy >= minAPY);
};
