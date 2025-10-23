import Portfolio from "@/components/portfolio/Portfolio";
import React from "react";

export default function page() {
  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background py-1.5 px-2">
      <Portfolio />
    </div>
  );
}
