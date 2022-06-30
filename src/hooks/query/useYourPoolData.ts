import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { notification } from 'antd';
import { useConnection } from '@solana/wallet-adapter-react';
import { queryKeys } from '../../constants/queryKeys';
import { YourPoolData } from '../../models/your-pool-info';
import { Pubkeys } from '../../contracts/config';
import {
  apy,
  bnDivdedByDecimalsRaw,
  epochDurationInSlotsPercent,
  epochRemaining,
  formatNumber,
} from '@utils/index';
import { useSlot } from '../useSlot';
import { getErrorMessage } from '@utils/web3';

export const useYourPoolData = () => {
  const { connection } = useConnection();
  const { slot } = useSlot();
  const { isLoading, data: poolData, error } = useQuery([queryKeys.useYourPoolData], () =>
    YourPoolData.fromAccount(Pubkeys.yourPoolStoragePubkey, connection),
  );
  const usersTotalStake = useMemo(() => {
    if (error) {
      // throw new Error('Pool Does Not Exist');
      notification.error({
        message: 'Error',
        className: 'notificationError',
        description: 'Pool Does Not Exist',
      });
    }
    if (!poolData) {
      return '0';
    }
    return bnDivdedByDecimalsRaw(poolData.userTotalStake).toString();
  }, [poolData, error]);

  const epochPercent = useMemo(() => {
    if (poolData && +slot) return epochDurationInSlotsPercent(slot, poolData);
    return '1';
  }, [slot, poolData]);

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
      // return epochRemaining(stake_amount, poolData).toString();
      return ((Number(formatNumber(epochPercent, 2)) / 100) * stake_amount).toString();
    },
    [poolData, epochPercent],
  );

  return { isLoading, poolData, error, usersTotalStake, getApy, getReceiveUser, epochPercent };
};
