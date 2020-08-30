import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Form from '../common/Form';
import Button from '../common/Button';
import Error from '../ErrorMessage';
import { CURRENT_USER_QUERY } from './authQueries';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $firstName: String!, $lastName: String!, $password: String!) {
    signup(email: $email, firstName: $firstName, lastName: $lastName, password: $password) {
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

function Signup() {
  const history = useHistory();
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
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
    const token = data?.signup?.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    return [{ query: CURRENT_USER_QUERY }];
  }, []);

  const [signup, { error, loading }] = useMutation(SIGNUP_MUTATION, {
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
        await signup();
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign Up for An Account</h2>
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
        <label htmlFor="firstName">
                First Name
          <input
            type="text"
            name="firstName"
            placeholder="first name"
            value={state.firstName}
            onChange={saveToState}
          />
        </label>
        <label htmlFor="lastName">
                Last Name
          <input
            type="text"
            name="lastName"
            placeholder="last name"
            value={state.lastName}
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

        <Button primary type="submit">Sign Up!</Button>
      </fieldset>
    </Form>
  );
}

export default Signup;
