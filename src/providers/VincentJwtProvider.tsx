"use client";
import {
  JwtProvider,
  useJwtContext,
} from "@lit-protocol/vincent-app-sdk/react";

const VINCENT_APP_ID = process.env.NEXT_PUBLIC_VINCENT_APP_ID!;

export default function VincentJwtProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <JwtProvider appId={Number(VINCENT_APP_ID)}>{children}</JwtProvider>;
}
