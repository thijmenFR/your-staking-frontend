import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from 'react-query';
import { queryKeys } from '../../constants/queryKeys';
import {
  bnDivdedByDecimalsRaw,
  formatNumber,
  getStakedYourTokenBalance,
  getUserData,
  getYourTokenBalance,
} from '@utils/index';
import { useEffect, useMemo, useState } from 'react';
import { useSlot } from '../useSlot';

export const useUserData = () => {
  const { connection } = useConnection();
  const { slot } = useSlot();
  const { publicKey: userWallet } = useWallet();
  const { data: userData } = useQuery(
    [queryKeys.userData],
    () => getUserData(userWallet!, connection),
    { enabled: !!userWallet },
  );
  const isAlreadyConnect = !!userWallet && !!userData && !!connection;

  const [userBalance, setUserBalance] = useState('0');
  const [userStakedBalance, setUserStakedBalance] = useState('0');

  const unstakePendingAmount = useMemo(
    () => (userData ? bnDivdedByDecimalsRaw(userData.unstakePendingAmount).toString() : 0),
    [userData],
  );
  const ustakeUserSlot = useMemo(() => (userData ? userData?.unstakePendingSlot.toString() : 0), [
    userData,
  ]);
  const isPending = useMemo(
    () => (userData ? userData.unstakePendingSlot.toNumber() > +slot : true),
    [slot, userData],
  );

  useEffect(() => {
    if (isAlreadyConnect) {
      (async () =>
        setUserBalance(formatNumber(await getYourTokenBalance(userWallet, connection), 3)))();
      (async () =>
        setUserStakedBalance(
          formatNumber(await getStakedYourTokenBalance(userWallet, connection), 3),
        ))();
    }
    if (!userWallet) {
      setUserBalance('0');
      setUserStakedBalance('0');
    }
  }, [isAlreadyConnect, userWallet, userData]);

  return {
    userData,
    userBalance,
    userStakedBalance,
    isPending,
    unstakePendingAmount,
    ustakeUserSlot,
  };
};
