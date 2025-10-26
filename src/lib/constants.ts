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

export const CHAINID_TO_MARKET_ADDRESS = {
  "43114": "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
  "137": "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
  "1": "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
  "8453": "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
  "10": "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
  "42161": "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
  "56": "0x6807dc923806fE8Fd134338EABCA509979a7e0cB",
  "534352": "0x11fCfe756c05AD438e312a7fd934381537D3cFfe",
};

export const CHAIN_LOGO_URL: Record<number, string> = {
  1: "https://statics.aave.com/ethereum.svg",
  8453: "https://statics.aave.com/base.svg",
  137: "https://statics.aave.com/polygon.svg",
  10: "https://statics.aave.com/optimism.svg",
  42161: "https://statics.aave.com/arbitrum.svg",
  43114: "https://statics.aave.com/avalanche.svg",
  56: "https://statics.aave.com/bnbchain.svg",
  534352: "https://statics.aave.com/scroll-network.svg",
};
