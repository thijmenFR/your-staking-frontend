import { useContext, useEffect, useState } from 'react';
import { ConnectionContext } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { bnDivdedByDecimals } from '@utils/index';
import BigNumber from 'bignumber.js';

const initState = new BigNumber(0);

const useWalletBalance = (publicKey: PublicKey | null, toBn: boolean = false) => {
  const { connection } = useContext(ConnectionContext);
  const [walletBalance, setWalletBalance] = useState(initState);

  const getUserBalance = async () => {
    if (publicKey) {
      const uBalance = await connection.getBalance(publicKey);
      setWalletBalance(bnDivdedByDecimals(new BigNumber(uBalance)));
    }
    return initState;
  };
  useEffect(() => {
    getUserBalance();
  }, [publicKey, connection]);

  return toBn ? walletBalance : walletBalance.toString();
};

export default useWalletBalance;
