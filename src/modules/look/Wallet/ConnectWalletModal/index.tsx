import s from './ConnectWalletModal.module.scss';
import Logo from '@modules/common/components/Logo';
import { Checkbox } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { WalletName } from '@solana/wallet-adapter-base';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import cn from 'classnames';

interface ConnectWalletModalProps {
  handleModalVisible: (bool: boolean) => void;
}

const ConnectWalletModal: FC<ConnectWalletModalProps> = ({ handleModalVisible }) => {
  const { wallets, select } = useWallet();
  const [isChecked, setIsChecked] = useState(false);
  const [isShake, setIsShake] = useState(false);

  useEffect(() => {
    const setTimeoutID = setTimeout(() => {
      setIsShake(false);
    }, 500);
    return () => clearTimeout(setTimeoutID);
  }, [isShake]);

  const handleWalletClick = useCallback(
    (event: MouseEvent, walletName: WalletName) => {
      setIsShake(true);
      if (!isChecked) return;
      select(walletName);
      handleModalVisible(false);
    },
    [select, isChecked],
  );

  const confirmPrivacy = (e: CheckboxChangeEvent) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className={s.connectWallet}>
      <div className={s.connectWallet__logo}>
        <Logo />
      </div>
      <h5>Choose your wallet</h5>
      <div className={s.confirmPrivacy}>
        <Checkbox onChange={confirmPrivacy} className={cn({ [s.shake]: isShake })}>
          I have read and accept{' '}
          <a href="#" target="_blank">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" target="_blank">
            Privacy Policy
          </a>
        </Checkbox>
      </div>

      <ul className={s.connectWallet__list}>
        {wallets.map(({ adapter }) => (
          <li key={adapter.name} onClick={(e) => handleWalletClick(e, adapter.name)}>
            <a href="#">
              <div className={s.connectWallet__listLogo}>
                <img src={adapter.icon} alt="Wallet Icon" />
              </div>
              <p className={s.connectWallet__walletName}>{adapter.name}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectWalletModal;
