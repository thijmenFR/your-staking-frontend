import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from 'react-query';
import { queryKeys } from '../../constants/queryKeys';
import { getStakedYourTokenBalance, getUserData, getYourTokenBalance } from '@utils/index';
import { useEffect, useState } from 'react';

export const useUserData = () => {
  const { connection } = useConnection();
  const { publicKey: userWallet } = useWallet();
  const { isLoading, data: userData, error } = useQuery(
    [queryKeys.userData],
    () => getUserData(userWallet!, connection),
    { enabled: !!userWallet },
  );

  const isAlreadyConnect = !!userWallet && !!userData && !!connection;

  const [userBalance, setUserBalance] = useState('0');
  const [userStakedBalance, setUserStakedBalance] = useState('0');

  useEffect(() => {
    if (isAlreadyConnect) {
      (async () => setUserBalance(await getYourTokenBalance(userWallet, connection)))();
      (async () => setUserStakedBalance(await getStakedYourTokenBalance(userWallet, connection)))();
    }
    if (!userWallet) {
      setUserBalance('0');
      setUserStakedBalance('0');
    }
  }, [isAlreadyConnect, userWallet, userData]);

  return { userData, userBalance, userStakedBalance };
};
