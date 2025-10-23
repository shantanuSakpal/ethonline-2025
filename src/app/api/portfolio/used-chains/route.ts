// app/api/portfolio/used-chains/route.ts
import { NextResponse } from "next/server";

const DEBANK_API_BASE_URL = process.env.DEBANK_API_BASE_URL as string;
const DEBANK_API_KEY = process.env.DEBANK_API_KEY as string;

export interface UsedChainItem {
  born_at: number;
  id: string; // e.g. "core", "base"
  community_id: number;
  name: string;
  native_token_id: string;
  logo_url: string;
  wrapped_token_id: string;
  is_support_pre_exec: boolean;
}

async function getUsedChains(address: string): Promise<UsedChainItem[]> {
  try {
    const url = `${DEBANK_API_BASE_URL}/user/used_chain_list?id=${address}`;
    const res = await fetch(url, {
      headers: { AccessKey: DEBANK_API_KEY },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        `Debank used_chain_list failed: ${res.status} ${res.statusText}`
      );
      return [];
    }

    const json = (await res.json()) as UsedChainItem[];
    return json;
  } catch (err) {
    console.error("Error fetching used_chain_list from Debank:", err);
    return [];
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
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const chains = await getUsedChains(address);
  // Return all chains; client can filter which ones to display
  return NextResponse.json({ chains });
}
