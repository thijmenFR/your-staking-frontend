import BigNumber from 'bignumber.js';
import { Pubkeys, solanaConfig } from '../contracts/config';
import { RpcResponse } from '../types/index';
import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { YourPoolData } from '../models/your-pool-info';
import { UserData } from '../models/user-info';
import { ChangeEvent } from 'react';
import { Constants, EPOCH_DURATION, isDev } from '../constants';
import { getUserStorageAccount } from '@utils/solanaHalpers';

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

export const epochRemaining = (stake_amount: number, yourPoolData: YourPoolData) => {
  const maxRewardRate = new BigNumber(yourPoolData.maxRewardRate.toString());
  const minRewardRate = new BigNumber(yourPoolData.minRewardRate.toString());
  const rewardPerSlot = new BigNumber(yourPoolData.rewardPerSlot.toString());
  const epochDurationInSlots = new BigNumber(yourPoolData.epochDurationInSlots.toString());
  const userTotalStake = new BigNumber(yourPoolData.userTotalStake.toString());
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

export const apy = (yourPoolData: YourPoolData) => {
  try {
    return BN.min(
      yourPoolData.maxRewardRate,
      BN.max(
        yourPoolData.minRewardRate,
        yourPoolData.rewardPerSlot
          .mul(yourPoolData.epochDurationInSlots)
          .div(yourPoolData.userTotalStake),
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
  const SLOT_DURATION = EPOCH_DURATION / epoch_duration;
  const epoch_remainnig_time =
    SLOT_DURATION * (epoch_duration - ((+currentSlot - deploy_slot) % epoch_duration));
  return epoch_remainnig_time * 1000;
};

export const calculateRewards = (
  currentSlot: string,
  yourPoolDataRaw: YourPoolData,
  userData: UserData,
) => {
  try {
    const yourPoolData = bnToBigNumber(yourPoolDataRaw);
    const maxRewardRate = bnDivdedByDecimals(yourPoolData.maxRewardRate);
    const minRewardRate = bnDivdedByDecimals(yourPoolData.minRewardRate);
    const rewardPerSlot = bnDivdedByDecimals(yourPoolData.rewardPerSlot);
    const epochDurationInSlots = yourPoolData.epochDurationInSlots;
    const userTotalWeightedStake = new BigNumber(yourPoolData.userTotalWeightedStake.toString());
    const poolInitSlot = new BigNumber(yourPoolData.poolInitSlot.toString());
    const userTotalStake = new BigNumber(yourPoolData.userTotalStake.toString());

    const balanceYourStaked = new BigNumber(userData.balanceYourStaked.toString());
    const userWeightedStake = new BigNumber(userData.userWeightedStake.toString());
    const userWeightedEpoch = new BigNumber(userData.userWeightedEpoch.toString());

    const rewards = userWeightedStake.multipliedBy(
      BigNumber.min(
        maxRewardRate,
        BigNumber.max(
          minRewardRate,
          rewardPerSlot.multipliedBy(epochDurationInSlots).div(userTotalWeightedStake),
        ),
      ),
    );

    const unclaimedEpochs = new BigNumber(currentSlot)
      .minus(userWeightedEpoch)
      .div(epochDurationInSlots);
    const currentEpoch = new BigNumber(currentSlot).minus(poolInitSlot).div(epochDurationInSlots);

    if (!userWeightedEpoch.isEqualTo(currentEpoch)) {
      rewards.plus(
        unclaimedEpochs.multipliedBy(
          balanceYourStaked.multipliedBy(
            BigNumber.min(
              maxRewardRate,
              BigNumber.max(
                minRewardRate,
                rewardPerSlot.multipliedBy(epochDurationInSlots).div(userTotalStake),
              ),
            ),
          ),
        ),
      );
    }
    return rewards;
  } catch (e) {
    useDev(() => console.error(e, 'calculateRewards'));
    return new BigNumber(0);
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
