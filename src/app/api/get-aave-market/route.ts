import { NextResponse } from "next/server";

import { client } from "@/lib/aave-v3/aave-client";
import { chainId as toChainId, evmAddress, Market } from "@aave/client";
import { market as fetchMarket } from "@aave/client/actions";

export const getAaveMarket = async (
  address: string,
  chainIdNum: number
): Promise<Market | null> => {
  try {
    const result = await fetchMarket(client, {
      address: evmAddress(address),
      chainId: toChainId(chainIdNum),
    });
    if (result.isOk()) {
      console.log("Aave market:", result.value);
      return result.value;
    } else {
      console.error("Error fetching Aave market:", result.error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching Aave market:", error);
    return null;
  }
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const marketAddress = searchParams.get("marketAddress");
  const chainIdParam = searchParams.get("chainId");

  if (!marketAddress || !chainIdParam) {
    return NextResponse.json(
      { error: "marketAddress and chainId are required" },
      { status: 400 }
    );
  }

  const chainIdNum = Number(chainIdParam);
  if (!Number.isFinite(chainIdNum)) {
    return NextResponse.json({ error: "Invalid chainId" }, { status: 400 });
  }

  const market = await getAaveMarket(marketAddress, chainIdNum);
  if (!market) {
    return NextResponse.json(
      { error: "Failed to fetch market" },
      { status: 500 }
    );
  }
  return NextResponse.json({ market }, { status: 200 });
}
