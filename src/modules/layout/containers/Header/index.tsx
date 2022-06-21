import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLogo from '@modules/common/components/Logo';
import Button from '@modules/common/components/Button';
import ModalContainer from '@modules/look/ModalContainer';
import ConnectWalletModal from '@modules/look/Wallet/ConnectWalletModal';
import WalletAccountModal from '@modules/look/Wallet/WalletAccountModal';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatAddress } from '@utils/index';
import ToggleThemeMode from '@modules/common/components/ToggleThemeMode';

// for tested inside Account modal
import { useMediaQuery } from '@modules/common/hooks';
import { WalletModalContext } from '@modules/context/WalletContex';
import { useWeb3React } from '@web3-react/core';

import testLogo from '@assets/images/wallet/phantom.png';
import walletConnectLogo from '@assets/images/wallet/wallet-connect.svg';

import s from './Header.module.scss';

const Header = () => {
  const { publicKey: account } = useWallet();
  const { account: web3Account } = useWeb3React();
  // Open Connect Wallet Modal
  const { setIsConnectWalletModal, isConnectWalletModal } = useContext(WalletModalContext);
  const connectWalletModal = async () => {
    setIsConnectWalletModal(true);
  };

  // Open Wallet Account Modal
  const [isWalletAccountModal, setIsWalletAccountModal] = useState<boolean>(false);
  const walletAccountModal = async () => {
    setIsWalletAccountModal(true);
    console.log('Wallet Account Modal', !isWalletAccountModal);
  };

  const isBreakpoint = useMediaQuery(992);
  return (
    <>
      {!isBreakpoint && <ToggleThemeMode />}
      <header className={s.header}>
        <div className="container">
          <div className={s.header__row}>
            <Link to="/">
              <AppLogo />
            </Link>

            <div className={s.walletInfo}>
              {account || web3Account ? (
                account ? (
                  <Button
                    onClick={walletAccountModal}
                    text={formatAddress(account.toJSON())}
                    color="primary-gradient"
                    iconPath={testLogo}
                    isStateIndicator
                  />
                ) : (
                  web3Account && (
                    <Button
                      onClick={walletAccountModal}
                      text={formatAddress(web3Account)}
                      color="primary-gradient"
                      iconPath={walletConnectLogo}
                      isStateIndicator
                    />
                  )
                )
              ) : (
                <Button
                  onClick={connectWalletModal}
                  text="Connect Wallet"
                  color="primary-gradient"
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/*Modals*/}

      {/*Connect Wallet */}
      <ModalContainer
        isVisible={isConnectWalletModal}
        isClosable={false}
        handleCancel={() => {
          setIsConnectWalletModal(false);
        }}
        width={384}
      >
        <ConnectWalletModal handleModalVisible={setIsConnectWalletModal} />
      </ModalContainer>

      {/*Wallet Account Modal */}
      <ModalContainer
        isVisible={isWalletAccountModal}
        isClosable={false}
        handleCancel={() => {
          setIsWalletAccountModal(false);
        }}
        width={384}
      >
        <WalletAccountModal handleModalVisible={setIsWalletAccountModal} />
      </ModalContainer>
    </>
  );
};
export default Header;
