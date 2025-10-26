export type CompoundV3ApiResponse = {
  chain_id: number;
  comet: {
    address: string;
  };
  borrow_apr: string;
  supply_apr: string;
  total_borrow_value: string;
  total_supply_value: string;
  total_collateral_value: string;
  utilization: string;
  base_usd_price: string;
  collateral_asset_symbols: string[];
  base_token?: string; // Added from protocol config
  base_token_name?: string; // Token name from ERC20 contract
  base_token_symbol?: string; // Token symbol from ERC20 contract
  calculated_apy?: number; // APY calculated from smart contract
};
