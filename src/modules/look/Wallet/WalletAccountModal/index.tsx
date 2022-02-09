import s from './WalletAccountModal.module.scss';
import Logo from '@modules/common/components/Logo';
import Button from '@modules/common/components/Button';
import linkIcon from '@assets/images/external-link.svg';
import linkIconDark from '@assets/images/external-link--darkGreen.svg';
import { useContext } from 'react';
import AppContext from '@modules/layout/context/AppContext';

interface WalletAccountModalProps {
  connectedWallet: string;
  connectedWalletLogo: string;
  walletBalance: string | number;
}

const WalletAccountModal = ({
  connectedWallet,
  walletBalance,
  connectedWalletLogo,
}: WalletAccountModalProps) => {
  const { isLightMode } = useContext(AppContext);

  const disconnectWallet = () => {
    console.log('Disconnect Wallet');
  };

  return (
    <div className={s.walletAccount}>
      <div className={s.walletAccount__logo}>
        <Logo />
      </div>
      <h5>Account</h5>

      <p className={s.walletAccount__status}>Connected with {connectedWallet}</p>

      <div className={s.accountInfo}>
        <div className={s.accountInfo__logo}>
          <img src={connectedWalletLogo} alt="Wallet Logo" />
        </div>

        <p className={s.accountInfo__title}>{connectedWallet}</p>

        <p className={s.accountInfo__value}>{walletBalance}</p>
      </div>
      <ul className={s.accountLinks}>
        <li>
          <a href="#" target="_blank" className={s.accountLinks__item}>
            View{' '}
            <span>
              <img src={isLightMode ? linkIconDark : linkIcon} alt="icon" />
            </span>
          </a>
        </li>
        <li>
          <button className={s.accountLinks__item} type="button">
            Copy address
            <span>
              <img src={isLightMode ? linkIconDark : linkIcon} alt="icon" />
            </span>
          </button>
        </li>
      </ul>
      <Button
        onClick={disconnectWallet}
        text="Disconnect wallet"
        color="primary-gradient"
        widthFill
      />
    </div>
  );
};

export default WalletAccountModal;
