import { ChangeEventHandler, FC, useState } from 'react';
import { StakingForm } from '@modules/common/components/StakingForm/StakingForm';
import { formatNumber, getInputValue, isNumber } from '@utils/index';
import { solanaConfig } from '../../../../contracts/config';
import { useWallet } from '@solana/wallet-adapter-react';
import { IYourTab } from '../../../../types';
import { useUserData } from '../../../../hooks/query/useUserData';
import Button from '@modules/common/components/Button';
import { useSendMutation } from '../../../../hooks/mutation/useSendMutation';

export const UnStakingTabContainer: FC<IYourTab> = ({ userExist }) => {
  const { publicKey: account } = useWallet();
  const { userStakedBalance } = useUserData();
  const { isLoading, mutateAsync } = useSendMutation('unstake');
  const { isLoading: isLoadingFinal, mutate } = useSendMutation('finalUnstake');

  const [inputValue, setInputValue] = useState('');

  const clickAmountMaxHandler = () => setInputValue(userStakedBalance);

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
    if (!account || !userExist) return;
    mutate(undefined);
  };

  return (
    <StakingForm
      btnText="Unstake YOUR"
      value={inputValue}
      balance={userStakedBalance}
      isWaiting={isLoading}
      onChange={inputHandler}
      onClick={unstakeHandler}
      clickAmountMax={clickAmountMaxHandler}
    >
      <div style={{ marginTop: '15px' }}>
        <Button
          text={isLoadingFinal ? 'Waiting...' : 'Final Unstake'}
          color="primary-gradient"
          widthFill
          onClick={finalUnstakeHandler}
          isWaitingMode={isLoadingFinal}
        />
      </div>
    </StakingForm>
  );
};
