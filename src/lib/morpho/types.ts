import type { AaveV3Summary } from "@/lib/aave-v3/types";

export type MorphoVaultResponse = {
  address: string;
  name: string;
  symbol: string;
  whitelisted: boolean;
  chain: {
    id: number;
    network: string;
  };
  asset: {
    id: string;
    address: string;
    symbol: string;
    decimals: number;
  };
  state: {
    totalAssets: string;
    totalAssetsUsd: number;
    apy: number;
    netApy: number;
    sharePrice: string;
    sharePriceUsd: number;
  };
  metadata: {
    description: string | null;
    image: string | null;
    forumLink: string | null;
  };
};

export type MorphoVaultsQueryResponse = {
  vaults: {
    items: MorphoVaultResponse[];
  };
};

// Morpho vaults use the same summary format as Aave for consistency
export type MorphoV3Summary = AaveV3Summary;
