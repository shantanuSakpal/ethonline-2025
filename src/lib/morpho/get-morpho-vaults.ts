import { fetchMorphoVaults } from "./morpho-client";
import { summarizeMorphoVaults } from "./summarize-morpho-vaults";
import type { MorphoV3Summary } from "./types";

export async function getMorphoVaults(
  shouldFetch = false
): Promise<MorphoV3Summary[]> {
  if (!shouldFetch) {
    return [];
  }

  try {
    const vaults = await fetchMorphoVaults();
    const summarized = summarizeMorphoVaults(vaults);
    // Filter for vaults with TVL greater than 50 million USD
    const MIN_MORPHO_TVL = 50_000_000; // 50 million USD
    return summarized.filter((vault) => vault.tvlUSD >= MIN_MORPHO_TVL);
  } catch (error) {
    console.error("Failed to get Morpho vaults:", error);
    return [];
  }
}
