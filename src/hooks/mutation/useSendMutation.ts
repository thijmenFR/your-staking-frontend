import { useMutation, useQueryClient } from 'react-query';
import { useYourTransaction } from '../../services/useYourTransaction';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getUserPendingRewards, sleep, useDev } from '@utils/index';

type mutation = 'stake' | 'unstake' | 'finalUnstake';

export const useSendMutation = (type: mutation) => {
  const {
    stakeYourTransaction,
    unstakeYourTransaction,
    finalUnstakeYourTransaction,
  } = useYourTransaction();
  const { connection } = useConnection();
  const { publicKey: userWallet, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  const stake = async (inputValue: string) => {
    const stakeYourTx = await stakeYourTransaction(userWallet!, +inputValue);
    const signature = await sendTransaction(stakeYourTx, connection);
    await connection.confirmTransaction(signature, 'processed');
  };

  const unstake = async (inputValue: string) => {
    const unstakeYourTx = await unstakeYourTransaction(userWallet!, +inputValue);
    const signature = await sendTransaction(unstakeYourTx, connection);
    await connection.confirmTransaction(signature, 'processed');
  };
  const finalUnstake = async () => {
    const finalUnstakeYourTx = await finalUnstakeYourTransaction(userWallet!);
    const signature = await sendTransaction(finalUnstakeYourTx, connection, {skipPreflight: true});
    await connection.confirmTransaction(signature, 'processed');
  };

  return useMutation(
    'mutation',
    (inputValue: string = '') => {
      switch (type) {
        case 'stake':
          return stake(inputValue!);
        case 'unstake':
          return unstake(inputValue!);
        case 'finalUnstake':
          return finalUnstake();
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries();
      },
      onError: (e) => console.error(e),
    },
  );
};
