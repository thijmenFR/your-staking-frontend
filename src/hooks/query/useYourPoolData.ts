import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useConnection } from '@solana/wallet-adapter-react';
import { queryKeys } from '../../constants/queryKeys';
import { YourPoolData } from '../../models/your-pool-info';
import { Pubkeys } from '../../contracts/config';
import { apy, bnMultipledByDecimals, epochNumber, quota } from '@utils/index';

export const useYourPoolData = () => {
  const { connection } = useConnection();
  const { isLoading, data: poolData, error } = useQuery([queryKeys.useYourPoolData], () =>
    YourPoolData.fromAccount(Pubkeys.yourPoolStoragePubkey, connection),
  );

  const usersTotalStake = useMemo(() => {
    if (error) {
      throw new Error('Pool Does Not Exist');
    }
    if (!poolData) {
      return '0';
    }
    return bnMultipledByDecimals(poolData.userTotalStake).toString();
  }, [poolData, error]);

  const getApy = useMemo(() => {
    if (error) {
      throw new Error('Pool Does Not Exist');
    }
    if (!poolData) {
      return '0';
    }
    return apy(poolData).toString();
  }, [poolData, error]);

  const getReceiveUser = useCallback(
    (stake_amount: number) => {
      if (!poolData) return '0';
      return quota(stake_amount, poolData).toString();
    },
    [poolData],
  );

  return { isLoading, poolData, error, usersTotalStake, getApy, getReceiveUser };
};
