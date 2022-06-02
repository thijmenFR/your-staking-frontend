import { PublicKey } from '@solana/web3.js';

const claster = 'devnet';

export const solanaConfig = {
  soloScan: (address: string | undefined) =>
    address ? `https://explorer.solana.com/address/${address}?cluster=${claster}` : '',
  decimals: '9',
  inputDecimalsCount: 3,
};

export class Pubkeys {
  static yourStakingProgramId = new PublicKey('7S6UrxVdWvq3LB8VJ8xyuXDH8JnXmiJFrqAJcaBSC9yw');

  static splAssociatedTokenAccountProgramId = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );

  static yourTokenMintPubkey = new PublicKey('8qmUZbSVbraiZb4MLNjLLyN1KvP1RLj77F9wW34hvDqb');

  static stakingMintPubkey = new PublicKey('8qmUZbSVbraiZb4MLNjLLyN1KvP1RLj77F9wW34hvDqb');

  static rewardsMintPubkey = new PublicKey('8qmUZbSVbraiZb4MLNjLLyN1KvP1RLj77F9wW34hvDqb');

  static yourPoolStoragePubkey = new PublicKey('HmWTE9h4SMgdKNRWpvx8zdR4W5cwQKvHv1ZuGBnQDJE2');

  static yourStakingVaultPubkey = new PublicKey('Gp2VUsBSfg2nVJokpnieMnQLMbiVsLidCpzMyvnvEuPh');

  static yourRewardsVaultPubkey = new PublicKey('9Q15Ky2f5fUPHvSFFAGxAsqwmJV8fiq1ua9eLSPrjswH');
}
