import BigNumber from 'bignumber.js';
import { Pubkeys, solanaConfig } from '../contracts/config';
import { RpcResponse } from '../types';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { YourPoolData } from '../models/your-pool-info';
import { UserData } from '../models/user-info';
import { ChangeEvent } from 'react';
import { Constants, isDev, SLOT_DURATION } from '../constants';
import { getUserStorageAccount } from '@utils/solanaHalpers';
import { notification } from 'antd';

export const useDev = (cb: any) => (isDev ? cb() : undefined);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const bnToBigNumber = (data: any) => {
  const newObj = { ...data };
  for (const prop in newObj) {
    if (BN.isBN(newObj[prop])) {
      newObj[prop] = new BigNumber(newObj[prop].toString());
    }
  }
  return newObj;
};

export const formatAddress = (address: string) => {
  return address.length >= 10 ? `${address.slice(0, 7)}...${address.slice(-4)}` : address;
};
export const bnDivdedByDecimals = (bn: BigNumber, decimals = solanaConfig.decimals) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals));
};

export const bnDivdedByDecimalsRaw = (bn: BN) => {
  return bn.div(new BN(Constants.toYourRaw));
};
export const bnDivdedByDecimalsRawBigNumber = (bn: string) => {
  return new BigNumber(bn).div(new BigNumber(Constants.toYourRaw));
};

export const formatNumber = (value: string | BigNumber | number, digits = 3) => {
  if (BigNumber.isBigNumber(value)) value.toString();
  if (isNaN(+value) || value === null) return '0';

  const string = value.toString();
  const [number, float] = string.split('.');
  if (digits === 0) return number;
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

export const getYourTokenBalance = async (address: PublicKey, connection: Connection) => {
  const tokenBalance = await connection.getParsedTokenAccountsByOwner(address, {
    mint: Pubkeys.rewardsMintPubkey,
  });
  return getSplTokenTokenBalanceUi(tokenBalance);
};

export async function getUserPendingRewards(userWallet: PublicKey, connection: Connection) {
  const U64_MAX = new BN('18446744073709551615', 10);
  let yourPoolData = await YourPoolData.fromAccount(Pubkeys.yourPoolStoragePubkey, connection);
  if (yourPoolData == null) {
    // throw new Error('Pool Does Not Exist');
    notification.error({
      message: 'Error',
      className: 'notificationError',
      description: 'Pool Does Not Exist',
    });
  }
  let userDataStorageAddress = await getUserStorageAccount(userWallet);
  let userData = await UserData.fromAccount(userDataStorageAddress, connection);

  if (userData == null) {
    return 0;
  }
  return userData.unstakePendingAmount.toNumber();
}

export const getUserTotalStake = async (connection: Connection) => {
  let yourPoolData = await YourPoolData.fromAccount(Pubkeys.yourPoolStoragePubkey, connection);
  if (yourPoolData == null) {
    throw new Error('Pool Does Not Exist');
  }
  return bnDivdedByDecimalsRaw(yourPoolData.userTotalStake).toString();
};

export const getStakedYourTokenBalance = async (userWallet: PublicKey, connection: Connection) => {
  let userDataStorageAddress = await getUserStorageAccount(userWallet);
  let userData = await UserData.fromAccount(userDataStorageAddress, connection);

  if (userData == null) {
    return '0';
  }
  return bnDivdedByDecimals(new BigNumber(userData.balanceYourStaked.toString())).toString();
};

export const getUserData = async (userWallet: PublicKey, connection: Connection) => {
  let userDataStorageAddress = await getUserStorageAccount(userWallet);
  return UserData.fromAccount(userDataStorageAddress, connection);
};

export const userIsExist = async (userWallet: PublicKey, connection: Connection) => {
  let userDataStorageAddress = await getUserStorageAccount(userWallet);
  let userData = await UserData.fromAccount(userDataStorageAddress, connection);
  return !!userData;
};

export const userLogged = true;

export const epochRemaining = (stake_amount: number, yourPoolDataRaw: YourPoolData) => {
  const {
    maxRewardRate,
    minRewardRate,
    rewardPerSlot,
    epochDurationInSlots,
    userTotalStake,
  } = bnToBigNumber(yourPoolDataRaw);

  try {
    return new BigNumber(stake_amount).multipliedBy(
      BigNumber.min(
        maxRewardRate,
        BigNumber.max(
          minRewardRate,
          rewardPerSlot.multipliedBy(epochDurationInSlots.div(userTotalStake)),
        ),
      ),
    );
  } catch (e) {
    return new BN(1).toString();
  }
};

export const apy = (yourPoolDataRaw: YourPoolData) => {
  const {
    maxRewardRate,
    minRewardRate,
    rewardPerSlot,
    epochDurationInSlots,
    userTotalStake,
  } = bnToBigNumber(yourPoolDataRaw);
  try {
    return BigNumber.min(
      bnDivdedByDecimals(maxRewardRate),
      BigNumber.max(
        bnDivdedByDecimals(minRewardRate),
        bnDivdedByDecimals(rewardPerSlot).multipliedBy(epochDurationInSlots).div(userTotalStake),
      ),
    );
  } catch (e) {
    return new BN(1).toString();
  }
};
export const epochNumber = (slot: string, yourPoolData: YourPoolData) => {
  try {
    return new BN(slot)
      .sub(yourPoolData.poolInitSlot)
      .div(yourPoolData.epochDurationInSlots)
      .toString();
  } catch (e) {
    return new BN(1).toString();
  }
};

export const epochDurationInSlotsPercent = (currentSlot: string, yourPoolData: YourPoolData) => {
  const epoch_duration = yourPoolData.epochDurationInSlots.toNumber();
  const epoch_remaining = (+currentSlot - yourPoolData.poolInitSlot.toNumber()) % epoch_duration;
  const epoch_remaining_percent = (1 - epoch_remaining / epoch_duration) * 100;
  return String(epoch_remaining_percent);
};

export const epochETA = (currentSlot: string, yourPoolData: YourPoolData) => {
  const epoch_duration = yourPoolData.epochDurationInSlots.toNumber();
  const deploy_slot = yourPoolData.poolInitSlot.toNumber();
  return SLOT_DURATION * (epoch_duration - ((+currentSlot - deploy_slot) % epoch_duration));
};

export const calculateRewards = (
  currentSlot: string,
  yourPoolDataRaw: YourPoolData,
  userData: UserData,
) => {
  try {
    const {
      maxRewardRate,
      minRewardRate,
      rewardPerSlot,
      epochDurationInSlots,
      userTotalWeightedStake,
      poolInitSlot,
      userTotalStake,
    } = bnToBigNumber(yourPoolDataRaw);

    const { balanceYourStaked, userWeightedStake, userWeightedEpoch } = bnToBigNumber(userData);

    let rewards = new BigNumber(0);
    bnDivdedByDecimals(userWeightedStake).multipliedBy(
      BigNumber.min(
        bnDivdedByDecimals(maxRewardRate),
        BigNumber.max(
          bnDivdedByDecimals(minRewardRate),
          bnDivdedByDecimals(rewardPerSlot)
            .multipliedBy(epochDurationInSlots)
            .div(userTotalWeightedStake),
        ),
      ),
    );

    const currentEpoch = new BigNumber(currentSlot).minus(poolInitSlot).div(epochDurationInSlots);
    const unclaimedEpochs = currentEpoch.minus(userWeightedEpoch);

    if (!unclaimedEpochs.eq(0)) {
      rewards = unclaimedEpochs.multipliedBy(
        balanceYourStaked.multipliedBy(
          BigNumber.min(
            bnDivdedByDecimals(maxRewardRate),
            BigNumber.max(
              bnDivdedByDecimals(minRewardRate),
              rewardPerSlot.multipliedBy(epochDurationInSlots).div(userTotalStake),
            ),
          ),
        ),
      );

      console.log('rewards for full epochs', rewards.toNumber());
    }
    return rewards;
  } catch (e) {
    useDev(() => console.error(e, 'calculateRewards'));
    return new BigNumber(0);
  }
};
