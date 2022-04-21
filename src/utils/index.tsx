import BigNumber from 'bignumber.js';
import { Pubkeys, solanaConfig } from '../contracts/config';
import { RpcResponse } from '../types/index';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { YourPoolData } from '../models/your-pool-info';
import { UserData } from '../models/user-info';
import { ChangeEvent } from 'react';
import { Constants, DEPLOY_SLOT, EPOCH_DURATION, isDev, SLOTS_PER_EPOCH } from '../constants';
import { getUserStorageAccount } from '@utils/solanaHalpers';

export const useDev = (cb: any) => (isDev ? cb() : undefined);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatAddress = (address: string) => {
  return address.length >= 10 ? `${address.slice(0, 7)}...${address.slice(-4)}` : address;
};
export const bnDivdedByDecimals = (bn: BigNumber, decimals = solanaConfig.decimals) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals));
};

export const bnMultipledByDecimals = (bn: BN) => {
  return bn.div(new BN(Constants.toYourRaw));
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
    throw new Error('Pool Does Not Exist');
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
  return bnMultipledByDecimals(yourPoolData.userTotalStake).toString();
};

export const getStakedYourTokenBalance = async (userWallet: PublicKey, connection: Connection) => {
  let userDataStorageAddress = await getUserStorageAccount(userWallet);
  let userData = await UserData.fromAccount(userDataStorageAddress, connection);

  if (userData == null) {
    return '0';
  }
  return bnMultipledByDecimals(userData.balanceYourStaked).toString();
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

export const quota = (stake_amount: number, yourPoolData: YourPoolData) => {
  try {
    return new BN(stake_amount).mul(
      BN.min(
        yourPoolData.maxRewardRate,
        BN.max(
          yourPoolData.minRewardRate,
          yourPoolData.rewardPerSlot.mul(new BN(SLOTS_PER_EPOCH).div(yourPoolData.userTotalStake)),
        ),
      ),
    );
  } catch (e) {
    return new BN(1).toString();
  }
};

export const apy = (yourPoolData: YourPoolData) => {
  try {
    return BN.min(
      yourPoolData.maxRewardRate,
      BN.max(
        yourPoolData.minRewardRate,
        yourPoolData.rewardPerSlot.mul(new BN(SLOTS_PER_EPOCH)).div(yourPoolData.userTotalStake),
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
  const epoch_duration =
    yourPoolData.epochDurationInSlots.toNumber() === 1
      ? EPOCH_DURATION
      : yourPoolData.epochDurationInSlots.toNumber();
  const epoch_remaining = (+currentSlot - yourPoolData.poolInitSlot.toNumber()) % epoch_duration;
  const epoch_remaining_percent = (1 - epoch_remaining / epoch_duration) * 100;
  return String(epoch_remaining_percent);
};

export const epochETA = (currentSlot: string, yourPoolData: YourPoolData) => {
  const epoch_duration =
    yourPoolData.epochDurationInSlots.toNumber() === 1
      ? EPOCH_DURATION
      : yourPoolData.epochDurationInSlots.toNumber();
  const SLOT_DURATION = EPOCH_DURATION / SLOTS_PER_EPOCH;
  const epoch_remainnig_time =
    SLOT_DURATION * (epoch_duration - ((+currentSlot - DEPLOY_SLOT) % epoch_duration));
  return epoch_remainnig_time * 1000;
};

export const calculateRewards = (
  currentSlot: string,
  yourPoolData: YourPoolData,
  userData: UserData,
) => {
  try {
    const rewards = userData.userWeightedStake.mul(
      BN.min(
        yourPoolData.maxRewardRate,
        BN.max(
          yourPoolData.minRewardRate,
          yourPoolData.rewardPerSlot
            .mul(yourPoolData.epochDurationInSlots)
            .div(yourPoolData.userTotalWeightedStake),
        ),
      ),
    );
    const unclaimedEpochs = new BN(currentSlot)
      .sub(userData.userWeightedEpoch)
      .div(yourPoolData.epochDurationInSlots);
    const currentEpoch = new BN(currentSlot)
      .sub(yourPoolData.poolInitSlot)
      .div(yourPoolData.epochDurationInSlots);

    if (!userData.userWeightedEpoch.eq(currentEpoch)) {
      rewards.add(
        unclaimedEpochs.mul(
          userData.balanceYourStaked.mul(
            BN.min(
              yourPoolData.maxRewardRate,
              BN.max(
                yourPoolData.minRewardRate,
                yourPoolData.rewardPerSlot
                  .mul(yourPoolData.epochDurationInSlots)
                  .div(yourPoolData.userTotalStake),
              ),
            ),
          ),
        ),
      );
    }
    return rewards;
  } catch (e) {
    useDev(() => console.error(e, 'calculateRewards'));
    return new BN(0);
  }
};

// rewards = UserData.userWeightedStake * min(
//   YourPoolData.maxRewardRate,
//   max(
//     YourPoolData.minRewardRate,
//     YourPoolData.rewardPerSlot * YourPoolData.epochDurationInSlots / YourPoolData.userTotalWeightedStake
//   )
// );
//
// unclaimed_epochs = (${SOLANA_CURRENT_SLOT} - UserData.userWeightedEpoch) / YourPoolData.epochDurationInSlots;
// current_epoch = (${SOLANA_CURRENT_SLOT} - YourPoolData.poolInitSlot) / YourPoolData.epochDurationInSlots;
//
//
// if UserData.userWeightedEpoch != current_epoch {
//   rewards += unclaimed_epochs * UserData.balanceYourStaked
//     * min(
//       YourPoolData.maxRewardRate,
//       max(
//         YourPoolData.minRewardRate,
//         YourPoolData.rewardPerSlot * YourPoolData.epochDurationInSlots / YourPoolData.userTotalStake
//       )
//     );
// }
