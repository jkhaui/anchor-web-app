import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  BorrowCollateralBorrower,
  borrowCollateralBorrowerQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    connectedWallet: ConnectedWallet | undefined,
    custodyContract: HumanAddr,
  ) => {
    return !!connectedWallet
      ? borrowCollateralBorrowerQuery({
          mantleEndpoint,
          mantleFetch,
          wasmQuery: {
            custodyBorrower: {
              contractAddress: custodyContract,
              query: {
                borrower: {
                  address: connectedWallet.walletAddress,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useBorrowCollateralBorrowerQuery(
  collateralToken: CW20Addr,
): UseQueryResult<BorrowCollateralBorrower | undefined> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_COLLATERAL_BORROWER,
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      moneyMarket.collateralsArray.find(
        ({ token }) => token === collateralToken,
      )!.custody,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && !!connectedWallet && 1000 * 60 * 5,
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
