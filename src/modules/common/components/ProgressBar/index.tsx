import { Progress } from 'antd';
import AppContext from '@modules/layout/context/AppContext';
import { useContext } from 'react';

interface ProgressBarProps {
  percentValue?: number;
}

const ProgressBar = ({ percentValue }: ProgressBarProps) => {
  const { isLightMode } = useContext(AppContext);
  return (
    <Progress
      percent={percentValue}
      showInfo={false}
      strokeWidth={7}
      strokeColor={{
        '0%': '#88CAB9',
        '100%': '#2B7368',
      }}
      trailColor={isLightMode ? '#E5EEED' : '#3A5659'}
      status="active"
    />
  );
};

export default ProgressBar;
