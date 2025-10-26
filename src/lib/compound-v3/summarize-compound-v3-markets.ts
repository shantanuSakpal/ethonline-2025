import type { CompoundV3ApiResponse } from "./types";
import type { AaveV3Summary } from "@/lib/aave-v3/types";
import { CHAIN_LOGO_URL } from "@/lib/constants";

// Chain ID to chain info mapping
const CHAIN_INFO: Record<
  number,
  { name: string; logo: string; symbol: string }
> = {
  1: { name: "Ethereum", logo: CHAIN_LOGO_URL[1], symbol: "ETH" },
  8453: { name: "Base", logo: CHAIN_LOGO_URL[8453], symbol: "BASE" },
  137: { name: "Polygon", logo: CHAIN_LOGO_URL[137], symbol: "MATIC" },
  10: { name: "Optimism", logo: CHAIN_LOGO_URL[10], symbol: "OP" },
  42161: { name: "Arbitrum", logo: CHAIN_LOGO_URL[42161], symbol: "ARB" },
  43114: { name: "Avalanche", logo: CHAIN_LOGO_URL[43114], symbol: "AVAX" },
  56: { name: "BNB Chain", logo: CHAIN_LOGO_URL[56], symbol: "BNB" },
  534352: { name: "Scroll", logo: CHAIN_LOGO_URL[534352], symbol: "SCR" },
};

export function summarizeCompoundV3Markets(
  markets: CompoundV3ApiResponse[]
): AaveV3Summary[] {
  return markets
    .sort((a, b) => {
      // Use calculated APY if available, otherwise use API APY
      const aApy = a.calculated_apy ?? parseFloat(a.supply_apr) * 100;
      const bApy = b.calculated_apy ?? parseFloat(b.supply_apr) * 100;
      return bApy - aApy;
    })
    .flatMap((market) => {
      const chainInfo = CHAIN_INFO[market.chain_id] || {
        name: `Chain ${market.chain_id}`,
        logo:
          CHAIN_LOGO_URL[market.chain_id] ||
          "https://statics.aave.com/ethereum.svg",
        symbol: "ETH",
      };

      // Use base_token from protocol config if available, otherwise default to USDC
      // The base_token is the actual token address from the smart contract
      const supplyTokenName = market.base_token_name || "USDC"; // Use fetched name or default
      const supplyTokenSymbol = market.base_token_symbol || "USDC"; // Use fetched symbol or default
      const supplyTokenAddress =
        (market.base_token as `0x${string}`) ||
        (market.comet.address as `0x${string}`);

      // Dynamically generate token logo URL using family.co API
      const supplyTokenLogo = supplyTokenAddress
        ? `https://token-logos.family.co/asset?id=${market.chain_id}:${supplyTokenAddress}&token=${supplyTokenSymbol}`
        : "/external-logos/usdc-coin-logo.svg";

      // Use calculated APY from smart contract if available, otherwise use API data
      const apy = market.calculated_apy ?? parseFloat(market.supply_apr) * 100;

      return {
        supplyTokenName,
        supplyTokenSymbol,
        supplyTokenLogo,
        supplyTokenAddress,
        aaveWrappedTokenName: `${supplyTokenName} (Compound)`,
        aaveWrappedTokenSymbol: `c${supplyTokenSymbol}`,
        aaveWrappedTokenLogo: supplyTokenLogo,
        chainName: chainInfo.name,
        chainId: market.chain_id,
        chainLogo: chainInfo.logo,
        protocolName: "Compound",
        protocolLogo: "/external-logos/eth.svg", // Update with actual Compound logo
        apy,
        tvlUSD: parseFloat(market.total_supply_value),
        canBeCollateral: true,
        maxLTV: 75, // Compound V3 default
        liquidationThreshold: 80, // Compound V3 default
        liquidationBonus: 5, // Compound V3 default
        isFrozen: false,
        isPaused: false,
        flashLoanEnabled: false,
        totalMarketSize: parseFloat(market.total_supply_value),
        totalAvailableLiquidity: parseFloat(market.total_supply_value),
        marketAddress: market.comet.address as `0x${string}`,
      };
    });
}
