import { cw20, uANC } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface AncBalanceWasmQuery {
  ancBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<uANC>>;
}

export type AncBalance = WasmQueryData<AncBalanceWasmQuery>;

export type AncBalanceQueryParams = Omit<
  MantleParams<AncBalanceWasmQuery>,
  'query' | 'variables'
>;

export async function ancBalanceQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: AncBalanceQueryParams): Promise<AncBalance> {
  return mantle<AncBalanceWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?anc--balance?address=${wasmQuery.ancBalance.query.balance.address}`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
