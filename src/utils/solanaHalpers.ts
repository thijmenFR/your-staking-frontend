import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Pubkeys } from '../contracts/config';

export async function findAssociatedTokenAddress(
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

export async function getUserStorageAccount(userWallet: PublicKey): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [userWallet.toBuffer(), Pubkeys.yourPoolStoragePubkey.toBuffer()],
      Pubkeys.yourStakingProgramId,
    )
  )[0];
}

export async function getPoolSignerPDA(): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [Pubkeys.yourPoolStoragePubkey.toBuffer()],
      Pubkeys.yourStakingProgramId,
    )
  )[0];
}

export async function getUserStorageAccountWithNonce(userWallet: PublicKey): Promise<[PublicKey, Number]> {
  return PublicKey.findProgramAddress(
    [userWallet.toBuffer(), Pubkeys.yourPoolStoragePubkey.toBuffer()],
    Pubkeys.yourStakingProgramId,
  );
}
