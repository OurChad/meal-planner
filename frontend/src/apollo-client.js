import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient, HttpLink, ApolloLink } from 'apollo-boost';
import { endpoint } from './config';

const typeDefs = gql`
  extend type Query {
    activeMealPlan: MealPlan
  }
`;

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      food: (_, args, { getCacheKey }) => getCacheKey({ __typename: 'Food', id: args.id }),
    },
  },
});

const authMiddleware = () => new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');

  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === 'development' ? endpoint : process.env.REACT_APP_API_PROD_ENDPOINT,
});

const client = new ApolloClient({
  cache,
  link: authMiddleware().concat(httpLink),
  resolvers: {},
  typeDefs,
});

export default client;
