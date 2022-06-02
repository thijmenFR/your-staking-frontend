import React, { useContext } from 'react';
import AppContext from '@modules/layout/context/AppContext';
import themeModeIcon from '@assets/images/theme-mode_dark.svg';
import themeModeIconLight from '@assets/images/theme-mode_light.svg';
import cn from 'classnames';

import s from './ToggleThemeMode.module.scss';

const ToggleThemeMode = () => {
  const { handleSwitchLightMode, isLightMode } = useContext(AppContext);

  const SwitchLightMode = () => {
    isLightMode ? handleSwitchLightMode(false) : handleSwitchLightMode(true);
  };

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

export default ToggleThemeMode;
