import { Buffer } from 'buffer';
import { Connection, PublicKey } from '@solana/web3.js';
import { deserializeUnchecked } from 'borsh';
import BN from 'bn.js';
import { StringPublicKey } from '../data/ids';
import { extendBorsh } from '@utils/borch';

export class YourPoolData {
  accountType: number;

  pdaNonce: number;

  ownerWallet: StringPublicKey;

  stakingVault: StringPublicKey;

  userStakeCount: BN;

  userTotalStake: BN;

  epochDurationInSlots: BN;

  rewardPerSlot: BN;

  maxRewardRate: BN;

  minRewardRate: BN;

  poolInitSlot: BN;

  userTotalWeightedStake: BN;

  maxUnlockDurationInSlots: BN;

  minUnlockDurationInSlots: BN;

  constructor(args: {
    accountType: number;
    pdaNonce: number;

    ownerWallet: StringPublicKey;
    stakingVault: StringPublicKey;
    userTotalWeightedStake: BN;
    
    poolInitSlot: BN;
    userStakeCount: BN;
    userTotalStake: BN;

    epochDurationInSlots: BN;
    rewardPerSlot: BN;
    maxRewardRate: BN;
    minRewardRate: BN;
    maxUnlockDurationInSlots: BN;
    minUnlockDurationInSlots: BN;
  }) {
    this.accountType = args.accountType;
    this.pdaNonce = args.pdaNonce;

    this.ownerWallet = args.ownerWallet;
    this.stakingVault = args.stakingVault;

    this.userStakeCount = args.userStakeCount;
    this.userTotalStake = args.userTotalStake;
    this.userTotalWeightedStake = args.userTotalWeightedStake;

    this.poolInitSlot = args.poolInitSlot;
    this.epochDurationInSlots = args.epochDurationInSlots;
    this.rewardPerSlot = args.rewardPerSlot;
    this.maxRewardRate = args.maxRewardRate;
    this.minRewardRate = args.minRewardRate;
    this.maxUnlockDurationInSlots = args.maxUnlockDurationInSlots;
    this.minUnlockDurationInSlots = args.minUnlockDurationInSlots;
  }

  getAuthorityPubkey(): PublicKey {
    return new PublicKey(this.ownerWallet);
  }

  getStakingVaultPubkey(): PublicKey {
    return new PublicKey(this.stakingVault);
  }

  getUserStakeCount(): number {
    return this.userStakeCount.toNumber();
  }

  getPdaNonce(): number {
    return this.pdaNonce;
  }

  static async fromAccount(
    account: PublicKey,
    connection: Connection,
  ): Promise<YourPoolData | null> {
    // const connection = ConnectionService.getConnection();
    const accountData = await connection.getAccountInfo(account, 'processed');
    if (!accountData) return null;
    return YourPoolData.fromBuffer(accountData?.data);
  }

  static fromBuffer(buffer: Buffer): YourPoolData {
    extendBorsh();
    return deserializeUnchecked(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      YOUR_POOL_DATA_ON_CHAIN_SCHEMA,
      YourPoolData,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      buffer.slice(0, YOUR_POOL_STORAGE_TOTAL_BYTES),
    );
  }
}

export const YOUR_POOL_STORAGE_TOTAL_BYTES =
  1 + 1 + 32 + 32 + 4 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8 + 8; // 142

export const YOUR_POOL_DATA_ON_CHAIN_SCHEMA = new Map<any, any>([
  [
    YourPoolData,
    {
      kind: 'struct',
      fields: [
        ['accountType', 'u8'],
        ['pdaNonce', 'u8'],

        ['ownerWallet', 'pubkeyAsString'],
        ['stakingVault', 'pubkeyAsString'],

        ['userStakeCount', 'u32'],
        ['userTotalStake', 'u64'],
        ['userTotalWeightedStake', 'u64'],

        ['poolInitSlot', 'u64'],
        ['epochDurationInSlots', 'u64'],
        ['rewardPerSlot', 'u64'],
        ['maxRewardRate', 'u64'],
        ['minRewardRate', 'u64'],

        ['maxUnlockDurationInSlots', 'u64'],
        ['minUnlockDurationInSlots', 'u64'],
      ],
    },
  ],
]);
