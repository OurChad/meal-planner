import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient, HttpLink } from 'apollo-boost';
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

const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    credentials: 'include',
  }),
  resolvers: {},
  typeDefs,
});

export default client;
