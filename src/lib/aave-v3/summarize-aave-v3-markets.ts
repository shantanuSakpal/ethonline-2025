import { AaveV3Summary } from "@/lib/aave-v3/types";
import { Market } from "@aave/client";

export function summarizeAaveV3Market(markets: Market[]): AaveV3Summary[] {
  // also add sort by apy descending
  return markets
    .sort(
      (a, b) =>
        parseFloat(b.supplyReserves[0].supplyInfo.apy.formatted) -
        parseFloat(a.supplyReserves[0].supplyInfo.apy.formatted)
    )
    .flatMap((market) =>
      market.supplyReserves.map((reserve) => {
        const supplyToken = reserve.underlyingToken;
        const info = reserve.supplyInfo;
        const aaveWrappedToken = reserve.aToken;

        return {
          supplyTokenName: supplyToken.name,
          supplyTokenSymbol: supplyToken.symbol,
          supplyTokenLogo: supplyToken.imageUrl,
          supplyTokenAddress: supplyToken.address,
          aaveWrappedTokenName: aaveWrappedToken.name,
          aaveWrappedTokenSymbol: aaveWrappedToken.symbol,
          aaveWrappedTokenLogo: aaveWrappedToken.imageUrl,
          chainName: market.chain.name,
          chainId: market.chain.chainId,
          chainLogo: market.chain.icon,
          protocolName: market.name,
          protocolLogo: market.icon,
          apy: parseFloat(info.apy.formatted),
          tvlUSD: parseFloat(reserve.size.usd),
          canBeCollateral: info.canBeCollateral,
          maxLTV: parseFloat(info.maxLTV.formatted),
          liquidationThreshold: parseFloat(info.liquidationThreshold.formatted),
          liquidationBonus: parseFloat(info.liquidationBonus.formatted),
          isFrozen: reserve.isFrozen,
          isPaused: reserve.isPaused,
          flashLoanEnabled: reserve.flashLoanEnabled,
          totalMarketSize: parseFloat(market.totalMarketSize),
          totalAvailableLiquidity: parseFloat(market.totalAvailableLiquidity),
          marketAddress: market.supplyReserves[0].market.address,
        };
      })
    );
}
