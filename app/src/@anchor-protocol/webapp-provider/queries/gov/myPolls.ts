import { HumanAddr } from '@anchor-protocol/types';
import { govMyPollsQuery, MyPoll } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    connectedWallet: ConnectedWallet | undefined,
    govContract: HumanAddr,
  ) => {
    return connectedWallet?.walletAddress
      ? govMyPollsQuery({
          mantleEndpoint,
          mantleFetch,
          walletAddress: connectedWallet.walletAddress,
          govContract,
        })
      : Promise.resolve([]);
  },
);

export function useGovMyPollsQuery(): UseQueryResult<MyPoll[]> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const {
    contractAddress: { anchorToken },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.GOV_MYPOLLS,
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      anchorToken.gov,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
