import { Web3Provider } from '@ethersproject/providers';
import { UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';

import { injected, network, POLLING_INTERVAL, walletConnect } from './connectors';

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

export const getErrorMessage = (error: Error | undefined): string => {
  if (error instanceof NoEthereumProviderError) {
    return (
      'No BSC browser extension ' +
      'detected, install MetaMask on desktop or visit' +
      ' from a dApp browser on mobile.'
    );
  }
  if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  }
  if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your account.';
  }
  console.error(error);
  // @ts-ignore
  return error.message;
};

export enum ConnectorNames {
  Injected = 'Injected',
  Network = 'Network',
  WalletConnect = 'WalletConnect',
}

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.Network]: network,
  [ConnectorNames.WalletConnect]: walletConnect,
};
