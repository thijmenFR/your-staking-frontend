import { createContext, useState } from 'react';

interface context {
  isConnectWalletModal: boolean;
  setIsConnectWalletModal: (bool: boolean) => void;
}

export const WalletModalContext = createContext<context>({} as context);
