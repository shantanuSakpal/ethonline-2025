import { useState } from "react";
import { LIT_EVM_CHAINS } from "@lit-protocol/constants";
import { ethers } from "ethers";
import { useBalance } from "wagmi";

const ERC20_ABI = ["function balanceOf(address owner) view returns (uint256)"];

const USDC_CONTRACT_ADDRESSES: Record<number, string> = {
  [LIT_EVM_CHAINS.base.chainId]: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
};

export const useChain = () => {
  const [chain, setChain] = useState(LIT_EVM_CHAINS.base);
  console.log("chain", chain);

  const provider = new ethers.JsonRpcProvider(chain.rpcUrls[0]);

  const usdcContract = new ethers.Contract(
    USDC_CONTRACT_ADDRESSES[chain.chainId],
    ERC20_ABI,
    provider
  );

  return {
    chain,
    setChain,
    provider,
    usdcContract,
  };
};
