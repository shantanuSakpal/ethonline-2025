# Compound V3 Integration

This module provides integration with Compound V3 (Comet) protocol for fetching market data and calculating APY using smart contract calls.

## Features

### 1. API-Based Data Fetching (Default)

By default, the integration fetches market data from the Compound V3 API:

```typescript
import { getCompoundMarkets } from "@/lib/compound-v3/get-compound-markets";

// Fetch markets using API data (fast)
const markets = await getCompoundMarkets();
```

### 2. Smart Contract Data Fetching (Optional)

For more accurate APY calculations and base token addresses, you can enable smart contract data fetching:

```typescript
import { getCompoundMarkets } from "@/lib/compound-v3/get-compound-markets";

// Fetch markets using smart contract calls (slower but more accurate)
const markets = await getCompoundMarkets(true);
```

## How Smart Contract Fetching Works

The `fetchProtocolConfig` function makes the following calls:

### 1. Get Utilization

Calls `comet.getUtilization()` to get the current utilization of the pool.

### 2. Get Supply Rate

Calls `comet.getSupplyRate(utilization)` using the formula:

- If utilization ≤ kink: `supplyRate = base + slopeLow * utilization`
- If utilization > kink: `supplyRate = base + slopeLow * kink + slopeHigh * (utilization - kink)`

### 3. Calculate APY

Converts the per-second supply rate to annual percentage yield:

```
Supply APR = (Supply Rate / 10^18) * Seconds Per Year * 100
```

### 4. Get Base Token

Optionally calls `configurator.getConfiguration(cometProxy)` to get the base token address.

## Usage in Markets List

The markets list component automatically uses the fast API-based fetching. To enable smart contract fetching, update:

```typescript
// In src/components/terminal/markets-list.tsx
const compound = await getCompoundMarkets(true); // Set to true for smart contract data
```

## API vs Smart Contract Data

| Feature         | API Data       | Smart Contract Data                 |
| --------------- | -------------- | ----------------------------------- |
| Speed           | Fast ⚡        | Slower 🐢                           |
| Accuracy        | Good ✅        | Excellent ✅✅                      |
| Base Token      | Default (USDC) | Actual from config                  |
| APY Calculation | From API       | Calculated from current utilization |
| Network Calls   | 1              | N (where N = number of markets)     |

## Configuration

The system uses the following configurator addresses by default:

- Ethereum, Base, Polygon, Optimism, Arbitrum, Avalanche, BSC, Scroll: `0x316f9708bB98af7dA9c68C1C3b5e7906924343a2`

You can update these in `src/lib/compound-v3/fetch-protocol-config.ts` if needed.
