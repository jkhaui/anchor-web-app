import { JSDateTime } from '@anchor-protocol/types';
import {
  ANCHOR_QUERY_KEY,
  EarnAPYHistoryData,
  earnAPYHistoryQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

export function useEarnAPYHistoryQuery(): UseQueryResult<
  EarnAPYHistoryData | undefined
> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const queryFn = useCallback(() => {
    return earnAPYHistoryQuery({
      mantleEndpoint,
      mantleFetch,
      variables: {
        //timestampMax: (Date.now() - 1000 * 60 * 60 * 24) as JSDateTime,
        timestampMax: (Date.now() - 1000 * 60 * 60) as JSDateTime,
      },
    });
  }, [mantleEndpoint, mantleFetch]);

  return useQuery(ANCHOR_QUERY_KEY.EARN_APY_HISTORY, queryFn, {
    refetchInterval: browserInactive && 1000 * 60 * 60,
    enabled: !browserInactive,
    keepPreviousData: true,
  });
}
