import React, { useState } from 'react';
import FaqBlock from '@modules/common/components/FaqBlock';
import StatsBlock from '@modules/common/components/StatsBlock';
import { Tabs } from 'antd';
import yourCoinIcon from '@assets/images/your-coin.svg';
import Button from '@modules/common/components/Button';
import CustomTooltip from '@modules/common/components/CustomTooltip';
import { userLogged } from '@utils/index';

import s from './Home.module.scss';

const { TabPane } = Tabs;

interface StakingFormProps {
  btnText: string;
}

const HomePage = () => {
  // Active Tab is change
  const tabChange = (key: string) => {
    console.log(key, 'is active tab');
  };

  const StakingForm = ({ btnText }: StakingFormProps) => {
    // Click on Amount Max button
    const clickAmountMax = () => {
      console.log('clickAmountMax');
    };

    // Click on Stake button, waiting alert
    const [isWaiting, setIsWaiting] = useState(false);

    const isWaitingActive = () => {
      setIsWaiting(!isWaiting);
      console.log('is Waiting', !isWaiting);
    };

    const connectWallet = () => {
      console.log('Connect Wallet Btn');
    };

    return (
      <form className={s.stakeForm}>
        <div className={s.stakeForm__balance}>
          <p>Wallet balance</p> <p>100.000 $YOUR</p>
        </div>

        <div className={s.stakeInput}>
          <div className={s.stakeInput__tokenIcon}>
            <img src={yourCoinIcon} alt="YOUR token" />
          </div>
          <input type="number" placeholder="Amount" />
          <Button onClick={clickAmountMax} text="Max" color="gray" isSmallSize />
        </div>

        {userLogged ? (
          <Button
            onClick={isWaitingActive}
            isWaitingMode={isWaiting}
            text={isWaiting ? 'Waiting...' : btnText}
            color="primary-gradient"
            widthFill
          />
        ) : (
          <Button
            onClick={connectWallet}
            text="Connect wallet"
            color="primary-gradient"
            widthFill
          />
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
