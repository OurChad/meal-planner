import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
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

const Index = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => {
  return (
    <User>
      {
        ({data: { me }}) => {
          return <div>USER: ${me ? me.name : 'no name'}</div>;
        }
      }
    </User>
  )
};

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Theme>
          <Router>
            <div>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about/">About</Link>
                  </li>
                  <li>
                    <Link to="/users/">Users</Link>
                  </li>
                  <li>
                    <Link to="/signup/">Signup</Link>
                  </li>
                  <li>
                    <Link to="/signin/">Signin</Link>
                  </li>
                  <li>
                    <Link to="/createFood/">Create Food</Link>
                  </li>
                  <li>
                    <Link to="/foods/">Foods</Link>
                  </li>
                  <li>
                    <Link to="/createRecipe/">Create Recipe</Link>
                  </li>
                </ul>
              </nav>

              <Route path="/" exact component={Index} />
              <Route path="/about/" component={About} />
              <AuthenticatedRoute path="/users/" component={Users} />
              <Route path="/signup/" component={Signup} />
              <Route path="/signin/" component={Signin} />
              <AuthenticatedRoute path="/createFood/" component={CreateFood} />
              <AuthenticatedRoute path="/foods/" component={Foods} exact />
              <AuthenticatedRoute path="/foods/:id" component={UpdateFood} />
              <AuthenticatedRoute path="/createRecipe/" component={CreateRecipe} />
            </div>
          </Router>
        </Theme>
      </ApolloProvider>
    );
  }
}

export default App;