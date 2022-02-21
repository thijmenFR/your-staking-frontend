import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '@modules/layout/context/AppContext';
import AppLogo from '@modules/common/components/Logo';
import themeModeIcon from '@assets/images/theme-mode_dark.svg';
import themeModeIconLight from '@assets/images/theme-mode_light.svg';
import Button from '@modules/common/components/Button';
import ModalContainer from '@modules/look/ModalContainer';
import ConnectWalletModal from '@modules/look/Wallet/ConnectWalletModal';
import WalletAccountModal from '@modules/look/Wallet/WalletAccountModal';
import { formatAddress, userLogged } from '@utils/index';
import cn from 'classnames';

import s from './Header.module.scss';

// for tested inside Account modal
import testLogo from '@assets/images/logo-round.svg';

const Header = () => {
  const { handleSwitchLightMode, isLightMode } = useContext(AppContext);

  const SwitchLightMode = () => {
    isLightMode ? handleSwitchLightMode(false) : handleSwitchLightMode(true);
  };

  const ToggleThemeMode = () => {
    return (
      <aside className={s.themeSelector} onClick={SwitchLightMode}>
        <p className={cn(isLightMode && s.isActiveLight, !isLightMode && s.isInactive)}>Light</p>
        <div className={s.themeSelector__icon}>
          <img src={isLightMode ? themeModeIconLight : themeModeIcon} alt="Theme Mode Icon" />
        </div>
        <p className={cn(!isLightMode && s.isActiveDark)}>Dark</p>
      </aside>
    );
  };

  // Open Connect Wallet Modal
  const [isConnectWalletModal, setIsConnectWalletModal] = useState<boolean>(false);
  const connectWalletModal = async () => {
    setIsConnectWalletModal(true);
    console.log('Connect Wallet Modal', !isConnectWalletModal);
  };

  // Open Wallet Account Modal
  const [isWalletAccountModal, setIsWalletAccountModal] = useState<boolean>(false);
  const walletAccountModal = async () => {
    setIsWalletAccountModal(true);
    console.log('Wallet Account Modal', !isWalletAccountModal);
  };
  return (
    <>
      <ToggleThemeMode />
      <header className={s.header}>
        <div className="container">
          <div className={s.header__row}>
            <Link to="/">
              <AppLogo />
            </Link>

            <div className={s.walletInfo}>
              {!userLogged ? (
                <Button
                  onClick={walletAccountModal}
                  text={formatAddress('465XyUx45gfded4r4543BcC')}
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
        <ConnectWalletModal />
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
        <WalletAccountModal
          connectedWalletLogo={testLogo}
          walletBalance="4.908 SOL"
          connectedWallet="Glow"
        />
      </ModalContainer>
    </>
  );
};
export default Header;
