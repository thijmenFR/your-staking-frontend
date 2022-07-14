import { useWallet } from '@solana/wallet-adapter-react';
import React, { ChangeEvent, FC, ReactNode, useContext } from 'react';
import yourCoinIcon from '@assets/images/your-coin.svg';
import Button from '@modules/common/components/Button';
import { WalletModalContext } from '@modules/context/WalletContex';
import { useWeb3React } from '@web3-react/core';

import s from '@modules/home/Home.module.scss';

interface StakingFormProps {
  btnText: string;
  value: string;
  balance: string;
  userReceive?: string;
  isWaiting: boolean;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  clickAmountMax: () => void;
  onClick: () => void;
  infoBlock?: any[];
  children?: ReactNode;
  walletTitle: string;
}

export const StakingForm: FC<StakingFormProps> = ({
  btnText,
  value,
  onChange,
  balance,
  onClick,
  isWaiting,
  clickAmountMax,
  infoBlock = [],
  children,
  walletTitle,
}) => {
  const { publicKey: account } = useWallet();
  const { account: web3Account } = useWeb3React();
  const { setIsConnectWalletModal } = useContext(WalletModalContext);
  const connectWallet = () => {
    setIsConnectWalletModal(true);
  };

  return (
    <form className={s.stakeForm}>
      <div className={s.stakeForm__balance}>
        <p>{walletTitle}</p> <p>{balance} $YOUR</p>
      </div>

      <div className={s.stakeInput}>
        <div className={s.stakeInput__tokenIcon}>
          <img src={yourCoinIcon} alt="YOUR token" />
        </div>
        <input type="text" placeholder="Amount" value={value} onChange={onChange} maxLength={15} />
        <Button onClick={clickAmountMax} text="Max" color="gray" isSmallSize />
      </div>

      {account || web3Account ? (
        <>
          <Button
            onClick={onClick}
            isWaitingMode={isWaiting}
            text={isWaiting ? 'Waiting...' : btnText}
            color="primary-gradient"
            widthFill
          />
          {children}
        </>
      ) : (
        <Button onClick={connectWallet} text="Connect wallet" color="primary-gradient" widthFill />
      )}

      <ul className={s.stakeInfo}>
        {infoBlock.map(({ val }, i) => (
          <li key={i}>{val}</li>
        ))}
      </ul>
    </form>
  );
};
