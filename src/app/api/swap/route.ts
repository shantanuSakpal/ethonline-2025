// src/app/api/swap/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { getVincentAbilityClient } from "@lit-protocol/vincent-app-sdk/abilityClient";
import { getPKPInfo, isAppUser } from "@lit-protocol/vincent-app-sdk/jwt";
import { bundledVincentAbility as erc20BundledAbility } from "@lit-protocol/vincent-ability-erc20-approval";
import {
  bundledVincentAbility as uniswapBundledAbility,
  getSignedUniswapQuote,
} from "@lit-protocol/vincent-ability-uniswap-swap";

const VINCENT_DELEGATEE_PRIVATE_KEY =
  process.env.VINCENT_DELEGATEE_PRIVATE_KEY!;
const BASE_RPC_URL = process.env.BASE_RPC_URL!;
const CHAIN_ID = 8453; // Base

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization") || "";
    const jwt = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!jwt)
      return NextResponse.json(
        { success: false, error: "Missing JWT" },
        { status: 401 }
      );

    // Minimal extraction (ensure proper verification in production)
    const decoded = JSON.parse(
      Buffer.from(jwt.split(".")[1] || "", "base64").toString() || "{}"
    );
    if (!isAppUser(decoded)) {
      return NextResponse.json(
        { success: false, error: "Invalid Vincent JWT" },
        { status: 401 }
      );
    }
    const { ethAddress: delegatorPkpEthAddress } = getPKPInfo(decoded);

    const { tokenIn, tokenOut, amountIn, decimalsIn } = await req.json();

    // Delegatee signer (Lit Yellowstone/Chronicle RPC for auth to Lit)
    const yellowstone = new ethers.providers.JsonRpcProvider(
      "https://yellowstone-rpc.litprotocol.com/"
    );
    const delegateeSigner = new ethers.Wallet(
      VINCENT_DELEGATEE_PRIVATE_KEY,
      yellowstone
    );

    // Lit client
    const litNodeClient = new LitNodeClient({
      litNetwork: "datil",
      debug: true,
    });
    await litNodeClient.connect();

    // 1) Signed Uniswap quote
    const signedQuote = await getSignedUniswapQuote({
      litNodeClient,
      ethersSigner: delegateeSigner,
      quoteParams: {
        rpcUrl: BASE_RPC_URL,
        tokenInAddress: tokenIn,
        tokenInAmount: amountIn.toString(),
        tokenOutAddress: tokenOut,
        recipient: delegatorPkpEthAddress,
      },
    });

    const uniswapRouter = signedQuote.quote.to;

    // 2) ERC20 approval precheck/execute
    const erc20Client = getVincentAbilityClient({
      bundledVincentAbility: erc20BundledAbility,
      ethersSigner: delegateeSigner,
    });

    const approvalPrecheck = await erc20Client.precheck(
      {
        rpcUrl: BASE_RPC_URL,
        chainId: CHAIN_ID,
        spenderAddress: uniswapRouter,
        tokenAddress: tokenIn,
        tokenAmount: ethers.utils.parseUnits(amountIn, decimalsIn).toString(),
        alchemyGasSponsor: false,
      },
      { delegatorPkpEthAddress }
    );

    if (!approvalPrecheck.success) {
      throw new Error(
        `Approval precheck failed: ${approvalPrecheck.runtimeError}`
      );
    }

    if (!approvalPrecheck.result.alreadyApproved) {
      const approvalExec = await erc20Client.execute(
        {
          rpcUrl: BASE_RPC_URL,
          chainId: CHAIN_ID,
          spenderAddress: uniswapRouter,
          tokenAddress: tokenIn,
          tokenAmount: ethers.utils.parseUnits(amountIn, decimalsIn).toString(),
          alchemyGasSponsor: false,
        },
        { delegatorPkpEthAddress }
      );
      if (!approvalExec.success) {
        throw new Error(
          `Approval execution failed: ${approvalExec.runtimeError}`
        );
      }
    }

    // 3) Execute swap
    const uniswapClient = getVincentAbilityClient({
      bundledVincentAbility: uniswapBundledAbility,
      ethersSigner: delegateeSigner,
    });

    const swapExec = await uniswapClient.execute(
      {
        rpcUrlForUniswap: BASE_RPC_URL,
        signedUniswapQuote: {
          quote: signedQuote.quote,
          signature: signedQuote.signature,
        },
      },
      { delegatorPkpEthAddress }
    );

    await litNodeClient.disconnect();

    if (!swapExec.success) {
      throw new Error(`Swap execution failed: ${swapExec.runtimeError}`);
    }

    return NextResponse.json(
      { success: true, data: { swapTxHash: swapExec.result.swapTxHash } },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
