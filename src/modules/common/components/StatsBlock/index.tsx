import s from './StatsBlock.module.scss';
import { Progress } from 'antd';
import AppContext from '@modules/layout/context/AppContext';
import { useContext } from 'react';

const StatsBlock = () => {
  const { isLightMode } = useContext(AppContext);
  return (
    <ul className={s.statsList}>
      <li>
        <h4 className={s.statsList__title}>YOUR/SOL price</h4>
        <p className={s.statsList__value}>0.001 SOL</p>
        <p className={s.statsList__subValue}>≈ $0,00</p>
      </li>
      <li>
        <h4 className={s.statsList__title}>Total staked</h4>
        <p className={s.statsList__value}>6.82M</p>
        <p className={s.statsList__subValue}>≈ $0,00</p>
      </li>
      <li>
        <h4 className={s.statsList__title}>APY</h4>
        <p className={s.statsList__value}>29,5%</p>
        <a className={s.statsList__link} href="/">
          See stats
          <span></span>
        </a>
      </li>
      <li>
        <h4 className={s.statsList__title}>Epoch</h4>
        <p className={s.statsList__value}>48,9%</p>
        <p className={s.statsList__subValue}>
          ETA 16h 35m
          <span className="progress-bar">
            <Progress
              percent={50}
              showInfo={false}
              strokeWidth={7}
              strokeColor={{
                '0%': '#88CAB9',
                '100%': '#2B7368',
              }}
              trailColor={isLightMode ? '#E5EEED' : '#3A5659'}
              status="active"
            />
          </span>
        </p>
      </li>
    </ul>
  );
};

export default StatsBlock;
