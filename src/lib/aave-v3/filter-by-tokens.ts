import { AaveV3Summary } from "@/lib/aave-v3/types";

export const filterByTokens = (
  markets: AaveV3Summary[],
  tokens: string[]
): AaveV3Summary[] => {
  return markets.filter((market) => tokens.includes(market.supplyTokenSymbol));
};
