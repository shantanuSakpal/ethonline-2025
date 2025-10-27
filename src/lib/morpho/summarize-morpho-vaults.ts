import type { MorphoV3Summary } from "./types";
import type { MorphoVaultResponse } from "./types";
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

export function summarizeMorphoVaults(
  vaults: MorphoVaultResponse[]
): MorphoV3Summary[] {
  return vaults
    .sort((a, b) => b.state.apy - a.state.apy) // Sort by APY descending
    .map((vault) => {
      const chainInfo = CHAIN_INFO[vault.chain.id] || {
        name: `Chain ${vault.chain.id}`,
        logo:
          CHAIN_LOGO_URL[vault.chain.id] ||
          "https://statics.aave.com/ethereum.svg",
        symbol: "ETH",
      };

      const supplyTokenSymbol = vault.asset.symbol;
      const supplyTokenName = vault.name;
      const supplyTokenAddress = vault.asset.address as `0x${string}`;

      // Use vault image if available, otherwise generate from token logo
      const supplyTokenLogo = `https://token-logos.family.co/asset?id=${vault.chain.id}:${supplyTokenAddress}&token=${supplyTokenSymbol}`;

      const apy = vault.state.apy * 100; // Convert to percentage

      return {
        supplyTokenName,
        supplyTokenSymbol,
        supplyTokenLogo,
        supplyTokenAddress,
        aaveWrappedTokenName: vault.name,
        aaveWrappedTokenSymbol: vault.symbol,
        aaveWrappedTokenLogo: supplyTokenLogo,
        chainName: chainInfo.name,
        chainId: vault.chain.id,
        chainLogo: chainInfo.logo,
        protocolName: "Morpho",
        protocolLogo: "/external-logos/eth.svg", // Update with actual Morpho logo
        apy,
        tvlUSD: vault.state.totalAssetsUsd,
        canBeCollateral: true,
        maxLTV: 90, // Morpho vaults typically have high LTV
        liquidationThreshold: 95, // Morpho vaults default
        liquidationBonus: 5, // Morpho vaults default
        isFrozen: false,
        isPaused: false,
        flashLoanEnabled: false,
        totalMarketSize: vault.state.totalAssetsUsd,
        totalAvailableLiquidity: vault.state.totalAssetsUsd,
        marketAddress: vault.address as `0x${string}`,
      };
    });
}
