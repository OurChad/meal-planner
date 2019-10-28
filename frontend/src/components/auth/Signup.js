import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from '../common/Form';
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

class Signup extends Component {
  state = {
    firstName: '',
    lastName: '',
    password: '',
    email: '',
  };

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              await signup();
              this.setState({ firstName: '', lastName: '', email: '', password: '' });
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
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="firstName">
                First Name
                <input
                  type="text"
                  name="firstName"
                  placeholder="first name"
                  value={this.state.firstName}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="lastName">
                Last Name
                <input
                  type="text"
                  name="lastName"
                  placeholder="last name"
                  value={this.state.lastName}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>

              <button type="submit">Sign Up!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signup;
