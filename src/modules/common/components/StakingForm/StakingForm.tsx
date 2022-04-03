import { useYourTransaction } from '../../../../services/useYourTransaction';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { ChangeEvent, ChangeEventHandler, FC, FormEvent, useEffect, useState } from 'react';
import { getSplTokenTokenBalanceUi, getUserPendingRewards } from '@utils/index';
import { PublicKey } from '@solana/web3.js';
import { Pubkeys } from '../../../../contracts/config';
import s from '@modules/home/Home.module.scss';
import yourCoinIcon from '@assets/images/your-coin.svg';
import Button from '@modules/common/components/Button';
import CustomTooltip from '@modules/common/components/CustomTooltip';

interface StakingFormProps {
  btnText: string;
  value: string;
  balance: string;
  userReceive?: string;
  isWaiting: boolean;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  clickAmountMax: () => void;
  onClick: () => void;
}

export const StakingForm: FC<StakingFormProps> = ({
  btnText,
  value,
  onChange,
  balance,
  onClick,
  isWaiting,
  clickAmountMax,
  userReceive = 0,
}) => {
  const { createUserTransaction, stakeYourTransaction } = useYourTransaction();
  const { publicKey: account, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // Click on Stake button, waiting alert
  const [userWalletBalance, setUserWalletBalance] = useState('0');
  const connectWallet = () => {
    console.log('Connect Wallet Btn');
  };

  const stakeYourHandler = async () => {
    if (account) {
      getUserPendingRewards(account, connection);
      // const createUserTx = await createUserTransaction(account);
      const stakeYourTx = await stakeYourTransaction(account, 100);
      const signature = await sendTransaction(stakeYourTx, connection);
      console.log(signature);
      await connection.confirmTransaction(signature, 'processed');
    }
  };

  return (
    <form className={s.stakeForm}>
      <div className={s.stakeForm__balance}>
        <p>Wallet balance</p> <p>{balance} $YOUR</p>
      </div>

      <div className={s.stakeInput}>
        <div className={s.stakeInput__tokenIcon}>
          <img src={yourCoinIcon} alt="YOUR token" />
        </div>
        <input type="text" placeholder="Amount" value={value} onChange={onChange} maxLength={15} />
        <Button onClick={clickAmountMax} text="Max" color="gray" isSmallSize />
      </div>

      {account ? (
        <Button
          onClick={onClick}
          isWaitingMode={isWaiting}
          text={isWaiting ? 'Waiting...' : btnText}
          color="primary-gradient"
          widthFill
        />
      ) : (
        <Button onClick={connectWallet} text="Connect wallet" color="primary-gradient" widthFill />
      )}

      <ul className={s.stakeInfo}>
        <li>
          <p>You will receive</p>
          <p>{userReceive} $YOUR</p>
        </li>
        <li>
          <p>
            Exchange rate{' '}
            <CustomTooltip
              text="mSOL/SOL price increases every epoch because staking rewards are accumulated into
               the SOL staked pool. Therefore, the ratio is not 1:1. This ratio only goes up with time."
            />
          </p>
          <p>1 $YOUR ≈ 1.01 $YOUR</p>
        </li>
        <li>
          <p>
            Deposit fee{' '}
            <CustomTooltip text="There is 0% fee for staking your SOL and receiving mSOL." />
          </p>
          <p>1$ 0%</p>
        </li>
      </ul>
    </form>
  );
};
