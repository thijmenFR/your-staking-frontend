import BigNumber from 'bignumber.js';
import { solanaConfig } from '../contracts/config';
import { RpcResponse } from '../types/index';

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

export const getSplTokenTokenBalanceUi = (token: RpcResponse) =>
  token?.value[0]?.account?.data.parsed.info.tokenAmount.uiAmount || 0;

export const userLogged = true;
