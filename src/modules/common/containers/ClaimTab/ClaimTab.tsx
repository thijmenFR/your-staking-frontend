import { FC, useEffect, useState } from 'react';
import { IYourTab } from '../../../../types';
import { ClaimForms } from '@modules/common/components/claimForms/ClaimForms';
import { bnMultipledByDecimals, calculateRewards } from '@utils/index';
import { useYourPoolData } from '../../../../hooks/query/useYourPoolData';
import { useUserData } from '../../../../hooks/query/useUserData';
import { useYourTransaction } from '../../../../services/useYourTransaction';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useQueryClient } from 'react-query';

interface ClaimTabProps extends IYourTab {
  currentSlot: string;
}

export const ClaimTab: FC<ClaimTabProps> = ({ userExist, currentSlot }) => {
  const { poolData } = useYourPoolData();
  const { userData, userBalance } = useUserData();
  const { claimRewardsTransaction } = useYourTransaction();
  const { publicKey: account, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  const [claimRewardsCount, setClaimRewardsCount] = useState('0');

  const claimReward = async () => {
    const claimRewardsTx = await claimRewardsTransaction(account!);
    const signature = await sendTransaction(claimRewardsTx, connection, { skipPreflight: true });
    await connection.confirmTransaction(signature, 'processed');
    await queryClient.invalidateQueries();
    setClaimRewardsCount('0');
  };

  useEffect(() => {
    if (userExist) {
      const rewards = calculateRewards(currentSlot, poolData!, userData!);
      setClaimRewardsCount(bnMultipledByDecimals(rewards).toString());
    }
  }, [userExist, currentSlot, poolData, userData]);
  return (
    <ClaimForms
      balance={userBalance}
      onClick={claimReward}
      isWaiting={false}
      btnText={'Claim YOUR'}
      value={claimRewardsCount}
    />
  );
};
