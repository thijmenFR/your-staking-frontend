import React, { FC, useContext } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import iconCheckMark from '@assets/images/iconsToFont/check-mark-svgrepo-com.svg';
import iconErrorMark from '@assets/images/iconsToFont/Error-icon.svg';

import s from '@modules/common/components/ConfirmationPopUp/styles.module.scss';
import { ErrorProps, ModalType, SuccessProps } from '../../../../types';
import { ModalContext } from '@modules/context/ModalContext';
import AppContext from '@modules/layout/context/AppContext';

const Success: FC<SuccessProps> = ({ tokensCount, newBalance, txHash, message = 'staked' }) => (
  <div className={s.content}>
    <div className={s.icon}>
      <img src={iconCheckMark} alt="Success" />
    </div>
    <div className={s.mainText}>
      {tokensCount} $YOUR Succesfully {message}
    </div>
    <div className={s.secondText}>Your new stYOUR balance is {newBalance}</div>
    <div className={s.infoBlock}>
      <div className={s.description}>Check the status of transaction on Block Explorer</div>
      <div className={s.explorer}>
        <a href="" target="_blank">
          View on Block Explorer
        </a>
      </div>
    </div>
  </div>
);
const Error: FC<ErrorProps> = ({ txHash }) => (
  <div className={s.content}>
    <div className={s.icon}>
      <img src={iconErrorMark} alt="Error" />
    </div>
    <div className={s.mainText}>ERROR</div>
    <div className={s.infoBlock}>
      <div className={s.description}>Check the status of transaction on Block Explorer</div>
      <div className={s.explorer}>
        <a href="" target="_blank">
          View on Block Explorer
        </a>
      </div>
    </div>
  </div>
);

export const ConfirmationPopUp: FC = () => {
  const { isLightMode } = useContext(AppContext);
  const contentStyle = {
    maxWait: '680px',
    maxHeight: '566px',
    borderRadius: '16px',
    background: isLightMode ? '#fff' : '#022429',
    borderColor: 'transparent',
  };
  const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
  const {
    data: { type, ...props },
    isOpen,
    resetData,
  } = useContext(ModalContext);

  return (
    <Popup {...{ contentStyle, overlayStyle }} open={isOpen} modal onClose={() => resetData()}>
      {type === ModalType.success && <Success {...props} />}
      {type === ModalType.error && <Error txHash={props.txHash} />}
    </Popup>
  );
};
