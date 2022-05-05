import React, { ChangeEventHandler, FC, useState } from 'react';
import { PublicKey } from '@solana/web3.js';

import { StakingForm } from '@modules/common/components/StakingForm/StakingForm';
import { formatNumber, getInputValue, isNumber } from '@utils/index';
import { solanaConfig } from '../../../../contracts/config';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useYourTransaction } from '../../../../services/useYourTransaction';
import { useYourPoolData } from '../../../../hooks/query/useYourPoolData';
import { IYourTab } from '../../../../types';
import { useUserData } from '../../../../hooks/query/useUserData';
import { useSendMutation } from '../../../../hooks/mutation/useSendMutation';
import CustomTooltip from '@modules/common/components/CustomTooltip';
import { STAKING_TAB_TEXT } from '../../../../lang/en';

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

  const infoBlock = [
    {
      val: (
        <>
          <p>{STAKING_TAB_TEXT.BLOCK_INFO.TAB_1.key}</p> <p>{formatNumber(userReceive)} $YOUR</p>
        </>
      ),
    },
    {
      val: (
        <>
          <p>
            {STAKING_TAB_TEXT.BLOCK_INFO.TAB_2.key}{' '}
            <CustomTooltip text={STAKING_TAB_TEXT.BLOCK_INFO.TAB_2.tooltip} />
          </p>
          <p>{formatNumber(getReceiveUser(1))}</p>
        </>
      ),
    },
    {
      val: (
        <>
          <p>
            {STAKING_TAB_TEXT.BLOCK_INFO.TAB_3.key}{' '}
            <CustomTooltip text={STAKING_TAB_TEXT.BLOCK_INFO.TAB_3.tooltip} />
          </p>
          <p>0%</p>
        </>
      ),
    },
  ];

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
      infoBlock={infoBlock}
      walletTitle={'Wallet balance'}
    />
  );
};
