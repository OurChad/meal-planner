import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Form from '../common/Form';
import Button from '../common/Button';
import Error from '../ErrorMessage';
import { CURRENT_USER_QUERY } from './authQueries';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
      }
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

  const handleCompleted = useCallback(() => {
    history.push('/');
  }, [history]);

  const refetchQueries = useCallback(({ data }) => {
    const token = data?.signin?.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    return [{ query: CURRENT_USER_QUERY }];
  }, []);

  const [signin, { error, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: state,
    onCompleted: handleCompleted,
    refetchQueries,
    awaitRefetchQueries: true,
  });

  return (
    <Form
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        await signin();
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
  );
}

export default Signin;
