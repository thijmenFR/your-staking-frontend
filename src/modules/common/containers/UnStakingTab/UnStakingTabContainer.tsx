import { ChangeEventHandler, FC, useEffect, useState } from 'react';
import { StakingForm } from '@modules/common/components/StakingForm/StakingForm';
import {
  formatNumber,
  getInputValue,
  getSplTokenTokenBalanceUi,
  isNumber,
  useDev,
} from '@utils/index';
import { Pubkeys, solanaConfig } from '../../../../contracts/config';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useYourTransaction } from '../../../../services/useYourTransaction';

interface UnStakingTabProps {
  userExist: boolean;
}

export const UnStakingTabContainer: FC<UnStakingTabProps> = ({ userExist }) => {
  const { publicKey: account, sendTransaction } = useWallet();
  const { unstakeYourTransaction } = useYourTransaction();
  const { connection } = useConnection();

  const [inputValue, setInputValue] = useState('');
  const [userWalletBalance, setUserWalletBalance] = useState('0');
  const [isWaiting, setIsWaiting] = useState(false);

  const clickAmountMaxHandler = () => setInputValue(userWalletBalance);

  const inputHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = getInputValue(event);
    if (!isNumber(value)) return;
    setInputValue(formatNumber(value, solanaConfig.inputDecimalsCount));
  };

  const getYourTokenBalance = async (address: PublicKey) => {
    const tokenBalance = await connection.getParsedTokenAccountsByOwner(address, {
      mint: Pubkeys.rewardsMintPubkey,
    });
    const balance = getSplTokenTokenBalanceUi(tokenBalance);
    setUserWalletBalance(balance);
  };

  const buttonHandler = async () => {
    if (!inputValue || !account || !userExist) return;
    setIsWaiting(true);

    try {
      const unstakeYourTx = await unstakeYourTransaction(account, +inputValue);
      const signature = await sendTransaction(unstakeYourTx, connection);
      await connection.confirmTransaction(signature, 'processed');
    } catch (e) {
      useDev(() => console.log(e));
    }
    getYourTokenBalance(account);
    setIsWaiting(false);
  };

  useEffect(() => {
    if (account) {
      getYourTokenBalance(account);
    } else {
      setUserWalletBalance('0');
    }
  }, [account]);

  return (
    <StakingForm
      btnText="Unstake YOUR"
      value={inputValue}
      balance={userWalletBalance}
      isWaiting={isWaiting}
      onChange={inputHandler}
      onClick={buttonHandler}
      clickAmountMax={clickAmountMaxHandler}
    />
  );
};
