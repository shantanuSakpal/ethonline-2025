"use client";
import HomePage from "@/components/co-pilot/home-page";
import Presentation from "@/components/co-pilot/presentation";
import { useJwtContext } from "@lit-protocol/vincent-app-sdk/react";
import React from "react";

export default function CoPilot() {
  const { authInfo } = useJwtContext();
  // console.log("authInfo", authInfo);
  return (
    <div className="w-full flex justify-center">
      {authInfo ? <HomePage /> : <Presentation />}
    </div>
  );
}
