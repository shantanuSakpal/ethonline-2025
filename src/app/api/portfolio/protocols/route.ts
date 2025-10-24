// app/api/portfolio/protocols/route.ts
import { NextResponse } from "next/server";
import { isAddress } from "viem";

const DEBANK_API_BASE_URL = process.env.DEBANK_API_BASE_URL as string;
const DEBANK_API_KEY = process.env.DEBANK_API_KEY as string;

export interface AssetToken {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  display_symbol: string | null;
  optimized_symbol: string;
  decimals: number;
  logo_url: string;
  protocol_id: string;
  price: number;
  is_verified: boolean;
  is_core: boolean;
  is_wallet: boolean;
  time_at: number | null;
  amount: number;
}

export interface ProtocolStats {
  asset_usd_value: number;
  debt_usd_value: number;
  net_usd_value: number;
}

export interface ProtocolDetail {
  supply_token_list?: AssetToken[];
  borrow_token_list?: AssetToken[];
  description?: string;
  health_rate?: number;
}

export interface ProtocolPool {
  id: string;
  chain: string;
  project_id: string;
  adapter_id: string;
  controller: string;
  index: string | null;
  time_at: number;
}

export interface PortfolioItem {
  stats: ProtocolStats;
  asset_dict: Record<string, number>;
  asset_token_list: AssetToken[];
  update_at: number;
  name: string;
  detail_types: string[];
  detail: ProtocolDetail;
  proxy_detail: Record<string, any>;
  pool: ProtocolPool;
  position_index?: string;
}

export interface ComplexProtocol {
  id: string;
  chain: string;
  name: string;
  site_url: string;
  logo_url: string;
  has_supported_portfolio: boolean;
  tvl: number;
  portfolio_item_list: PortfolioItem[];
}

const supportedChains = [
  "eth",
  "base",
  "op",
  "matic",
  "arb",
  "avax",
  "bnb",
  "scrl",
];

async function fetchComplexProtocols(
  walletAddress: string
): Promise<ComplexProtocol[]> {
  const chainParam = supportedChains.join(",");

  const url = `${DEBANK_API_BASE_URL}/user/all_complex_protocol_list?id=${walletAddress}&chain_ids=${chainParam}`;
  const res = await fetch(url, {
    headers: { AccessKey: DEBANK_API_KEY },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      `Debank complex_protocol_list failed: ${res.status} ${res.statusText}`
    );
    return [];
  }

  return res.json();
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
    console.log("missing address");
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }
  console.log("fetching protocols stats for ", address);
  if (!isAddress(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  try {
    const complexProtocols = await fetchComplexProtocols(address);
    return NextResponse.json({ complex: complexProtocols });
  } catch (err) {
    console.error("Error fetching complex protocols:", err);
    return NextResponse.json(
      { error: "Failed to fetch complex protocol data" },
      { status: 500 }
    );
  }
}
