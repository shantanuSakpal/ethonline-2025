/**
 * Use this component to only initialize Nexus when required or with a button click
 * Remove the use effect in @NexusProvider to stop auto init process
 */
"use client";

import { useAccount } from "wagmi";
import { Button } from "../ui/button";
import { useNexus } from "@/providers/NexusProvider";
import { ClockFading } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const NexusInitButton = () => {
  const { status } = useAccount();
  const { handleInit, nexusSDK } = useNexus();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInitWithLoading = async () => {
    setLoading(true);
    await handleInit();
    setLoading(false);
  };

  const shouldShow = useMemo(() => {
    if (!mounted) return false;
    if (status !== "connected") return false;
    // Prefer derived state from context over invoking SDK methods during render
    return !nexusSDK;
  }, [mounted, status, nexusSDK]);

  if (shouldShow) {
    return (
      <Button onClick={handleInitWithLoading}>
        {loading ? (
          <ClockFading className="animate-spin size-5 text-primary-foreground" />
        ) : (
          "Connect Nexus"
        )}
      </Button>
    );
  }

  return null;
};

export default NexusInitButton;
