import { connectorsByName } from '@utils/connectors';
// import MetaMaskIcon from '@assets/images/wallet/metamask.svg';
import WalletConnectIcon from '@assets/images/wallet/wallet-connect.svg';

export const LOCAL_STORAGE = {
  LIGHT_MODE: 'light-mode',
};

export const ACTIVATE_NETWORK = connectorsByName.Network;

export const WALLETS = [
  // {
  //   name: 'Metamask',
  //   icon: MetaMaskIcon,
  //   walletConnector: connectorsByName.Injected,
  // },
  {
    name: 'WalletConnect',
    icon: WalletConnectIcon,
    walletConnector: connectorsByName.WalletConnect,
  },
];
