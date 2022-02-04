import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '@modules/layout/context/AppContext';
import AppLogo from './components/Logo';
import { useMediaQuery } from '@modules/common/hooks';
import themeModeIcon from '@assets/images/mode.png';
import themeModeIconLight from '@assets/images/mode_light.png';

import s from './Header.module.scss';

const Header = () => {
  const isBreakpoint = useMediaQuery(1024);

  const { handleSwitchLightMode, isLightMode } = useContext(AppContext);

  const SwitchLightMode = () => {
    isLightMode ? handleSwitchLightMode(false) : handleSwitchLightMode(true);
  };

  const ToggleThemeMode = () => {
    return (
      <>
        <a className={s.themeSelector} onClick={SwitchLightMode}>
          <img
            src={isLightMode ? themeModeIconLight : themeModeIcon}
            width="24"
            height="24"
            alt="Theme Mode Icon"
          />
        </a>
      </>
    );
  };

  return (
    <header className={s.header}>
      <div className="container">
        <div className={s.header__row}>
          <Link to="/">
            <AppLogo />
          </Link>
          <ToggleThemeMode />
        </div>
      </div>
    </header>
  );
};

export default Header;
