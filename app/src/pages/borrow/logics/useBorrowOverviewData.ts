import { Rate, uUST } from '@anchor-protocol/types';
import {
  computeBorrowAPR,
  computeBorrowedAmount,
  computeBorrowLimit,
  computeCollateralsTotalUST,
  computeCurrentLtv,
  computeNetAPR,
  useAnchorWebapp,
  useBorrowAPYQuery,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
} from '@anchor-protocol/webapp-provider';
import big, { Big } from 'big.js';
import { useMemo } from 'react';

export function useBorrowOverviewData() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const {
    constants: { blocksPerYear },
  } = useAnchorWebapp();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: { borrowRate, oraclePrices, bAssetLtvsAvg, bAssetLtvs } = {} } =
    useBorrowMarketQuery();

  const { data: { marketBorrowerInfo, overseerCollaterals } = {} } =
    useBorrowBorrowerQuery();

  const { data: { borrowerDistributionAPYs } = {} } = useBorrowAPYQuery();

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const { currentLtv, borrowAPR, borrowedValue, collateralValue, borrowLimit } =
    useMemo(() => {
      const collateralsValue =
        overseerCollaterals && oraclePrices
          ? computeCollateralsTotalUST(overseerCollaterals, oraclePrices)
          : (big(0) as uUST<Big>);

      const currentLtv =
        marketBorrowerInfo && overseerCollaterals && oraclePrices
          ? computeCurrentLtv(
              marketBorrowerInfo,
              overseerCollaterals,
              oraclePrices,
            )
          : undefined;

      const borrowAPR = computeBorrowAPR(borrowRate, blocksPerYear);

      const borrowedValue = computeBorrowedAmount(marketBorrowerInfo);

      const borrowLimit =
        overseerCollaterals && oraclePrices && bAssetLtvs
          ? computeBorrowLimit(overseerCollaterals, oraclePrices, bAssetLtvs)
          : undefined;

      return {
        currentLtv,
        borrowAPR,
        borrowedValue,
        collateralValue: collateralsValue,
        borrowLimit,
      };
    }, [
      bAssetLtvs,
      blocksPerYear,
      borrowRate,
      marketBorrowerInfo,
      oraclePrices,
      overseerCollaterals,
    ]);

  const netAPR = useMemo(() => {
    return computeNetAPR(borrowerDistributionAPYs, borrowAPR);
  }, [borrowAPR, borrowerDistributionAPYs]);

  const dangerLtv = useMemo(() => {
    return (
      bAssetLtvsAvg ? big(bAssetLtvsAvg.max).minus(0.1) : big(0.5)
    ) as Rate<Big>;
  }, [bAssetLtvsAvg]);

  return {
    blocksPerYear,
    borrowRate,
    oraclePrices,
    bAssetLtvsAvg,
    bAssetLtvs,
    currentLtv,
    borrowAPR,
    borrowedValue,
    collateralValue,
    borrowLimit,
    netAPR,
    dangerLtv,
    borrowerDistributionAPYs,
  };
}
