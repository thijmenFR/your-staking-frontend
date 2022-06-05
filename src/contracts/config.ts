import { PublicKey } from '@solana/web3.js';

const claster = 'devnet';

export const solanaConfig = {
  soloScan: (address: string | undefined) =>
    address ? `https://explorer.solana.com/address/${address}?cluster=${claster}` : '',
  decimals: '9',
  inputDecimalsCount: 3,
};

export class Pubkeys {
  static yourStakingProgramId = new PublicKey('B3YKFzpW7ASiQC9oMAzPE2Pjm7SAf6ecCEYsygHjcxJ7');

  static splAssociatedTokenAccountProgramId = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );

  static yourTokenMintPubkey = new PublicKey('ByyxaLCt6cGdSAHwLY28BcGd1kVcNfJ9h4nZouBruKqd');

  static stakingMintPubkey = new PublicKey('ByyxaLCt6cGdSAHwLY28BcGd1kVcNfJ9h4nZouBruKqd');

  static rewardsMintPubkey = new PublicKey('ByyxaLCt6cGdSAHwLY28BcGd1kVcNfJ9h4nZouBruKqd');

  static yourPoolStoragePubkey = new PublicKey('7DHkXWSu12LbsW788AJBvBj4xbEQhFJePQRacxakAfLr');

  static yourStakingVaultPubkey = new PublicKey('HPvED8unsjXjsGwDPdQJPSzsfKvUcerVM7fE42NfoX7a');

  static yourRewardsVaultPubkey = new PublicKey('DxGKFwckzCNe811CRDbLnrjGBs4GyuCFwYQ33ySo4aFx');
}
