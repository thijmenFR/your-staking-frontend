import BN from 'bn.js';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import adminSKey from '../pb/admin-pubkey.json';
import yourPoolStorageAccountSKey from '../pb/yourPoolStorageAccount.json';
import yourStakingVaultSKey from '../pb/yourStakingVault.json';
import yourRewardsVaultSKey from '../pb/yourRewardsVault.json';

export class Constants {
  static yourDecimals = 9;

  static toYourRaw = Math.pow(10, Constants.yourDecimals);

  static maxYourSupply = new BN(1000_000_000).mul(new BN(Constants.toYourRaw));

  static rewardTokenDecimals = 9;

  static toRewardTokenRaw = Math.pow(10, Constants.rewardTokenDecimals);
}

export const rewardDurationInDays: number = 1 / 86400;

export class Pubkeys {
  static yourStakingProgramId = new PublicKey('5tQMZqWovxJMS5m656VvKUWncFEc5SEeD5xRoHyXN3nE');

  static splAssociatedTokenAccountProgramId = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );

  static yourTokenMintPubkey = new PublicKey('6m2oZofB6AsEy8VQerGUMd9s3jHphGnMhcVhm3dnVqyd');

  static stakingMintPubkey = new PublicKey('6m2oZofB6AsEy8VQerGUMd9s3jHphGnMhcVhm3dnVqyd');

  static rewardsMintPubkey = new PublicKey('6m2oZofB6AsEy8VQerGUMd9s3jHphGnMhcVhm3dnVqyd');

  static yourPoolStoragePubkey = new PublicKey('6m2oZofB6AsEy8VQerGUMd9s3jHphGnMhcVhm3dnVqyd');

  static yourStakingVaultPubkey = new PublicKey('6m2oZofB6AsEy8VQerGUMd9s3jHphGnMhcVhm3dnVqyd');

  static yourRewardsVaultPubkey = new PublicKey('6m2oZofB6AsEy8VQerGUMd9s3jHphGnMhcVhm3dnVqyd');
}

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

const getKeypair = (secretKey: number[]) => Keypair.fromSecretKey(Uint8Array.from(secretKey));

export function getAdminAccount(): Keypair {
  return getKeypair(adminSKey);
}

export const adminAccount = getAdminAccount();
export const yourPoolStorageAccount = getKeypair(yourPoolStorageAccountSKey);
export const yourStakingVault = getKeypair(yourStakingVaultSKey);
export const yourRewardsVault = getKeypair(yourRewardsVaultSKey);

async function getPoolSignerPdaNonce(): Promise<Number> {
  return (
    await PublicKey.findProgramAddress(
      [Pubkeys.yourPoolStoragePubkey.toBuffer()],
      Pubkeys.yourStakingProgramId,
    )
  )[1];
}

export const useYourSolana = () => {
  const { publicKey: account, signTransaction, sendTransaction } = useWallet();
  const { connection } = useConnection();

  async function findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey,
  ): Promise<PublicKey> {
    return (
      await PublicKey.findProgramAddress(
        [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
        Pubkeys.splAssociatedTokenAccountProgramId,
      )
    )[0];
  }

  async function getUserStorageAccount(userWallet: PublicKey): Promise<PublicKey> {
    return (
      await PublicKey.findProgramAddress(
        [userWallet.toBuffer(), Pubkeys.yourPoolStoragePubkey.toBuffer()],
        Pubkeys.yourStakingProgramId,
      )
    )[0];
  }

  async function getUserStorageAccountWithNonce(
    userWallet: PublicKey,
  ): Promise<[PublicKey, Number]> {
    return PublicKey.findProgramAddress(
      [userWallet.toBuffer(), Pubkeys.yourPoolStoragePubkey.toBuffer()],
      Pubkeys.yourStakingProgramId,
    );
  }

  async function stakeYourTransaction(
    userWallet: PublicKey,
    amountToDeposit: number,
  ): Promise<Transaction> {
    const userStoragePubkey = await getUserStorageAccount(userWallet);
    const stakingAssociatedAccPubkey = await findAssociatedTokenAddress(
      userWallet,
      Pubkeys.stakingMintPubkey,
    );
    const amountToDepositRaw = new BN(amountToDeposit).mul(new BN(Constants.toYourRaw));

    const stakeYourIx = new TransactionInstruction({
      programId: Pubkeys.yourStakingProgramId,
      keys: [
        {
          pubkey: userWallet,
          isSigner: true,
          isWritable: false,
        },

        {
          pubkey: userStoragePubkey,
          isSigner: false,
          isWritable: true,
        },

        {
          pubkey: Pubkeys.yourPoolStoragePubkey,
          isSigner: false,
          isWritable: true,
        },

        {
          pubkey: Pubkeys.yourStakingVaultPubkey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: stakingAssociatedAccPubkey,
          isSigner: false,
          isWritable: true,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      data: Buffer.from([
        YourStakingInstructions.StakeYour,
        ...amountToDepositRaw.toArray('le', 8),
      ]),
    });
    const stakeYourTx = new Transaction().add(stakeYourIx);
    stakeYourTx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    stakeYourTx.feePayer = userWallet;

    return stakeYourTx;
  }

  async function createUserTransaction(userWallet: PublicKey): Promise<Transaction> {
    const [userStoragePubkey, nonce] = await getUserStorageAccountWithNonce(userWallet);
    const createUserIx = new TransactionInstruction({
      programId: Pubkeys.yourStakingProgramId,
      keys: [
        {
          pubkey: userWallet,
          isSigner: true,
          isWritable: false,
        },

        {
          pubkey: userStoragePubkey,
          isSigner: false,
          isWritable: true,
        },

        {
          pubkey: Pubkeys.yourPoolStoragePubkey,
          isSigner: false,
          isWritable: true,
        },

        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: Buffer.from([
        YourStakingInstructions.CreateUser,
        ...new BN(nonce.valueOf()).toArray('le', 1),
      ]),
    });
    const createUserTx = new Transaction().add(createUserIx);
    createUserTx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    createUserTx.feePayer = userWallet;
    console.log(createUserTx);
    return createUserTx;
  }

  async function createInitializePoolTransaction(
    poolOwnerWallet: PublicKey,
    yourPoolStorageAccountL: Keypair,
    yourStakingVaultL: Keypair,
    yourRewardsVaultL: Keypair,
    rewardDurationInDaysL: number,
    fundPoolAmount: number,
  ): Promise<Transaction> {
    const poolStorageBytes = 142;
    const rewardDuration = rewardDurationInDaysL * 86400;
    console.log('poolOwnerWallet Pubkey: ', poolOwnerWallet.toJSON());
    console.log('Pool Storage Pubkey: ', yourPoolStorageAccountL.publicKey.toString());
    console.log('Staking Vault Pubkey: ', yourStakingVaultL.publicKey.toString());
    console.log('Rewards Vault Pubkey: ', yourRewardsVaultL.publicKey.toString());
    const newAccountKeypair = Keypair.generate();
    const createStakingVaultIx = SystemProgram.createAccount({
      space: AccountLayout.span,
      lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span, 'confirmed'),
      fromPubkey: poolOwnerWallet,
      newAccountPubkey: yourStakingVault.publicKey,
      programId: TOKEN_PROGRAM_ID,
    });

    const initStakingVaultIx = Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      Pubkeys.stakingMintPubkey,
      yourStakingVault.publicKey,
      poolOwnerWallet,
    );
    const createRewardsVaultIx = SystemProgram.createAccount({
      space: AccountLayout.span,
      lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span, 'confirmed'),
      fromPubkey: poolOwnerWallet,
      newAccountPubkey: yourRewardsVault.publicKey,
      programId: TOKEN_PROGRAM_ID,
    });

    const initRewardsVaultIx = Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      Pubkeys.rewardsMintPubkey,
      yourRewardsVault.publicKey,
      poolOwnerWallet,
    );
    const pool_nonce = await getPoolSignerPdaNonce();
    const rentPrice = await connection.getMinimumBalanceForRentExemption(
      poolStorageBytes,
      'confirmed',
    );
    const createPoolStorageAccountIx = SystemProgram.createAccount({
      space: poolStorageBytes,
      lamports: rentPrice,
      fromPubkey: poolOwnerWallet,
      newAccountPubkey: yourPoolStorageAccount.publicKey,
      programId: Pubkeys.yourStakingProgramId,
    });

    const balance = await connection.getBalance(poolOwnerWallet);
    if (balance < rentPrice)
      throw new Error(`Need at least ${rentPrice / LAMPORTS_PER_SOL} SOL for contest account rent`);

    const funderWallet = poolOwnerWallet; // admin account
    const rewardsATAPubkey = await findAssociatedTokenAddress(
      funderWallet,
      Pubkeys.rewardsMintPubkey,
    );

    const initPoolStorageAccountIx = new TransactionInstruction({
      programId: Pubkeys.yourStakingProgramId,
      keys: [
        {
          pubkey: poolOwnerWallet,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: yourPoolStorageAccount.publicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: Pubkeys.stakingMintPubkey,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: yourStakingVault.publicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: Pubkeys.rewardsMintPubkey,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: yourRewardsVault.publicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: funderWallet,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: rewardsATAPubkey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: Buffer.from([
        YourStakingInstructions.InitializeYourPool,
        ...new BN(rewardDuration).toArray('le', 8),
        ...new BN(pool_nonce.valueOf()).toArray('le', 1),
        ...new BN(fundPoolAmount).toArray('le', 8),
      ]),
    });

    const transaction = new Transaction().add(
      createStakingVaultIx,
      initStakingVaultIx,
      createRewardsVaultIx,
      initRewardsVaultIx,
      createPoolStorageAccountIx,
      initPoolStorageAccountIx,
    );

    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    transaction.feePayer = poolOwnerWallet;

    transaction.partialSign(yourStakingVault, yourRewardsVault, yourPoolStorageAccount);

    return transaction;
  }

  return {
    findAssociatedTokenAddress,
    getUserStorageAccount,
    getUserStorageAccountWithNonce,
    stakeYourTransaction,
    createUserTransaction,
    createInitializePoolTransaction,
  };
};
