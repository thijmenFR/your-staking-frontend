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

import s from './Header.module.scss';

// for tested inside Account modal
import testLogo from '@assets/images/wallet/phantom.png';
import { useMediaQuery } from '@modules/common/hooks';
import { WalletModalContext } from '@modules/context/WalletContex';

const Header = () => {
  const { publicKey: account } = useWallet();
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
              {account ? (
                <Button
                  onClick={walletAccountModal}
                  text={formatAddress(account.toJSON())}
                  color="primary-gradient"
                  iconPath={testLogo}
                  isStateIndicator
                />
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
