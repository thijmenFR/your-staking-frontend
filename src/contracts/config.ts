const claster = 'devnet';

export const solanaConfig = {
  soloScan: (address: string | undefined) =>
    address ? `https://explorer.solana.com/address/${address}?cluster=${claster}` : '',
  decimals: '9',
};
