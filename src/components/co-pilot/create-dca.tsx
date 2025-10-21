"use client";

import React, { useState, FormEvent } from "react";

import { useBackend } from "@/hooks/useBackend";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_VALUE, InputAmount } from "@/components/co-pilot/input-amount";
import {
  FREQUENCIES,
  SelectFrequency,
} from "@/components/co-pilot/select-frequency";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface CreateDCAProps {
  onCreate?: () => void;
}

export const CreateDCA: React.FC<CreateDCAProps> = ({ onCreate }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [name] = useState<string>("name");
  const [purchaseAmount, setPurchaseAmount] = useState<string>(DEFAULT_VALUE);
  const [frequency, setFrequency] = useState<string>(FREQUENCIES[0].value);
  const { createDCA } = useBackend();

  const handleCreateDCA = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!purchaseAmount || Number(purchaseAmount) <= 0) {
      alert("Please enter a positive amount.");
      return;
    }
    if (!frequency) {
      alert("Please select a frequency.");
      return;
    }

    try {
      setLoading(true);
      await createDCA({
        name,
        purchaseAmount,
        purchaseIntervalHuman: frequency,
      });
      onCreate?.();
    } catch (error) {
      console.error("Error creating yield plan:", error);
      alert("Error creating yield plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <form onSubmit={handleCreateDCA}>
        <div className="space-y-6">
          <Card className="border-orange-200/60 bg-orange-50/50">
            <CardHeader>
              <CardTitle
                className="text-sm"
                style={{
                  color: "#FF4205",
                  fontFamily: "Poppins, system-ui, sans-serif",
                }}
              >
                Yield Agent (Aave, powered by Vincent)
              </CardTitle>
              <CardDescription
                className="text-sm leading-relaxed"
                style={{
                  fontFamily:
                    '"Encode Sans Semi Expanded", system-ui, sans-serif',
                  color: "var(--footer-text-color, #121212)",
                }}
              >
                This yield agent automatically allocates your USDC to Aave v3 on
                Base to seek the highest available yields.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily:
                    '"Encode Sans Semi Expanded", system-ui, sans-serif',
                  color: "var(--footer-text-color, #121212)",
                }}
              >
                Instead of trusting a custodian or wallet SaaS for{" "}
                <strong>key management</strong>, Vincent enables delegated,
                permissioned execution with rules you define.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily:
                    '"Encode Sans Semi Expanded", system-ui, sans-serif',
                  color: "var(--footer-text-color, #121212)",
                }}
              >
                These onchain guardrails are cryptographically enforced by{" "}
                <a
                  href="https://litprotocol.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-80"
                  style={{ color: "#FF4205" }}
                >
                  Lit Protocol
                </a>
                , ensuring every action stays within your authorized abilities.
              </p>
            </CardContent>
          </Card>

          <div
            className="text-sm p-3 bg-blue-50 border border-blue-200 rounded-lg"
            style={{
              fontFamily: '"Encode Sans Semi Expanded", system-ui, sans-serif',
              color: "var(--footer-text-color, #121212)",
            }}
          >
            <strong style={{ fontFamily: "Poppins, system-ui, sans-serif" }}>
              Note:
            </strong>{" "}
            Ensure your wallet holds sufficient Base ETH for gas to
            deposit/withdraw on Aave.
          </div>
        </div>

        <Separator className="my-8" />

        <div className="my-8">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            modal that will show the agent wallet address to deposit usdc on
            base to seek the highest available yields
          </div>
        </div>
      </form>
    </div>
  );
};
