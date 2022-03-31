import ProgressBar from '@modules/common/components/ProgressBar';
import s from './StatsBlock.module.scss';
import cn from 'classnames';
import { FC } from 'react';

const statsInfo = {
  priceTitle: 'YOUR/SOL price',
  priceValue: '0.001 SOL',
  priceSubValue: '≈ $0,00',

  stakedTitle: 'Total staked',
  stakedValue: '6.82M',
  stakedSubValue: '≈ $0,00',

  apyTitle: 'APY',
  apyValue: '29,5%',

  epochTitle: 'Epoch',
  epochValue: '48,9%',
  epochSubValue: 'ETA 16h 35m',
  epochProgress: 50,
};

interface StatsBlockProps {
  totalStaked: string;
}

const StatsBlock: FC<StatsBlockProps> = ({ totalStaked }) => {
  return (
    <ul className={s.statsList}>
      <li>
        <h4 className={s.statsList__title}>{statsInfo.priceTitle}</h4>
        <p className={s.statsList__value}>{statsInfo.priceValue}</p>
        <p className={s.statsList__subValue}>{statsInfo.priceSubValue}</p>
      </li>
      <li>
        <h4 className={s.statsList__title}>{statsInfo.stakedTitle}</h4>
        <p className={s.statsList__value}>{totalStaked}</p>
        <p className={s.statsList__subValue}>{statsInfo.stakedSubValue}</p>
      </li>
      <li id={s.apy}>
        <h4 className={s.statsList__title}>{statsInfo.apyTitle}</h4>
        <p className={s.statsList__value}>{0}%</p>
        <a className={s.statsList__link} href="/">
          See stats
        </a>
      </li>
      <li>
        <h4 className={s.statsList__title}>{statsInfo.epochTitle}</h4>
        <p className={s.statsList__value}>{statsInfo.epochValue}</p>
        <div className={cn(s.statsList__subValue, s.statsList__progressBar)}>
          <p>{statsInfo.epochSubValue}</p>
          <div className="progress-bar">
            <ProgressBar percentValue={statsInfo.epochProgress} />
          </div>
        </div>
      </li>
    </ul>
  );
};

export default StatsBlock;
