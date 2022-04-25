import React, { ChangeEventHandler, FC, useState } from 'react';
import { StakingForm } from '@modules/common/components/StakingForm/StakingForm';
import { formatNumber, getInputValue, isNumber } from '@utils/index';
import { solanaConfig } from '../../../../contracts/config';
import { useWallet } from '@solana/wallet-adapter-react';
import { IYourTab } from '../../../../types';
import { useUserData } from '../../../../hooks/query/useUserData';
import Button from '@modules/common/components/Button';
import { useSendMutation } from '../../../../hooks/mutation/useSendMutation';
import { useYourPoolData } from '../../../../hooks/query/useYourPoolData';
import { UNSTAKING_TAB_TEXT } from '../../../../lang/en';

export const UnStakingTabContainer: FC<IYourTab> = ({ userExist }) => {
  const { publicKey: account } = useWallet();
  const { userStakedBalance, isPending, unstakePendingAmount, ustakeUserSlot } = useUserData();
  const { getReceiveUser } = useYourPoolData();
  const { isLoading, mutateAsync } = useSendMutation('unstake');
  const { isLoading: isLoadingFinal, mutate } = useSendMutation('finalUnstake');
  const [inputValue, setInputValue] = useState('');
  const clickAmountMaxHandler = () => setInputValue(userStakedBalance);

  const userReceive = getReceiveUser(+inputValue);

  const inputHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = getInputValue(event);
    if (!isNumber(value)) return;
    setInputValue(formatNumber(value, solanaConfig.inputDecimalsCount));
  };

  const unstakeHandler = async () => {
    if (!inputValue || !account || !userExist) return;
    await mutateAsync(inputValue);
    setInputValue('');
  };
  const finalUnstakeHandler = async () => {
    if (!account || !userExist || isPending) return;
    mutate(undefined);
  };

  const infoBlock = [
    {
      val: (
        <>
          <p>{UNSTAKING_TAB_TEXT.BLOCK_INFO.TAB_1.key}</p>
          <p>{formatNumber(unstakePendingAmount)} $YOUR</p>
        </>
      ),
    },
    {
      val: (
        <>
          <p>{UNSTAKING_TAB_TEXT.BLOCK_INFO.TAB_2.key} </p>
          <p>{ustakeUserSlot} slot</p>
        </>
      ),
    },
  ];

  return (
    <StakingForm
      btnText="Unstake YOUR"
      value={inputValue}
      balance={userStakedBalance}
      isWaiting={isLoading}
      onChange={inputHandler}
      onClick={unstakeHandler}
      clickAmountMax={clickAmountMaxHandler}
      userReceive={userReceive}
      infoBlock={infoBlock}
      walletTitle={'$YOUR staked'}
    >
      <div style={{ marginTop: '15px' }}>
        <Button
          text={isLoadingFinal ? 'Waiting...' : 'Withdraw'}
          color="primary-gradient"
          widthFill
          onClick={finalUnstakeHandler}
          disabled={isPending}
          isWaitingMode={isLoadingFinal}
        />
      </div>
    </StakingForm>
  );
};
