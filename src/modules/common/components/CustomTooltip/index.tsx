import React from 'react';
import { Tooltip } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { InfoCircleOutlined } from '@ant-design/icons';

interface CustomTooltipProps {
  text: string;
}

const CustomTooltip = ({ text }: CustomTooltipProps) => {
  const tooltipText = <span>{text}</span>;

  return (
    <Tooltip
      placement="top"
      color="transparent"
      title={tooltipText}
      overlayClassName="custom-tooltip"
      overlayInnerStyle={{ boxShadow: 'none' }}
    >
      <InfoCircleOutlined style={{ color: '#0C7E63', fontSize: '13px' }} />
    </Tooltip>
  );
};

export default CustomTooltip;
