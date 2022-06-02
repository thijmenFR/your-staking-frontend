import { AccountInfo, ParsedAccountData, PublicKey, RpcResponseAndContext } from '@solana/web3.js';

export type RpcResponse = RpcResponseAndContext<
  Array<{
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData>;
  }>
>;

export interface IYourTab {
  userExist: boolean;
}

export enum ModalType {
  'success',
  'error',
}

export interface IConfirmationProps {
  tokensCount?: number;
  type: ModalType;
  newBalance?: number;
  txHash?: string;
  message?: 'staked' | 'unstaked';
}

export interface SuccessProps extends Omit<IConfirmationProps, 'isOpen' | 'type'> {}

export interface ErrorProps extends Pick<IConfirmationProps, 'txHash'> {}

export interface IModalSuccessProps extends Pick<IConfirmationProps, 'txHash' | 'message'> {
  stakeInputValue: string;
  userBalance: string;
}
