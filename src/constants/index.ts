import BN from 'bn.js';

export const isDev = true;

export const EPOCH_DURATION = 216000;

export enum YourStakingInstructions {
  InitializeYourPool = 0,
  CreateUser = 1,
  StakeYour = 2,
  UnstakeYour = 3,
  ClaimRewards = 4,
  ClosePool = 5,
  CloseUser = 6,
  FinalUnstake = 7,
  UpdateRates = 8,
}

export class Constants {
  static yourDecimals = 9;

  static toYourRaw = Math.pow(10, Constants.yourDecimals);

  static maxYourSupply = new BN(1_000_000_000).mul(new BN(Constants.toYourRaw));

  static rewardTokenDecimals = 9;

  static toRewardTokenRaw = Math.pow(10, Constants.rewardTokenDecimals);
}
