import { request } from 'graphql-request';
import { useQuery } from 'react-query';

export const useReactQueryGQL = (gqlQuery: any, queryKey: any, filterBy?: any) =>
  useQuery(queryKey, async () => {
    // @ts-ignore
    const data = await request(process.env.REACT_APP_SUBGRAPH, gqlQuery, filterBy);
    return data;
  });

export const useReactQuerySushiGQL = (gqlQuery: any, queryKey: any, filterBy?: any) =>
  useQuery(queryKey, async () => {
    // @ts-ignore
    const data = await request(process.env.REACT_APP_SUBGRAPH_SUSHI, gqlQuery, filterBy);
    return data;
  });
