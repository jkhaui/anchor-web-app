import { moneyMarket } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface GovDistributionModelUpdateConfigWasmQuery {
  distributionModelConfig: WasmQuery<
    moneyMarket.distributionModel.Config,
    moneyMarket.distributionModel.ConfigResponse
  >;
}

export type GovDistributionModelUpdateConfig =
  WasmQueryData<GovDistributionModelUpdateConfigWasmQuery>;

export type GovDistributionModelUpdateConfigQueryParams = Omit<
  MantleParams<GovDistributionModelUpdateConfigWasmQuery>,
  'query' | 'variables'
>;

export async function govDistributionModelUpdateConfigQuery({
  mantleEndpoint,
  ...params
}: GovDistributionModelUpdateConfigQueryParams): Promise<GovDistributionModelUpdateConfig> {
  return mantle<GovDistributionModelUpdateConfigWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--distribution-model-update-config`,
    variables: {},
    ...params,
  });
}
