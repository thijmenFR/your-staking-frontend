import React from 'react';
import FaqBlock from '@modules/common/components/FaqBlock';
import StatsBlock from '@modules/common/components/StatsBlock';
import s from './Home.module.scss';

const HomePage = () => {
  return (
    <section className={s.home}>
      <div className="container">
        <div className={s.home__inner}>
          <h1>Stake to earn</h1>
          <h2>Stake YOUR and earn rewards</h2>
        </div>

        <StatsBlock />
        <FaqBlock />
      </div>
    </section>
  );
};

export default HomePage;
