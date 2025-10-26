import { createPublicClient, http, type Chain } from "viem";
import {
  mainnet,
  base,
  polygon,
  arbitrum,
  optimism,
  avalanche,
  bsc,
  scroll,
} from "viem/chains";

// ABI for Comet contract (minimal for what we need)
const COMET_ABI = [
  {
    name: "getUtilization",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getSupplyRate",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "utilization", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "baseToken",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
] as const;

// ERC20 ABI for token name and symbol
const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
] as const;

// ABI for Configurator contract
const CONFIGURATOR_ABI = [
  {
    name: "getConfiguration",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "cometProxy", type: "address" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "governor", type: "address" },
          { name: "pauseGuardian", type: "address" },
          { name: "baseToken", type: "address" },
          { name: "baseTokenPriceFeed", type: "address" },
          { name: "extensionDelegate", type: "address" },
          { name: "supplyKink", type: "uint64" },
          { name: "supplyPerYearInterestRateSlopeLow", type: "uint64" },
          { name: "supplyPerYearInterestRateSlopeHigh", type: "uint64" },
          { name: "supplyPerYearInterestRateBase", type: "uint64" },
          { name: "borrowKink", type: "uint64" },
          { name: "borrowPerYearInterestRateSlopeLow", type: "uint64" },
          { name: "borrowPerYearInterestRateSlopeHigh", type: "uint64" },
          { name: "borrowPerYearInterestRateBase", type: "uint64" },
          { name: "storeFrontPriceFactor", type: "uint64" },
          { name: "trackingIndexScale", type: "uint64" },
          { name: "baseTrackingSupplySpeed", type: "uint64" },
          { name: "baseTrackingBorrowSpeed", type: "uint64" },
          { name: "baseMinForRewards", type: "uint104" },
          { name: "baseBorrowMin", type: "uint104" },
          { name: "targetReserves", type: "uint104" },
        ],
      },
    ],
  },
] as const;

// Configurator addresses by chain
const CONFIGURATOR_ADDRESSES: Record<number, string> = {
  1: "0x316f9708bB98af7dA9c68C1C3b5e7906924343a2", // Ethereum
  8453: "0x316f9708bB98af7dA9c68C1C3b5e7906924343a2", // Base
  137: "0x316f9708bB98af7dA9c68C1C3b5e7906924343a2", // Polygon
  10: "0x316f9708bB98af7dA9c68C1C3b5e7906924343a2", // Optimism
  42161: "0x316f9708bB98af7dA9c68C1C3b5e7906924343a2", // Arbitrum
  43114: "0x316f9708bB98af7dA9c68C1C3b5e7906924343a2", // Avalanche
  56: "0x316f9708bB98af7dA9c68C1C3b5e7906924343a2", // BSC
  534352: "0x316f9708bB98af7dA9c68C1C3b5e7906924343a2", // Scroll
};

// Chain mapping
const CHAIN_MAP: Record<number, Chain> = {
  1: mainnet,
  8453: base,
  137: polygon,
  42161: arbitrum,
  10: optimism,
  43114: avalanche,
  56: bsc,
  534352: scroll,
};

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;

export interface ProtocolConfig {
  baseToken: string;
  baseTokenName?: string;
  baseTokenSymbol?: string;
  utilization: bigint;
  supplyRate: bigint;
  supplyAPY: number;
}

/**
 * Fetch protocol configuration for a Comet market
 * @param chainId - The chain ID
 * @param cometAddress - The Comet proxy address
 * @returns Protocol configuration including base token, utilization, and supply APR
 */
export async function fetchProtocolConfig(
  chainId: number,
  cometAddress: `0x${string}`
): Promise<ProtocolConfig> {
  const chain = CHAIN_MAP[chainId];
  if (!chain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  try {
    // Get current utilization from Comet contract
    const utilization = await publicClient.readContract({
      address: cometAddress,
      abi: COMET_ABI,
      functionName: "getUtilization",
    });

    // Get supply rate using the current utilization
    const supplyRate = await publicClient.readContract({
      address: cometAddress,
      abi: COMET_ABI,
      functionName: "getSupplyRate",
      args: [utilization],
    });

    // Get base token address from Comet contract
    const baseToken = await publicClient.readContract({
      address: cometAddress,
      abi: COMET_ABI,
      functionName: "baseToken",
    });

    // Get configuration from Configurator (optional, but useful for additional data)
    let configBaseToken = baseToken;
    try {
      const configuratorAddress = CONFIGURATOR_ADDRESSES[chainId];
      if (configuratorAddress) {
        const config = await publicClient.readContract({
          address: configuratorAddress as `0x${string}`,
          abi: CONFIGURATOR_ABI,
          functionName: "getConfiguration",
          args: [cometAddress],
        });
        configBaseToken = config.baseToken;
      }
    } catch (error) {
      console.warn(
        "Could not fetch configurator, using baseToken from Comet:",
        error
      );
    }

    // Fetch token name and symbol from ERC20 contract
    let tokenName: string | undefined;
    let tokenSymbol: string | undefined;
    try {
      const results = await Promise.all([
        publicClient.readContract({
          address: configBaseToken,
          abi: ERC20_ABI,
          functionName: "name",
        }),
        publicClient.readContract({
          address: configBaseToken,
          abi: ERC20_ABI,
          functionName: "symbol",
        }),
      ]);
      tokenName = results[0] as string;
      tokenSymbol = results[1] as string;
    } catch (error) {
      console.warn(
        `Could not fetch token name/symbol for ${configBaseToken}:`,
        error
      );
    }

    // Calculate supply APR as a percentage
    // Supply Rate is in per-second format scaled by 10^18
    // Formula: Supply Rate / (10^18) * Seconds Per Year * 100
    const SUPPLY_RATE_SCALE = BigInt(10 ** 18);
    const supplyRateDecimal = Number(supplyRate) / Number(SUPPLY_RATE_SCALE);
    const supplyAPY = supplyRateDecimal * SECONDS_PER_YEAR * 100;
    return {
      baseToken: configBaseToken.toLowerCase(),
      baseTokenName: tokenName,
      baseTokenSymbol: tokenSymbol,
      utilization,
      supplyRate,
      supplyAPY,
    };
  } catch (error) {
    console.error(
      `Error fetching protocol config for chain ${chainId}:`,
      error
    );
    throw error;
  }
}
