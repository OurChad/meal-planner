import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
    }
  }
`;

const AuthenticatedRoute = ({ component: Component, ...rest }) => (  
  <Query query={CURRENT_USER_QUERY}>
    {
      ({ data: { me }, error, loading }) => {
        if (error) return <p>{error}</p>;
        if (loading) return <p>Loading...</p>;
        return <Route {...rest} render={props => (
          me ? (
            <Component {...props}/>
          ) : (
            <Redirect to={{
              pathname: '/signin',
              state: { from: props.location }
            }}/>
          )
        )}/>
      }
    }
  </Query>
);

export default AuthenticatedRoute;