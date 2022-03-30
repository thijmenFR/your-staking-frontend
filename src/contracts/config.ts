import {PublicKey} from "@solana/web3.js";

const claster = 'devnet';

export const solanaConfig = {
  soloScan: (address: string | undefined) =>
    address ? `https://explorer.solana.com/address/${address}?cluster=${claster}` : '',
  decimals: '9',
};

export class Pubkeys {
  static yourStakingProgramId = new PublicKey('2pfotXQ2NtBRCJV5X6i8DTg353nCngDPhNy4Ue3Lo2j5');

  static splAssociatedTokenAccountProgramId = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );

  static yourTokenMintPubkey = new PublicKey('7CRRTNZWELbWB97omD5vSwF16shvimaviGatUzyFUwvq');

  static stakingMintPubkey = new PublicKey('7CRRTNZWELbWB97omD5vSwF16shvimaviGatUzyFUwvq');

  static rewardsMintPubkey = new PublicKey('7CRRTNZWELbWB97omD5vSwF16shvimaviGatUzyFUwvq');

  static yourPoolStoragePubkey = new PublicKey('CJkRsTWECMRrxh3ZVKMbo1haQMwTPREc4NcyhK5PeeC3');

  static yourStakingVaultPubkey = new PublicKey('8ogz9ZHVLAebZNGmqT2re5e9W4mY7GaW2gCBMLLtf7C6');

  static yourRewardsVaultPubkey = new PublicKey('8ogz9ZHVLAebZNGmqT2re5e9W4mY7GaW2gCBMLLtf7C6');
}