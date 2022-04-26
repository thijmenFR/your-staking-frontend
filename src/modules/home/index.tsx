import React, { useEffect, useMemo, useState } from 'react';
import FaqBlock from '@modules/common/components/FaqBlock';
import StatsBlock from '@modules/common/components/StatsBlock';
import { Tabs } from 'antd';

import s from './Home.module.scss';
import {
  epochDurationInSlotsPercent,
  epochETA,
  epochNumber,
  formatNumber,
  getUserPendingRewards,
  userIsExist,
} from '@utils/index';
import { StakingTabContainer } from '@modules/common/containers/StakingTab/StakingTabContainer';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { UnStakingTabContainer } from '@modules/common/containers/UnStakingTab/UnStakingTabContainer';
import { useYourPoolData } from '../../hooks/query/useYourPoolData';
import { useCoinGecko } from '../../hooks/query/useCoinGecko';
import { ClaimTab } from '@modules/common/containers/ClaimTab/ClaimTab';
import { useSlot } from '../../hooks/useSlot';

const { TabPane } = Tabs;

const HomePage = (): any => {
  const { publicKey: account } = useWallet();
  const { connection } = useConnection();
  const { poolData, usersTotalStake, getApy, epochPercent } = useYourPoolData();
  const { priceYourSol } = useCoinGecko();
  const { slot } = useSlot();
  const [userExist, setUserExist] = useState(false);
  const tabChange = (key: string) => {};

  const epochNumb = useMemo(() => {
    if (!poolData) return '1';
    return epochNumber(slot, poolData);
  }, [slot, poolData]);

  const epochTimeToEnd = useMemo(() => {
    if (poolData && +slot) return epochETA(slot, poolData);
    return 1;
  }, [slot, poolData]);

  const userExistHandler = async () => {
    if (!account) return;
    const existUser = await userIsExist(account, connection);
    setUserExist(existUser);
  };

  useEffect(() => {
    userExistHandler();
    if (account) {
      getUserPendingRewards(account, connection);
    }
  }, [account]);
  return (
    <section className={s.home}>
      <div className="container">
        <div className={s.home__inner}>
          <h1>Stake to earn</h1>
          <h2>Stake YOUR and earn rewards</h2>
          <div className="custom-tabs">
            <Tabs defaultActiveKey="1" onChange={tabChange} centered>
              <TabPane tab="Stake" key="1">
                <StakingTabContainer userExist={userExist} />
              </TabPane>
              <TabPane tab="Unstake" key="2">
                <UnStakingTabContainer userExist={userExist} />
              </TabPane>
              <TabPane tab="Claim" key="3">
                <ClaimTab userExist={userExist} currentSlot={slot} />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <StatsBlock
          totalStaked={usersTotalStake}
          apy={formatNumber(getApy, 6)}
          epochNumb={epochNumb}
          epochPercent={epochPercent}
          eta={epochTimeToEnd}
          priceYourSol={priceYourSol}
        />
        <FaqBlock />
      </div>
    </section>
  );
};

export default HomePage;
