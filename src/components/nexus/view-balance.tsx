"use client";
import {
  CHAIN_METADATA,
  SUPPORTED_CHAINS,
  useNexus,
} from "@avail-project/nexus-widgets";
import { Button } from "@/components/ui/button";
import React, { useMemo, useState } from "react";
import type { UserAsset } from "@avail-project/nexus-widgets";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const ViewUnifiedBalance = () => {
  const { isSdkInitialized, sdk, initializeSdk } = useNexus();
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [unifiedBalance, setUnifiedBalance] = useState<UserAsset[] | undefined>(
    undefined
  );

  const formatBalance = (balance: string, decimals: number) => {
    const num = parseFloat(balance);
    return num.toFixed(Math.min(6, decimals));
  };

  const handleInit = async () => {
    if (isSdkInitialized) return;
    setInitLoading(true);
    try {
      await initializeSdk();
    } catch (error) {
      console.error("Error initializing SDK", error);
    } finally {
      setInitLoading(false);
    }
  };

  const fetchBalance = async () => {
    setLoading(true);
    try {
      await handleInit();
      const balance = await sdk?.getUnifiedBalances();
      console.log(
        "Swap supported chains and tokens",
        sdk?.utils?.getSwapSupportedChainsAndTokens()
      );
      const supportedChains = sdk?.utils?.getSupportedChains();
      const swapSupportedChainsAndTokens =
        sdk?.utils?.getSwapSupportedChainsAndTokens();
      console.log("balance", balance);
      console.log("supportedChains", supportedChains);
      console.log("swapSupportedChainsAndTokens", swapSupportedChainsAndTokens);
      setUnifiedBalance(balance);
    } catch (e) {
      console.error("Error fetching balance", e);
    } finally {
      setLoading(false);
    }
  };

  const TriggerButton = () => {
    return (
      <DialogTrigger asChild>
        <Button className="font-bold" onClick={fetchBalance}>
          View Unified Balance
        </Button>
      </DialogTrigger>
    );
  };

  const totalBalance = useMemo(() => {
    const total = unifiedBalance
      ?.reduce((acc, fiat) => acc + fiat.balanceInFiat, 0)
      .toFixed(2);

    return total ?? 0;
  }, [unifiedBalance]);
  return (
    <Dialog>
      <TriggerButton />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {initLoading ? (
            <DialogTitle>Initializing...</DialogTitle>
          ) : (
            <>
              {" "}
              <DialogTitle className="font-bold">Unified Balance</DialogTitle>
              <DialogDescription className="font-semibold">
                {loading
                  ? "Fetching balance"
                  : `Total Unified Balance: $${totalBalance}`}
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        {unifiedBalance && (
          <ScrollArea className="w-full max-h-[476px] no-scrollbar">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {unifiedBalance
                ?.filter((token) => parseFloat(token.balance) > 0)
                .map((token) => (
                  <AccordionItem
                    key={token.symbol}
                    value={token.symbol}
                    className="px-4 border border-gray-400 rounded-lg"
                  >
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-8 w-8">
                            {token.icon && (
                              <img
                                src={token.icon}
                                alt={token.symbol}
                                className="rounded-full"
                              />
                            )}
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold">{token.symbol}</h3>
                            <p className="text-sm text-muted-foreground">
                              ${token.balanceInFiat.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-medium">
                          {formatBalance(token.balance, 6)}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 py-2">
                        {token.breakdown
                          .filter((chain) => parseFloat(chain.balance) > 0)
                          .map((chain, index, filteredChains) => (
                            <React.Fragment key={chain.chain.id}>
                              <div className="flex items-center justify-between px-2 py-1 rounded-md">
                                <div className="flex items-center gap-2">
                                  <div className="relative h-6 w-6">
                                    <img
                                      src={
                                        CHAIN_METADATA[chain?.chain?.id]?.logo
                                      }
                                      alt={chain.chain.name}
                                      sizes="100%"
                                      className={cn(
                                        chain?.chain?.id !==
                                          SUPPORTED_CHAINS.BASE &&
                                          chain?.chain?.id !==
                                            SUPPORTED_CHAINS.BASE_SEPOLIA
                                          ? "rounded-full"
                                          : ""
                                      )}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">
                                    {chain.chain.name}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">
                                    {formatBalance(
                                      chain.balance,
                                      chain.decimals
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-bold">
                                    ${chain.balanceInFiat.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              {index < filteredChains.length - 1 && (
                                <Separator className="my-2 bg-gray-700" />
                              )}
                            </React.Fragment>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewUnifiedBalance;
