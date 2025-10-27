import { fetchCompoundMarkets } from "./fetch-compound-markets";
import { summarizeCompoundV3Markets } from "./summarize-compound-v3-markets";
import { fetchProtocolConfig } from "./fetch-protocol-config";
import type { AaveV3Summary } from "@/lib/aave-v3/types";
import type { CompoundV3ApiResponse } from "./types";

/**
 * Enrich market data with protocol configuration from smart contracts
 */
async function enrichMarketData(
  market: CompoundV3ApiResponse
): Promise<CompoundV3ApiResponse> {
  try {
    const config = await fetchProtocolConfig(
      market.chain_id,
      market.comet.address as `0x${string}`
    );
    return {
      ...market,
      base_token: config.baseToken,
      base_token_name: config.baseTokenName,
      base_token_symbol: config.baseTokenSymbol,
      calculated_apy: config.supplyAPY,
    };
  } catch (error) {
    console.error(
      `Failed to enrich market data for ${market.comet.address}:`,
      error
    );
    return market;
  }
}

export async function getCompoundMarkets(
  useSmartContractData: boolean
): Promise<AaveV3Summary[]> {
  const markets = await fetchCompoundMarkets();

  // Optionally enrich with smart contract data
  const enrichedMarkets = useSmartContractData
    ? await Promise.all(markets.map(enrichMarketData))
    : markets;

  return summarizeCompoundV3Markets(enrichedMarkets) as AaveV3Summary[];
}
