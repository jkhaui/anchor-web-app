import { formatExecuteMsgNumber } from '@anchor-protocol/notation';
import { ANC, uUST } from '@anchor-protocol/types';
import { ancSellTx } from '@anchor-protocol/webapp-fns';
import { useAncPriceQuery } from '@anchor-protocol/webapp-provider';
import { useStream } from '@rx-stream/react';

import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import big from 'big.js';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface AncSellTxParams {
  burnAmount: ANC;
  maxSpread: number;

  onTxSucceed?: () => void;
}

export function useAncSellTx() {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const stream = useCallback(
    ({ burnAmount, maxSpread, onTxSucceed }: AncSellTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost || !ancPrice) {
        throw new Error('Can not post!');
      }

      return ancSellTx({
        // fabricatebSell
        address: connectedWallet.walletAddress,
        amount: burnAmount,
        beliefPrice: formatExecuteMsgNumber(
          big(ancPrice.ANCPoolSize).div(ancPrice.USTPoolSize),
        ),
        maxSpread: maxSpread.toString(),
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: constants.gas.ancSell.fixedGas.toString() as uUST,
        gasFee: constants.gas.ancSell.gasFee,
        gasAdjustment: constants.gasAdjustment,
        addressProvider,
        // query
        mantleEndpoint,
        mantleFetch,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.ANC_SELL);
        },
      });
    },
    [
      connectedWallet,
      ancPrice,
      constants.gas.ancSell.fixedGas,
      constants.gas.ancSell.gasFee,
      constants.gasAdjustment,
      addressProvider,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
