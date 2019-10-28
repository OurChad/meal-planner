import gql from 'graphql-tag';

export const CURRENT_USER_QUERY = gql`
  query @client {
    me {
      id
      email
      firstName
      lastName
      permissions
    }
  }
`;
