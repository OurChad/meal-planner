import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ApolloProvider } from 'react-apollo';
import client from './apollo-client';
import AuthenticatedRoute from './components/auth/AuthenticatedRoute';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
import CreateFood from './components/food/CreateFood';
import Foods from './components/food/Foods';
import Theme from './style/Theme';
import UpdateFood from './components/food/UpdateFood';
import User from './components/User';
import CreateRecipe from './components/recipe/CreateRecipe';
import CreateMealPlan from './components/mealplan/CreateMealPlan';
import Header from './components/Header';

const Index = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => (
  <User>
    {
      ({ data: { me } }) => (
        <div>
USER: $
          {me ? me.name : 'no name'}
        </div>
      )
    }
  </User>
);
const MainContentContainer = styled.div`
  margin: 0 auto;
  max-width: 960;
  padding: 0px 1rem 1.5rem;
  min-height: 75vh;
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Theme>
          <Router>
            <Header />
            <MainContentContainer>
              <main>
                <Route path="/" exact component={Index} />
                <Route path="/about/" component={About} />
                <AuthenticatedRoute path="/users/" component={Users} />
                <Route path="/signup/" component={Signup} />
                <Route path="/signin/" component={Signin} />
                <AuthenticatedRoute path="/createFood/" component={CreateFood} />
                <AuthenticatedRoute path="/foods/" component={Foods} exact />
                <AuthenticatedRoute path="/foods/:id" component={UpdateFood} />
                <AuthenticatedRoute path="/createRecipe/" component={CreateRecipe} />
                <AuthenticatedRoute path="/createMealPlan/" component={CreateMealPlan} />
              </main>
            </MainContentContainer>
          </Router>
        </Theme>
      </ApolloProvider>
    );
  }
}

export default App;
