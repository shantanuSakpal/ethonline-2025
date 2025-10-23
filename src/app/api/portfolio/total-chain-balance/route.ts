// app/api/portfolio/total/route.ts
import { NextResponse } from "next/server";

const DEBANK_API_BASE_URL = process.env.DEBANK_API_BASE_URL as string;
const DEBANK_API_KEY = process.env.DEBANK_API_KEY as string;

export interface ChainBalance {
  usd_value: number;
}

async function getChainBalance(
  address: string,
  chain: string
): Promise<ChainBalance | null> {
  try {
    const chainParam = chain;
    const url = `${DEBANK_API_BASE_URL}/user/chain_balance?id=${address}&chain_id=${chainParam}`;
    const res = await fetch(url, {
      headers: { AccessKey: DEBANK_API_KEY },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        `Debank chain_balance failed: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const json = (await res.json()) as ChainBalance;
    return json;
  } catch (err) {
    console.error("Error fetching chain balance from Debank:", err);
    return null;
  }
}

export async function GET(req: Request) {
  if (!DEBANK_API_BASE_URL || !DEBANK_API_KEY) {
    return NextResponse.json(
      { error: "Missing environment configuration" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const chain = searchParams.get("chain") || "";
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const balance = await getChainBalance(address, chain);
  if (!balance) {
    return NextResponse.json(
      { error: "Failed to fetch total chain balance" },
      { status: 502 }
    );
  }

  // Pass through exactly what Debank returns (e.g., { usd_value: 15.77... })
  return NextResponse.json(balance);
}
