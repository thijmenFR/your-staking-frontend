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
import { Pubkeys } from '../contracts/config';
import { Constants } from '../constants';

export const rewardDurationInDays: number = 1 / 86400;

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
    return createUserTx;
  }

  return {
    findAssociatedTokenAddress,
    getUserStorageAccount,
    getUserStorageAccountWithNonce,
    stakeYourTransaction,
    createUserTransaction,
  };
};
