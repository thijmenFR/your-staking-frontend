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
import { useWeb3React } from '@web3-react/core';
import walletConnectLogo from '@assets/images/wallet/wallet-connect.svg';

import s from './WalletAccountModal.module.scss';

interface WalletAccountModalProps {
  handleModalVisible: (bool: boolean) => void;
}

const { soloScan } = solanaConfig;

const WalletAccountModal = ({ handleModalVisible }: WalletAccountModalProps) => {
  const { isLightMode } = useContext(AppContext);
  const { disconnect, publicKey, wallet } = useWallet();
  const { account: web3Account, deactivate } = useWeb3React();
  const walletBalance = useWalletBalance(publicKey);

  const connectWalletName = wallet?.adapter.name || '';
  const disconnectWallet = async () => {
    await disconnect();
    handleModalVisible(false);
  };
  const copy = async () => {
    publicKey
      ? await navigator.clipboard.writeText(publicKey ? publicKey.toJSON() : '')
      : web3Account && (await navigator.clipboard.writeText(web3Account ? web3Account : ''));
  };

  return (
    <div className={s.walletAccount}>
      <div className={s.walletAccount__logo}>
        <Logo />
      </div>
      <h5>Account</h5>

      <p className={s.walletAccount__status}>
        Connected with {!web3Account ? connectWalletName : 'WalletConnect'}
      </p>

      <div className={s.accountInfo}>
        <div className={s.accountInfo__logo}>
          <img src={!web3Account ? wallet?.adapter.icon : walletConnectLogo} alt="Wallet Logo" />
        </div>

        <p className={s.accountInfo__title}>{!web3Account ? connectWalletName : 'WalletConnect'}</p>

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
        onClick={!web3Account ? disconnectWallet : () => deactivate()}
        text="Disconnect wallet"
        color="primary-gradient"
        widthFill
      />
    </div>
  );
};

export default WalletAccountModal;
