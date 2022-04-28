import { PublicKey } from '@solana/web3.js';

const claster = 'devnet';

export const solanaConfig = {
  soloScan: (address: string | undefined) =>
    address ? `https://explorer.solana.com/address/${address}?cluster=${claster}` : '',
  decimals: '9',
  inputDecimalsCount: 3,
};

export class Pubkeys {
  static yourStakingProgramId = new PublicKey('6eHiLXTe4Mr7aQRsXjE5jps9kJoGupuSSUxQK9AREbdG');

  static splAssociatedTokenAccountProgramId = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );

  static yourTokenMintPubkey = new PublicKey('8u8nBpKMLqihpEosD74cvxmPdahtnBrUC5CUJyqbe1dn');

  static stakingMintPubkey = new PublicKey('8u8nBpKMLqihpEosD74cvxmPdahtnBrUC5CUJyqbe1dn');

  static rewardsMintPubkey = new PublicKey('8u8nBpKMLqihpEosD74cvxmPdahtnBrUC5CUJyqbe1dn');

  static yourPoolStoragePubkey = new PublicKey('8ysHiRyVEVFxijMdeDgj1MiGb5R7chjhbv2fxbsv12wq');

  static yourStakingVaultPubkey = new PublicKey('H83nZ7iBsRMt6KfQbY1sRVqvpu63PzzCx1x2yRhyBdfm');

  static yourRewardsVaultPubkey = new PublicKey('5335hdHMNsCQrQ38HPCFibwqDu8NU2Nvi2gE1a4GJD2f');
}
