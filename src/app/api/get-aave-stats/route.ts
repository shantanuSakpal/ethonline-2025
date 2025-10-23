import { NextResponse } from "next/server";
import {
  MIN_APY,
  MIN_TVL,
  SUPPORTED_CHAINS,
  TEST_CHAINS,
} from "@/lib/constants";
import { client } from "@/lib/aave-v3/aave-client";
import { summarizeAaveV3Market } from "@/lib/aave-v3/summarize-aave-v3-markets";
import type { AaveV3Summary } from "@/lib/aave-v3/types";
import { Chain, ChainId, chainId, OrderDirection } from "@aave/client";
import { chains, markets } from "@aave/client/actions";
import { filterByMinTVL } from "@/lib/aave-v3/filter-by-min-tvl";
import { filterByMinAPY } from "@/lib/aave-v3/filter-by-min-apy";
import { filterByTokens } from "@/lib/aave-v3/filter-by-tokens";

export const getAaveStats = async (): Promise<AaveV3Summary[]> => {
  try {
    // const supportedChains = await chains(client);

    // if (supportedChains.isOk()) {
    //   // console.log("Supported Chains:", supportedChains.value);
    // } else {
    //   console.error("Error:", supportedChains.error);
    // }
    // const chainIdsSupportedByBothAaveV3AndAvail = supportedChains.isOk()
    //   ? supportedChains.value.filter(
    //       (chain: Chain) =>
    //         Object.values(SUPPORTED_CHAINS).includes(chain.chainId) &&
    //         // remove 84532 (Base Sepolia) from supported chains
    //         chain.chainId !== 84532
    //     )
    //   : [];
    // console.log(
    //   "Chain IDs supported by both Aave V3 and Avail:",
    //   chainIdsSupportedByBothAaveV3AndAvail
    // );

    const marketsResult = await markets(client, {
      chainIds: TEST_CHAINS as ChainId[],
      suppliesOrderBy: { supplyApy: OrderDirection.Desc },
    });

    if (marketsResult.isOk()) {
      // console.log(
      //   "Aave V3 Supply Reserves ----------------------:",
      //   marketsResult.value
      // );

      const summary = summarizeAaveV3Market(marketsResult.value);

      const filtered = filterByMinTVL(summary, MIN_TVL);
      const filteredByAPY = filterByMinAPY(filtered, MIN_APY);
      const filteredByTokens = filterByTokens(filteredByAPY, [
        "USDC",
        "USDT",
        "ETH",
      ]);
      // console.log(
      //   "Aave V3 Supply Reserves filtered by supported chains ----------------------:",
      //   filteredByAPY.length
      // );

      return filteredByTokens;
    } else {
      console.error("Aave V3 API error:", marketsResult.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching Aave stats:", error);
    return [];
  }
};

export async function GET(req: Request) {
  const stats = await getAaveStats();
  // error handling
  if (!stats) {
    return NextResponse.json(
      { error: "Failed to fetch Aave stats" },
      { status: 500 }
    );
  }
  return NextResponse.json({ stats }, { status: 200 });
}
