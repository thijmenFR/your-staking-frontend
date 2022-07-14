import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from '@utils/connectors';

const useInactiveListener = (suppress: boolean = false) => {
  const { active, error, activate } = useWeb3React();

  // eslint-disable-next-line consistent-return
  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = async () => {
        console.log("Handling 'connect' event");
        await activate(injected);
      };
      const handleChainChanged = async (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        await activate(injected);
      };
      const handleAccountsChanged = async (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length) {
          await activate(injected);
        }
      };
      const handleNetworkChanged = async (networkId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", networkId);
        await activate(injected);
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
};

export default useInactiveListener;
