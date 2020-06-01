import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from '../common/Form';
import Button from '../common/Button';
import Error from '../ErrorMessage';
import { CURRENT_USER_QUERY } from './authQueries';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $firstName: String!, $lastName: String!, $password: String!) {
    signup(email: $email, firstName: $firstName, lastName: $lastName, password: $password) {
      id
      email
      firstName
      lastName
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

  return (
    <Mutation
      mutation={SIGNUP_MUTATION}
      variables={state}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signup, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async (e) => {
            e.preventDefault();
            await signup();
            history.push('/');
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
      )}
    </Mutation>
  );
}

export default Signup;
