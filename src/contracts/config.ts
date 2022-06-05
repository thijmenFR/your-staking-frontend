import { PublicKey } from '@solana/web3.js';

const claster = 'devnet';

export const solanaConfig = {
  soloScan: (address: string | undefined) =>
    address ? `https://explorer.solana.com/address/${address}?cluster=${claster}` : '',
  decimals: '9',
  inputDecimalsCount: 3,
};

export class Pubkeys {
  static yourStakingProgramId = new PublicKey('4RAvkt24PXKbM5hY4AFefV6idx4dUiFrbeS37s43QNgx');

  static splAssociatedTokenAccountProgramId = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );

  static yourTokenMintPubkey = new PublicKey('CcPcZKj3f6GufFXvTJW2zSAaV2bCNbEYw5m6Y7qWViS7');

  static stakingMintPubkey = new PublicKey('CcPcZKj3f6GufFXvTJW2zSAaV2bCNbEYw5m6Y7qWViS7');

  static rewardsMintPubkey = new PublicKey('CcPcZKj3f6GufFXvTJW2zSAaV2bCNbEYw5m6Y7qWViS7');

  static yourPoolStoragePubkey = new PublicKey('8fabDRESFY5B24LHW8CnNYJnnPN1j9GwBhDHVTWa3GCi');

  static yourStakingVaultPubkey = new PublicKey('mj3WthoeYBVosn4czXG6PkN4RSkxj5fXo9uVcptK2Vj');

  static yourRewardsVaultPubkey = new PublicKey('5h6x4Ei9tn3niCAhBdaSYN8FwroBfKMJyiKAWFaKoqkr');
}
