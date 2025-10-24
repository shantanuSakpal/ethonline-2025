import { SUPPORTED_CHAINS } from "@avail-project/nexus-widgets";

export const MIN_TVL = 1000000; // 1 million USD
export const MIN_APY = 1; // 1%

export const AAVE_AND_AVAIL_SUPPORTED_CHAINS = [
  SUPPORTED_CHAINS.ETHEREUM, // 1
  SUPPORTED_CHAINS.ARBITRUM, // 42161
  SUPPORTED_CHAINS.AVALANCHE, // 43114
  SUPPORTED_CHAINS.BASE, // 8453
  SUPPORTED_CHAINS.BNB, // 56
  SUPPORTED_CHAINS.OPTIMISM, // 10
  SUPPORTED_CHAINS.POLYGON, // 137
  SUPPORTED_CHAINS.SCROLL, // 534352
];

export type ChainChoice =
  | "eth"
  | "base"
  | "op"
  | "matic"
  | "arb"
  | "avax"
  | "bnb"
  | "scrl";

export const supportedChains = [
  "eth",
  "base",
  "op",
  "matic",
  "arb",
  "avax",
  "bnb",
  "scrl",
];
