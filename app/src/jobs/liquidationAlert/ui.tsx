import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { useNotification } from 'contexts/notification';
import React, { useEffect } from 'react';

export function LiquidationAlertUI() {
  const { status, wallets } = useWallet();
  const { messagingToken } = useNotification();

  useEffect(() => {
    if (!messagingToken) return;

    if (status === WalletStatus.WALLET_CONNECTED && wallets.length > 0) {
      fetch('https://localhost:7566/anchor-liquidation-alert/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messagingToken,
          walletAddress: wallets[0].terraAddress,
        }),
      });
    } else if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      fetch('https://localhost:7566/anchor-liquidation-alert/unregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messagingToken,
        }),
      });
    }
  }, [messagingToken, status, wallets]);

  return <div>...</div>;
}
