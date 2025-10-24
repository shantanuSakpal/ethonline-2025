import { AAVE_AND_AVAIL_SUPPORTED_CHAINS } from "@/lib/constants";
import { evmAddress, chainId } from "@aave/react";
import { CHAINID_TO_MARKET_ADDRESS } from "@/lib/constants";

export const getMarkets = () => {
  return AAVE_AND_AVAIL_SUPPORTED_CHAINS.map((chain) => ({
    address: evmAddress(CHAINID_TO_MARKET_ADDRESS[chain]),
    chainId: chainId(chain),
  }));
};
export const supportedMarkets = getMarkets();
