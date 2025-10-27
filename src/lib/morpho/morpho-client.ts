import { GraphQLClient } from "graphql-request";
import { MORPHO_GRAPHQL_ENDPOINT } from "@/lib/constants";
import type { MorphoVaultsQueryResponse } from "./types";

const client = new GraphQLClient(MORPHO_GRAPHQL_ENDPOINT);

const GET_VAULTS_QUERY = `
  query GetAllUsdCVaults {
    vaults(
      first: 1000
      where: {
        whitelisted: true
        chainId_in: [1, 8453, 137, 42161]
        assetId_in: [
          "78a15c5e-c0f6-4814-9e19-15b2308ef72e",
          "0279e2d3-23b8-49e7-a0d5-e3d6be67181c",
          "2a07ff31-b525-487d-9da7-859d3867282d",
          "9ae20f59-9af7-4bc8-a13a-ee41c8d0fc59",
          "3d71a5a2-e696-4c77-8279-ead810da5cca"
        ]
      }
      orderBy: TotalAssetsUsd
      orderDirection: Desc
    ) {
      items {
        address
        name
        symbol
        whitelisted
        chain {
          id
          network
        }
        asset {
          id
          address
          symbol
          decimals
        }
        state {
          totalAssets
          totalAssetsUsd
          apy
          netApy
          sharePrice
          sharePriceUsd
        }
        metadata {
          description
          image
          forumLink
        }
      }
    }
  }
`;

export async function fetchMorphoVaults(): Promise<
  MorphoVaultsQueryResponse["vaults"]["items"]
> {
  try {
    const data = await client.request<MorphoVaultsQueryResponse>(
      GET_VAULTS_QUERY
    );
    return data.vaults.items;
  } catch (error) {
    console.error("Failed to fetch Morpho vaults:", error);
    throw new Error("Failed to fetch Morpho vaults");
  }
}
