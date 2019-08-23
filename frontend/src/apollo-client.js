import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { endpoint } from './config';

const client = new ApolloClient({
  uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
  request: (operation) => {
    operation.setContext({
      fetchOptions: {
        credentials: 'include',
      },
    });
  },
  cache: new InMemoryCache({
    cacheRedirects: {
      Query: {
        food: (_, args, { getCacheKey }) => getCacheKey({ __typename: 'Food', id: args.id })
      },
    },
  }),
});

export default client;
