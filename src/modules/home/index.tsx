import React, { useState } from 'react';
import FaqBlock from '@modules/common/components/FaqBlock';
import StatsBlock from '@modules/common/components/StatsBlock';
import { Tabs } from 'antd';
import yourCoinIcon from '@assets/images/your-coin.svg';
import Button from '@modules/common/components/Button';
import CustomTooltip from '@modules/common/components/CustomTooltip';

import s from './Home.module.scss';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  adminAccount,
  rewardDurationInDays,
  useYourSolana,
  yourPoolStorageAccount,
  yourRewardsVault,
  yourStakingVault,
} from '../../services/useYourSolana';
import { sendAndConfirmTransaction } from '@solana/web3.js';

const { TabPane } = Tabs;

interface StakingFormProps {
  btnText: string;
}

const StakingForm = ({ btnText }: StakingFormProps) => {
  const { publicKey: account, signTransaction, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();

  const {
    getUserStorageAccount,
    getUserStorageAccountWithNonce,
    createUserTransaction,
    stakeYourTransaction,
    createInitializePoolTransaction,
    findAssociatedTokenAddress,
  } = useYourSolana();
  // Click on Amount Max button
  const clickAmountMax = () => {
    console.log('clickAmountMax');
  };

  // Click on Stake button, waiting alert
  const [isWaiting, setIsWaiting] = useState(false);
  const [userWalletBalance, setUserWalletBalance] = useState('100.000');
  const connectWallet = () => {
    console.log('Connect Wallet Btn');
  };
  const isWaitingActive = async () => {
    const initializePoolTx = await createInitializePoolTransaction(
      adminAccount.publicKey,
      yourPoolStorageAccount,
      yourStakingVault,
      yourRewardsVault,
      rewardDurationInDays,
      1000000000000,
    );
    await sendAndConfirmTransaction(connection, initializePoolTx, [
      adminAccount,
      yourPoolStorageAccount,
      yourStakingVault,
      yourRewardsVault,
    ]);

    // const amountToStake = 10;
    // const createUserTx = await createUserTransaction(account!);
    // const stakeYourTx = await stakeYourTransaction(account!, amountToStake);
    // // if (signTransaction) {
    // //   const signature = await sendTransaction(stakeYourTx, connection);
    // //   await connection.confirmTransaction(signature, 'processed');
    // //
    // //   console.log(signature);
    // // }
    // if (sendTransaction) {
    //   const signature = await sendTransaction(createUserTx, connection);
    //   await connection.confirmTransaction(signature);
    //
    //   console.log(signature);
    // }
  };

  return (
    <form className={s.stakeForm}>
      <div className={s.stakeForm__balance}>
        <p>Wallet balance</p> <p>{userWalletBalance} $YOUR</p>
      </div>

      <div className={s.stakeInput}>
        <div className={s.stakeInput__tokenIcon}>
          <img src={yourCoinIcon} alt="YOUR token" />
        </div>
        <input type="number" placeholder="Amount" />
        <Button onClick={clickAmountMax} text="Max" color="gray" isSmallSize />
      </div>

      {account ? (
        <Button
          onClick={isWaitingActive}
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
          <p>0 $YOUR</p>
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

const HomePage = (): any => {
  // Active Tab is change
  const tabChange = (key: string) => {
    console.log(key, 'is active tab');
  };

  return (
    <section className={s.home}>
      <div className="container">
        <div className={s.home__inner}>
          <h1>Stake to earn</h1>
          <h2>Stake YOUR and earn rewards</h2>

          <div className="custom-tabs">
            <Tabs defaultActiveKey="1" onChange={tabChange} centered>
              <TabPane tab="Stake" key="1">
                <StakingForm btnText="Stake YOUR" />
              </TabPane>
              <TabPane tab="Unstake" key="2">
                <StakingForm btnText="Unstake YOUR" />
              </TabPane>
            </Tabs>
          </div>
        </div>

        <StatsBlock />
        <FaqBlock />
      </div>
    </section>
  );
};

export default HomePage;
