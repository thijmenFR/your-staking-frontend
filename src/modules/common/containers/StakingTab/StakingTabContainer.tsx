import { ChangeEventHandler, FC, useState } from 'react';
import { StakingForm } from '@modules/common/components/StakingForm/StakingForm';
import { formatNumber, getInputValue, isNumber } from '@utils/index';
import { solanaConfig } from '../../../../contracts/config';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useYourTransaction } from '../../../../services/useYourTransaction';
import { useYourPoolData } from '../../../../hooks/query/useYourPoolData';
import { IYourTab } from '../../../../types';
import { useUserData } from '../../../../hooks/query/useUserData';
import { useSendMutation } from '../../../../hooks/mutation/useSendMutation';

export const StakingTabContainer: FC<IYourTab> = ({ userExist }) => {
  const { publicKey: userWallet, sendTransaction } = useWallet();
  const { createUserTransaction } = useYourTransaction();
  const { getReceiveUser } = useYourPoolData();
  const { connection } = useConnection();
  const { userBalance } = useUserData();
  const { isLoading, mutateAsync } = useSendMutation('stake');

  const [stakeInputValue, setStakeInputValue] = useState('');

  const clickAmountMaxHandler = () => setStakeInputValue(userBalance);

  const stakeInputHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = getInputValue(event);
    if (!isNumber(value) || !userWallet) return;
    setStakeInputValue(formatNumber(value, solanaConfig.inputDecimalsCount));
  };

  const userReceive = getReceiveUser(+stakeInputValue);

  const createUser = async (address: PublicKey) => {
    const createUserTx = await createUserTransaction(address);
    const signature = await sendTransaction(createUserTx, connection);
    await connection.confirmTransaction(signature, 'processed');
  };

  const stakeYourHandler = async () => {
    if (!stakeInputValue || !userWallet) return;
    if (!userExist) await createUser(userWallet);
    await mutateAsync(stakeInputValue);
    setStakeInputValue('');
  };

  return (
    <StakingForm
      btnText="Stake YOUR"
      value={stakeInputValue}
      balance={userBalance}
      isWaiting={isLoading}
      onChange={stakeInputHandler}
      onClick={stakeYourHandler}
      clickAmountMax={clickAmountMaxHandler}
      userReceive={userReceive}
    />
  );
};
