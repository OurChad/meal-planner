import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { CURRENT_USER_QUERY } from './authQueries';

function AuthenticatedRoute({ component: Component, ...rest }) {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);

  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading...</p>;

  const me = data;

  return (
    <Route
      {...rest}
      render={(props) => (
        me ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: '/signin',
            state: { from: props.location }
          }}
          />
        )
      )}
    />
  );
}

AuthenticatedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]).isRequired,
};

export default AuthenticatedRoute;
