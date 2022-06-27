import React, { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { BrowserView, MobileView, isBrowser, isMobile, browserName } from 'react-device-detect';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { resetWalletConnector } from '@utils/connectors';
import { WALLETS as WalletConnect, ACTIVATE_NETWORK } from '@modules/common/const';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

import Logo from '@modules/common/components/Logo';

import cn from 'classnames';

import s from './ConnectWalletModal.module.scss';
// import { WalletConnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface ConnectWalletModalProps {
  handleModalVisible: (bool: boolean) => void;
}

const ConnectWalletModal: FC<ConnectWalletModalProps> = ({ handleModalVisible }) => {
  const { wallets, select } = useWallet();
  const [isChecked, setIsChecked] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const { activate, account, connector } = useWeb3React();

  const [currentWallet, setCurrentWallet] = useState<{
    name: string;
    icon: string;
    walletConnector: object;
  }>();

  const getCurrentWallet = (currentConnector: any) => {
    const wallet = WalletConnect.find(
      ({ walletConnector }) => currentConnector === walletConnector,
    );
    setCurrentWallet(wallet);
  };

  useEffect(() => {
    const setTimeoutID = setTimeout(() => {
      setIsShake(false);
    }, 500);
    return () => clearTimeout(setTimeoutID);
  }, [isShake]);

  const handleWalletClick = useCallback(
    (event: MouseEvent, walletName: WalletName) => {
      setIsShake(true);
      if (!isChecked) return;
      select(walletName);
      handleModalVisible(false);
    },
    [select, isChecked],
  );

  const confirmPrivacy = (e: CheckboxChangeEvent) => {
    setIsChecked(e.target.checked);
  };

  const activateWallet = useCallback((walletConnector: AbstractConnector) => {
    if (
      walletConnector instanceof WalletConnectConnector &&
      walletConnector.walletConnectProvider?.wc?.uri
    ) {
      walletConnector.walletConnectProvider = undefined;
    }
    walletConnector &&
      activate(walletConnector, undefined, true).catch((err) => {
        resetWalletConnector(walletConnector);
        if (err instanceof UnsupportedChainIdError) {
          activate(walletConnector).then(); // a little janky...can't use setError because the connector isn't set
        } else {
          console.log('error');
        }
      });
  }, []);

  useEffect(() => {
    connector && getCurrentWallet(connector);
  }, [connector]);

  useEffect(() => {
    !account &&
      !connector &&
      !currentWallet &&
      activate(ACTIVATE_NETWORK, (err) => console.error(err), true);
  }, [account, connector, currentWallet]);

  const handleWalletConnectClick = useCallback(
    (event: MouseEvent, walletName: any) => {
      setIsShake(true);
      if (!isChecked) return;
      activateWallet(walletName);
      handleModalVisible(false);
    },
    [select, isChecked],
  );

  return (
    <div className={s.connectWallet}>
      <div className={s.connectWallet__logo}>
        <Logo />
      </div>
      <h5>Choose your wallet</h5>
      <div className={s.confirmPrivacy}>
        <Checkbox onChange={confirmPrivacy} className={cn({ [s.shake]: isShake })}>
          I have read and accept{' '}
          <a href="#" target="_blank">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" target="_blank">
            Privacy Policy
          </a>
        </Checkbox>
      </div>
      <ul className={s.connectWallet__list}>
        {wallets.map(({ adapter }) => (
          <li key={adapter.name} onClick={(e) => handleWalletClick(e, adapter.name)}>
            <a href="#">
              <div className={s.connectWallet__listLogo}>
                <img src={adapter.icon} alt={adapter.name} />
              </div>
              <p className={s.connectWallet__walletName}>{adapter.name}</p>
            </a>
          </li>
        ))}
        {WalletConnect.map(({ name, icon, walletConnector }) => (
          <li key={name} onClick={(e) => handleWalletConnectClick(e, walletConnector)}>
            <a href="#">
              <div className={s.connectWallet__listLogo}>
                <img src={icon} alt="Wallet Icon" />
              </div>
              <p className={s.connectWallet__walletName}>{name}</p>
            </a>
          </li>
        ))}
        {isMobile && (
          <a
            href={`https://phantom.app/ul/browse/${window.location.href}?ref=${window.location.href}`}
          >
            Wallet Connect at mobile
          </a>
        )}
        {/*<WalletConnectButton />*/}
        {/*<WalletMultiButton />*/}
      </ul>
      <p>{isMobile && browserName !== 'WebKit' && 'Мобилка...но не приложение'}</p>
      <a
        href="slopewallet://wallet.slope/pay?returnSchemes=slopedapp://slope.dapp/pay?
slopePayReturn&slopePayParams={type: connect}"
      >
        Slope
      </a>
    </div>
  );
};

export default ConnectWalletModal;
