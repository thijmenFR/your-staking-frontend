import { PublicKey } from '@solana/web3.js';

const claster = 'devnet';

export const solanaConfig = {
  soloScan: (address: string | undefined) =>
    address ? `https://explorer.solana.com/address/${address}?cluster=${claster}` : '',
  decimals: '9',
  inputDecimalsCount: 3,
};

export class Pubkeys {
  static yourStakingProgramId = new PublicKey('4BuMMuoSJPRgsFoboZfNuKRr5QrrbJREhjqRKuYafvwj');

  static splAssociatedTokenAccountProgramId = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );

  static yourTokenMintPubkey = new PublicKey('2BVgjEiGqVns5LUu8fqfqZDN3meXvv2vK9eNCr2VZ2mT');

  static stakingMintPubkey = new PublicKey('2BVgjEiGqVns5LUu8fqfqZDN3meXvv2vK9eNCr2VZ2mT');

  static rewardsMintPubkey = new PublicKey('2BVgjEiGqVns5LUu8fqfqZDN3meXvv2vK9eNCr2VZ2mT');

  static yourPoolStoragePubkey = new PublicKey('AMdXnpAfUXqn5C73GHxYk9rfUYbtAWbEPfyAvHNSrqn1');

  static yourStakingVaultPubkey = new PublicKey('9bPVYftzXRbWmvCtoTbizqmRm7Fm29YYmfMgNxLMpGVP');

  static yourRewardsVaultPubkey = new PublicKey('DTbph6A6G1Y1GszhhMtpWZt3eg7hooyeqPZPEymdkq2v');
}