import { useCallback } from "react";

import {
  useJwtContext,
  useVincentWebAuthClient,
} from "@lit-protocol/vincent-app-sdk/react";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

const VINCENT_APP_ID = Number(process.env.NEXT_PUBLIC_VINCENT_APP_ID);
const REDIRECT_URI = process.env.NEXT_PUBLIC_VINCENT_REDIRECT_URI!;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export type DCA = {
  lastRunAt: string;
  nextRunAt: string;
  lastFinishedAt: string;
  failedAt: string;
  _id: string;
  disabled: boolean;
  failReason: string;
  data: {
    name: string;
    purchaseAmount: number;
    purchaseIntervalHuman: string;
    vincentAppVersion: number;
    pkpInfo: {
      ethAddress: string;
      publicKey: string;
      tokenId: string;
    };
    updatedAt: string;
  };
};

export interface CreateDCARequest {
  name: string;
  purchaseAmount: string;
  purchaseIntervalHuman: string;
}

export const useBackend = () => {
  const { authInfo } = useJwtContext();
  const vincentWebAuthClient = useVincentWebAuthClient(VINCENT_APP_ID);

  const getJwt = useCallback(() => {
    // Redirect to Vincent Auth consent page with appId and version
    vincentWebAuthClient.redirectToConnectPage({
      // consentPageUrl: `http://localhost:3000/co-pilot`,
      redirectUri: REDIRECT_URI,
    });
  }, [vincentWebAuthClient]);

  const sendRequest = useCallback(
    async <T>(
      endpoint: string,
      method: HTTPMethod,
      body?: unknown
    ): Promise<T> => {
      if (!authInfo?.jwt) {
        throw new Error("No JWT to query backend");
      }

      const headers: HeadersInit = {
        Authorization: `Bearer ${authInfo.jwt}`,
      };
      if (body != null) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = (await response.json()) as { data: T; success: boolean };

      if (!json.success) {
        throw new Error(`Backend error: ${json.data}`);
      }

      return json.data;
    },
    [authInfo]
  );

  const createDCA = useCallback(
    async (dca: CreateDCARequest) => {
      return sendRequest<DCA>("/schedule", "POST", dca);
    },
    [sendRequest]
  );

  const getDCAs = useCallback(async () => {
    return sendRequest<DCA[]>("/schedules", "GET");
  }, [sendRequest]);

  const disableDCA = useCallback(
    async (scheduleId: string) => {
      return sendRequest<DCA>(`/schedules/${scheduleId}/disable`, "PUT");
    },
    [sendRequest]
  );

  const enableDCA = useCallback(
    async (scheduleId: string) => {
      return sendRequest<DCA>(`/schedules/${scheduleId}/enable`, "PUT");
    },
    [sendRequest]
  );

  const editDCA = useCallback(
    async (scheduleId: string, dca: CreateDCARequest) => {
      return sendRequest<DCA>(`/schedules/${scheduleId}`, "PUT", dca);
    },
    [sendRequest]
  );

  const deleteDCA = useCallback(
    async (scheduleId: string) => {
      return sendRequest<DCA>(`/schedules/${scheduleId}`, "DELETE");
    },
    [sendRequest]
  );

  return {
    createDCA,
    deleteDCA,
    disableDCA,
    editDCA,
    enableDCA,
    getDCAs,
    getJwt,
  };
};
