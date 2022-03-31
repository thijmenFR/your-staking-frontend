import { ChangeEventHandler, FC, useEffect, useState } from 'react';
import { StakingForm } from '@modules/common/components/StakingForm/StakingForm';
import {
  formatNumber,
  getInputValue,
  getSplTokenTokenBalanceUi,
  isNumber,
  sleep,
  useDev,
} from '@utils/index';
import { Pubkeys, solanaConfig } from '../../../../contracts/config';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useYourTransaction } from '../../../../services/useYourTransaction';

interface StakingTabProps {
  userExist: boolean;
}

export const StakingTabContainer: FC<StakingTabProps> = ({ userExist }) => {
  const { publicKey: account, sendTransaction } = useWallet();
  const { createUserTransaction, stakeYourTransaction } = useYourTransaction();
  const { connection } = useConnection();

  const [stakeInputValue, setStakeInputValue] = useState('');
  const [userWalletBalance, setUserWalletBalance] = useState('0');
  const [isWaiting, setIsWaiting] = useState(false);

  const clickAmountMaxHandler = () => setStakeInputValue(userWalletBalance);

  const stakeInputHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = getInputValue(event);
    if (!isNumber(value)) return;
    setStakeInputValue(formatNumber(value, solanaConfig.inputDecimalsCount));
  };

  const getYourTokenBalance = async (address: PublicKey) => {
    const tokenBalance = await connection.getParsedTokenAccountsByOwner(address, {
      mint: Pubkeys.rewardsMintPubkey,
    });
    const balance = getSplTokenTokenBalanceUi(tokenBalance);
    setUserWalletBalance(balance);
  };

  const createUser = async (address: PublicKey) => {
    const createUserTx = await createUserTransaction(address);
    const signature = await sendTransaction(createUserTx, connection);
    await connection.confirmTransaction(signature, 'processed');
  };

  const stakeYourHandler = async () => {
    if (!stakeInputValue || !account) return;
    setIsWaiting(true);

    try {
      if (!userExist) await createUser(account);
      const stakeYourTx = await stakeYourTransaction(account, +stakeInputValue);
      const signature = await sendTransaction(stakeYourTx, connection);
      await connection.confirmTransaction(signature, 'processed');
    } catch (e) {
      useDev(() => console.log(e));
    }
    await sleep(3000);
    await getYourTokenBalance(account);
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
      btnText="Stake YOUR"
      value={stakeInputValue}
      balance={userWalletBalance}
      isWaiting={isWaiting}
      onChange={stakeInputHandler}
      onClick={stakeYourHandler}
      clickAmountMax={clickAmountMaxHandler}
    />
  );
};
