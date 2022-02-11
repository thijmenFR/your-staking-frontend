import s from './WalletAccountModal.module.scss';
import Logo from '@modules/common/components/Logo';
import Button from '@modules/common/components/Button';
import linkIcon from '@assets/images/external-link.svg';
import linkIconDark from '@assets/images/external-link--darkGreen.svg';
import { useContext } from 'react';
import AppContext from '@modules/layout/context/AppContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { solanaConfig } from '../../../../contracts/config';
import { useWalletBalance } from '@modules/common/hooks';
import { formatNumber } from '@utils/index';

interface WalletAccountModalProps {
  handleModalVisible: (bool: boolean) => void;
}

const { soloScan } = solanaConfig;

const WalletAccountModal = ({ handleModalVisible }: WalletAccountModalProps) => {
  const { isLightMode } = useContext(AppContext);
  const { disconnect, publicKey, wallet } = useWallet();
  const walletBalance = useWalletBalance(publicKey);

  const connectWalletName = wallet?.adapter.name || '';
  const disconnectWallet = async () => {
    await disconnect();
    handleModalVisible(false);
  };
  const copy = async () => {
    await navigator.clipboard.writeText(publicKey ? publicKey.toJSON() : '');
  };

  return (
    <div className={s.walletAccount}>
      <div className={s.walletAccount__logo}>
        <Logo />
      </div>
      <h5>Account</h5>

      <p className={s.walletAccount__status}>Connected with {connectWalletName}</p>

      <div className={s.accountInfo}>
        <div className={s.accountInfo__logo}>
          <img src={wallet?.adapter.icon} alt="Wallet Logo" />
        </div>

        <p className={s.accountInfo__title}>{connectWalletName}</p>

        <p className={s.accountInfo__value}>{formatNumber(walletBalance)}</p>
      </div>
      <ul className={s.accountLinks}>
        <li>
          <a href={soloScan(publicKey?.toJSON())} target="_blank" className={s.accountLinks__item}>
            View{' '}
            <span>
              <img src={isLightMode ? linkIconDark : linkIcon} alt="icon" />
            </span>
          </a>
        </li>
        <li>
          <button className={s.accountLinks__item} type="button" onClick={copy}>
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
