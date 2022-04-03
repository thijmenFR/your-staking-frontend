import { useQuery } from 'react-query';
import { queryKeys } from '../../constants/queryKeys';
import { useMemo, useState } from 'react';
import { formatNumber } from '@utils/index';

const coinGeckoURL = 'https://api.coingecko.com/api/v3/';

const fetchPrice = (path: string) => fetch(coinGeckoURL + '/' + path).then((res) => res.json());

export const useCoinGecko = () => {
  const [yourPrice, setYourPrice] = useState('0');
  const [solPrice, setSolPrice] = useState('1');

  const { isLoading, data: tokensPrice, error } = useQuery(
    [queryKeys.coinGecko],
    () => fetchPrice(`/simple/price?ids=solana%2Cyour&vs_currencies=usd`),
    {
      onSuccess: (data) => {
        setSolPrice(data.solana.usd);
        if (data.your.usd) setYourPrice(data.your.usd);
      },
    },
  );

  const priceYourSol = useMemo(() => formatNumber(+yourPrice / +solPrice, 3), [
    yourPrice,
    solPrice,
  ]);

  return { priceYourSol };
};
