import BigNumber from 'bignumber.js';
import { Pubkeys, solanaConfig } from '../contracts/config';
import { RpcResponse } from '../types/index';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { YourPoolData } from '../models/your-pool-info';
import { UserData } from '../models/user-info';
import { ChangeEvent } from 'react';
import { isDev } from '../constants';
import { getUserStorageAccount } from '@utils/solanaHalpers';

export const useDev = (cb: any) => (isDev ? cb() : undefined);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatAddress = (address: string) => {
  return address.length >= 10 ? `${address.slice(0, 7)}...${address.slice(-4)}` : address;
};
export const bnDivdedByDecimals = (bn: BigNumber, decimals = solanaConfig.decimals) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals));
};

export const bnMultipledByDecimals = (bn: BigNumber, decimals = solanaConfig.decimals) => {
  return bn.multipliedBy(new BigNumber(10).pow(decimals));
};

export const formatNumber = (value: string | BigNumber | number, digits = 3) => {
  if (BigNumber.isBigNumber(value)) value.toString();
  if (isNaN(+value) || value === null) return '0';

  const string = value.toString();
  const [number, float] = string.split('.');
  if (float) {
    return [number, float.substring(0, digits)].join('.');
  }
  return value.toString();
};

export const isNumber = (val: string | number) => {
  return !(isNaN(+val) || !isFinite(+val));
};

export const getInputValue = (e: ChangeEvent<HTMLInputElement>) => e.target.value;

export const getSplTokenTokenBalanceUi = (token: RpcResponse) =>
  token?.value[0]?.account?.data.parsed.info.tokenAmount.uiAmount || 0;

export async function getUserPendingRewards(userWallet: PublicKey, connection: Connection) {
  const U64_MAX = new BN('18446744073709551615', 10);
  let yourPoolData = await YourPoolData.fromAccount(Pubkeys.yourPoolStoragePubkey, connection);
  console.log(yourPoolData, 'data');
  if (yourPoolData == null) {
    throw new Error('Pool Does Not Exist');
  }
  let userDataStorageAddress = await getUserStorageAccount(userWallet);
  let userData = await UserData.fromAccount(userDataStorageAddress, connection);
  console.log(userData, 'userData');

  if (userData == null) {
    return 0;
  }
  console.log(userData.balanceYourStaked.toString(), 'balanceYourStaked');
  return userData.unstakePending.toNumber();
}

export const userIsExist = async (userWallet: PublicKey, connection: Connection) => {
  let userDataStorageAddress = await getUserStorageAccount(userWallet);
  let userData = await UserData.fromAccount(userDataStorageAddress, connection);
  return !!userData;
};

export const userLogged = true;
