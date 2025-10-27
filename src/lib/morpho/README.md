# Morpho Vaults Integration

This module provides integration with Morpho vaults through their GraphQL API.

## Overview

The Morpho integration fetches vault data from the Morpho API and converts it to a format compatible with the Aave summary structure for use in the markets list.

## Files

- **types.ts**: Type definitions for Morpho API responses and vault data
- **morpho-client.ts**: GraphQL client and query for fetching vaults from Morpho API
- **summarize-morpho-vaults.ts**: Converts Morpho vault data to AaveV3Summary format
- **get-morpho-vaults.ts**: Main entry point that fetches and summarizes vaults

## Usage

```typescript
import { getMorphoVaults } from "@/lib/morpho/get-morpho-vaults";

const vaults = await getMorphoVaults(true);
```

## GraphQL Query

The integration queries the Morpho API for:

- Whitelisted vaults only
- Chains: Ethereum (1), Base (8453), Polygon (137), Arbitrum (42161)
- Assets: USDC and USDT tokens
- Ordered by total assets USD (descending)
- Limited to 1000 vaults

## Asset IDs

The following asset IDs are used in the query:

- Ethereum USDC: `78a15c5e-c0f6-4814-9e19-15b2308ef72e`
- Base USDC: `0279e2d3-23b8-49e7-a0d5-e3d6be67181c`
- Polygon USDC: `2a07ff31-b525-487d-9da7-859d3867282d`
- Arbitrum USDC: `9ae20f59-9af7-4bc8-a13a-ee41c8d0fc59`
- Ethereum USDT: `3d71a5a2-e696-4c77-8279-ead810da5cca`

## Summary Format

Morpho vaults are converted to `AaveV3Summary` format with the following mappings:

- `apy`: Direct from `state.apy` (converted to percentage)
- `tvlUSD`: From `state.totalAssetsUsd`
- `supplyTokenSymbol`: From `asset.symbol`
- `supplyTokenAddress`: From `asset.address`
- `chainId`: From `chain.id`
- `marketAddress`: From vault `address`
