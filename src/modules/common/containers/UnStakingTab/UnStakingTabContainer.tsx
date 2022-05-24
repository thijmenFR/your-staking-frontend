import React, { ChangeEventHandler, FC, useCallback, useContext, useMemo, useState } from 'react';
import Countdown from 'react-countdown';
import { useWallet } from '@solana/wallet-adapter-react';

import { StakingForm } from '@modules/common/components/StakingForm/StakingForm';
import { formatNumber, getInputValue, isNumber } from '@utils/index';
import { solanaConfig } from '../../../../contracts/config';
import { IYourTab } from '../../../../types';
import { useUserData } from '../../../../hooks/query/useUserData';
import Button from '@modules/common/components/Button';
import { useSendMutation } from '../../../../hooks/mutation/useSendMutation';
import { useYourPoolData } from '../../../../hooks/query/useYourPoolData';
import { UNSTAKING_TAB_TEXT } from '../../../../lang/en';
import { ModalContext } from '@modules/context/ModalContext';
import ProgressBar from '@modules/common/components/ProgressBar';

export const UnStakingTabContainer: FC<IYourTab> = ({ userExist }) => {
  const { publicKey: account } = useWallet();
  const { userStakedBalance, isPending, unstakePendingAmount, timeToUnlock } = useUserData();
  const { getReceiveUser } = useYourPoolData();
  const { isLoading, mutateAsync } = useSendMutation('unstake');
  const { isLoading: isLoadingFinal, mutate } = useSendMutation('finalUnstake');
  const [inputValue, setInputValue] = useState('');

  const { modalDataSuccessHandler, modalErrorHandler } = useContext(ModalContext);

  const clickAmountMaxHandler = () => setInputValue(userStakedBalance);

  const userReceive = getReceiveUser(+inputValue);

  const inputHandler: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const value = getInputValue(event);
    if (!isNumber(value)) return;
    setInputValue(formatNumber(value, solanaConfig.inputDecimalsCount));
  }, []);

  const unstakeHandler = useCallback(async () => {
    if (!inputValue || !account || !userExist) return;
    try {
      await mutateAsync(inputValue);
      modalDataSuccessHandler({
        txHash: '',
        userBalance: userStakedBalance,
        stakeInputValue: inputValue,
        message: 'unstaked',
      });
      setInputValue('');
    } catch (e) {
      modalErrorHandler();
    }
  }, [inputValue, account, userExist, mutateAsync]);

  const finalUnstakeHandler = useCallback(async () => {
    if (!account || !userExist || isPending) return;
    mutate(undefined);
  }, [account, userExist, isLoading, mutate]);

  const infoBlock = useMemo(
    () => [
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
            <div className="progress">
              <Countdown
                autoStart={false}
                daysInHours
                date={Date.now() + timeToUnlock}
                renderer={({ formatted: { hours, minutes, seconds } }) => (
                  <span>
                    {hours}h {minutes}m {seconds}s
                  </span>
                )}
              />
              <div className="progress-bar">
                <ProgressBar percentValue={timeToUnlock !== 0 ? 100 - +timeToUnlock / 1000 : 0} />
              </div>
            </div>
          </>
        ),
      },
    ],
    [unstakePendingAmount, timeToUnlock],
  );
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
