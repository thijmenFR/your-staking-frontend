import { useConnection } from '@solana/wallet-adapter-react';
import { useQuery } from 'react-query';
import { queryKeys } from '../constants/queryKeys';

export const useSlot = () => {
  const refetchInterval = 10_000;
  const { connection } = useConnection();
  const getSlot = async () => connection.getSlot();
  const { data: slot } = useQuery([queryKeys.slot], () => getSlot(), {
    initialData: () => 1,
    refetchInterval,
  });

  return { slot: String(slot) };
};
