import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'isomorphic-unfetch';

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: true,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      mutate: {
        fetchPolicy: 'no-cache',
      }
    },
    link: new HttpLink({
      uri: 'http://localhost:7976/graphql',
      fetch,
    }),
    cache: new InMemoryCache().restore()
  });
}
export default createApolloClient();
