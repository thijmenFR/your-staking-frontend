import BN from 'bn.js';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Pubkeys } from '../contracts/config';
import { Constants, YourStakingInstructions } from '../constants';
import {
  findAssociatedTokenAddress,
  getPoolSignerPDA,
  getUserStorageAccount,
  getUserStorageAccountWithNonce,
} from '@utils/solanaHalpers';

async function getPoolSignerPdaNonce(): Promise<Number> {
  return (
    await PublicKey.findProgramAddress(
      [Pubkeys.yourPoolStoragePubkey.toBuffer()],
      Pubkeys.yourStakingProgramId,
    )
  )[1];
}

export const useYourTransaction = () => {
  const { connection } = useConnection();

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

  async function unstakeYourTransaction(
    userWallet: PublicKey,
    amountToWithdraw: number,
  ): Promise<Transaction> {
    const userStoragePubkey = await getUserStorageAccount(userWallet);

    const stakingATAPubkey = await findAssociatedTokenAddress(
      userWallet,
      Pubkeys.stakingMintPubkey,
    );

    const amountToWithdrawRaw = new BN(amountToWithdraw).mul(new BN(Constants.toYourRaw));

    const poolSignerPda = await getPoolSignerPDA();

    const unstakeYourIx = new TransactionInstruction({
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
          pubkey: stakingATAPubkey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: poolSignerPda,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      data: Buffer.from([
        YourStakingInstructions.UnstakeYour,
        ...amountToWithdrawRaw.toArray('le', 8),
      ]),
    });
    const unstakeYourTx = new Transaction().add(unstakeYourIx);
    unstakeYourTx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    unstakeYourTx.feePayer = userWallet;

    return unstakeYourTx;
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

  async function claimRewardsTransaction(userWallet: PublicKey): Promise<Transaction> {
    const userStoragePubkey = await getUserStorageAccount(userWallet);

    const rewardsATAPubkey = await findAssociatedTokenAddress(
      userWallet,
      Pubkeys.rewardsMintPubkey,
    );

    const rewardsAtaInfo = await connection.getAccountInfo(rewardsATAPubkey);

    const doesRewardsAtaExist = rewardsAtaInfo?.owner !== undefined;

    const claimRewardsIxs: TransactionInstruction[] = [];
    if (!doesRewardsAtaExist) {
      const createFantAssociatedAccountIx = Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        Pubkeys.rewardsMintPubkey,
        rewardsATAPubkey,
        userWallet,
        userWallet,
      );
      claimRewardsIxs.push(createFantAssociatedAccountIx);
    }

    const poolSignerPda = await getPoolSignerPDA();

    const claimRewardsIx = new TransactionInstruction({
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
          pubkey: Pubkeys.yourRewardsVaultPubkey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: rewardsATAPubkey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: poolSignerPda,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      data: Buffer.from([YourStakingInstructions.ClaimRewards]),
    });
    claimRewardsIxs.push(claimRewardsIx);
    const claimRewardsTx = new Transaction().add(...claimRewardsIxs);
    claimRewardsTx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    claimRewardsTx.feePayer = userWallet;

    return claimRewardsTx;
  }

  async function finalUnstakeYourTransaction(userWallet: PublicKey): Promise<Transaction> {
    const userStoragePubkey = await getUserStorageAccount(userWallet);

    const stakingATAPubkey = await findAssociatedTokenAddress(
      userWallet,
      Pubkeys.stakingMintPubkey,
    );

    const poolSignerPda = await getPoolSignerPDA();

    const unstakeYourIx = new TransactionInstruction({
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
          pubkey: stakingATAPubkey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: poolSignerPda,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      data: Buffer.from([YourStakingInstructions.FinalUnstake]),
    });
    const finalUnstakeYourTx = new Transaction().add(unstakeYourIx);
    finalUnstakeYourTx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    finalUnstakeYourTx.feePayer = userWallet;

    return finalUnstakeYourTx;
  }

  return {
    stakeYourTransaction,
    createUserTransaction,
    unstakeYourTransaction,
    claimRewardsTransaction,
    finalUnstakeYourTransaction,
  };
};
