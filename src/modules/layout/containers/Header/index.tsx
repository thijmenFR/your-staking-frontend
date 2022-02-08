import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '@modules/layout/context/AppContext';
import AppLogo from '../../../common/components/Logo';
import themeModeIcon from '@assets/images/mode.png';
import themeModeIconLight from '@assets/images/mode_light.png';
import { formatAddress } from '@utils/index';
import Button from '@modules/common/components/Button';

import s from './Header.module.scss';

const Header = () => {
  const { handleSwitchLightMode, isLightMode } = useContext(AppContext);

  const SwitchLightMode = () => {
    isLightMode ? handleSwitchLightMode(false) : handleSwitchLightMode(true);
  };

  const ToggleThemeMode = () => {
    return (
      <aside className={s.themeSelector} onClick={SwitchLightMode}>
        <p>Light</p>
        <div className={s.themeSelector__icon}>
          <img src={isLightMode ? themeModeIconLight : themeModeIcon} alt="Theme Mode Icon" />
        </div>
        <p>Dark</p>
      </aside>
    );
  };

  const clickConnectWallet = () => {
    console.log('click Connect Wallet');
  };

  const clickDisconnectWallet = () => {
    console.log('click Disconnect Wallet');
  };

  const userLogged = true;

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
              {userLogged ? (
                <Button
                  onClick={clickDisconnectWallet}
                  text={formatAddress('465XyUx45gfded4r4543BcC')}
                  color="primary-gradient"
                />
              ) : (
                <Button
                  onClick={clickConnectWallet}
                  text="Connect Wallet"
                  color="primary-gradient"
                />
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
