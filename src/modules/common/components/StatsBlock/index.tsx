import ProgressBar from '@modules/common/components/ProgressBar';
import s from './StatsBlock.module.scss';
import cn from 'classnames';
import { FC } from 'react';
import { formatNumber } from '@utils/index';
import Countdown from 'react-countdown';

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
  apy: string;
  epochNumb: string;
  epochPercent: string;
  eta: number;
  priceYourSol: string;
}

const StatsBlock: FC<StatsBlockProps> = ({
  totalStaked,
  apy,
  epochNumb,
  epochPercent,
  eta,
  priceYourSol,
}) => {
  const reductionNumber = (value: string, dig = 1) => {
    if (isNaN(+value) || value === null) return '0';
    const [number, float] = value.split('.');
    if (float) {
      return [number.substring(0, dig), float.substring(0, 2)].join('.');
    }
    return number.substring(0, dig);
  };
  const reduction = (val: string) => {
    const [numb] = val.split('.');
    if (numb.length === 4) return reductionNumber(val) + 'K';
    if (numb.length === 5) return reductionNumber(val, 2) + 'K';
    if (numb.length === 6) return reductionNumber(val, 3) + 'K';
    if (numb.length === 7) return reductionNumber(val) + 'M';
    if (numb.length === 8) return reductionNumber(val, 2) + 'M';
    if (numb.length === 9) return reductionNumber(val, 3) + 'M';
    return numb;
  };
  return (
    <ul className={s.statsList}>
      <li>
        <h4 className={s.statsList__title}>{statsInfo.priceTitle}</h4>
        <p className={s.statsList__value}>{priceYourSol}</p>
        <p className={s.statsList__subValue}>{statsInfo.priceSubValue}</p>
      </li>
      <li>
        <h4 className={s.statsList__title}>{statsInfo.stakedTitle}</h4>
        <p className={s.statsList__value}>{reduction(totalStaked)}</p>
        <p className={s.statsList__subValue}>{statsInfo.stakedSubValue}</p>
      </li>
      <li id={s.apy}>
        <h4 className={s.statsList__title}>{statsInfo.apyTitle}</h4>
        <p className={s.statsList__value}>{apy}%</p>
        <a className={s.statsList__link} href="/">
          See stats
        </a>
      </li>
      <li>
        <h4 className={s.statsList__title}>
          <span>{statsInfo.epochTitle}</span>
          <span>#{epochNumb}</span>
        </h4>
        <p className={s.statsList__value}>{formatNumber(100 - +epochPercent, 1)}%</p>
        <div className={cn(s.statsList__subValue, s.statsList__progressBar)}>
          <p>
            <Countdown
              daysInHours
              date={Date.now() + eta}
              renderer={({ formatted: { minutes, seconds } }) => (
                <span>
                  ETA {minutes}m {seconds}s
                </span>
              )}
            />
          </p>
          <div className="progress-bar">
            <ProgressBar percentValue={100 - +epochPercent} />
          </div>
        </div>
      </li>
    </ul>
  );
};

export default StatsBlock;
