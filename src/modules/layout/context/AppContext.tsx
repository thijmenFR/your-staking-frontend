import React from 'react';

type AppContextType = {
  isLightMode: boolean;
  handleSwitchLightMode: (isLightMode: boolean) => void;
  isWalletModalVisible: boolean;
  setIsWalletModalVisible: (isVisible: boolean) => void;
};

const AppContext = React.createContext<AppContextType>({
  isLightMode: false,
  handleSwitchLightMode: () => {},
  isWalletModalVisible: false,
  setIsWalletModalVisible: () => {},
});

export default AppContext;
