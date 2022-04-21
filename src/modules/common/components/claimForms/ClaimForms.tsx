import React, { FC, useContext } from 'react';
import s from '@modules/home/Home.module.scss';
import Button from '@modules/common/components/Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletModalContext } from '@modules/context/WalletContex';

interface ClaimFormsProps {
  balance: string;
  btnText: string;
  value: string;
  userReceive?: string;
  isWaiting: boolean;
  onClick: () => void;
}

export const ClaimForms: FC<ClaimFormsProps> = ({
  balance,
  onClick,
  isWaiting,
  btnText,
  value,
  userReceive,
}) => {
  const { publicKey: account } = useWallet();

  const { setIsConnectWalletModal } = useContext(WalletModalContext);
  const connectWallet = () => {
    setIsConnectWalletModal(true);
  };
  return (
    <form className={s.stakeForm}>
      <div className={s.stakeForm__balance}>
        <p>Wallet balance</p> <p>{balance} $YOUR</p>
      </div>

      <div className={s.stakeForm__claim}>
        <div>Claimable rewards</div>
        <div>{value} $YOUR</div>
      </div>

      {account ? (
        <Button
          onClick={onClick}
          isWaitingMode={isWaiting}
          text={isWaiting ? 'Waiting...' : btnText}
          color="primary-gradient"
          widthFill
        />
      ) : (
        <Button onClick={connectWallet} text="Connect wallet" color="primary-gradient" widthFill />
      )}
    </form>
  );
};
