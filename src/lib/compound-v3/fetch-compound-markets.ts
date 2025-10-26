import type { CompoundV3ApiResponse } from "./types";

export async function fetchCompoundMarkets(): Promise<CompoundV3ApiResponse[]> {
  const response = await fetch(
    "https://v3-api.compound.finance/market/all-networks/all-contracts/summary"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Compound markets: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("response --- ", data);

  return data;
}
