import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from '../common/Form';
import Button from '../common/Button';
import Error from '../ErrorMessage';
import { CURRENT_USER_QUERY } from './authQueries';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      firstName
      lastName
    }
  }
`;

function Signin() {
  const history = useHistory();
  const [state, setState] = useState({
    name: '',
    password: '',
    email: '',
  });

  const saveToState = useCallback((e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  }, [state, setState]);

  return (
    <Mutation
      mutation={SIGNIN_MUTATION}
      variables={state}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      awaitRefetchQueries
    >
      {(signin, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async (e) => {
            e.preventDefault();
            await signin();
            history.push('/');
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Sign into your account</h2>
            <Error error={error} />
            <label htmlFor="email">
                Email
              <input
                type="email"
                name="email"
                placeholder="email"
                value={state.email}
                onChange={saveToState}
              />
            </label>
            <label htmlFor="password">
                Password
              <input
                type="password"
                name="password"
                placeholder="password"
                value={state.password}
                onChange={saveToState}
              />
            </label>

            <Button primary type="submit">Sign In!</Button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
}

export default Signin;
