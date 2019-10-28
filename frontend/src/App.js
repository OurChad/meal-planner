import React, { useCallback } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ApolloProvider } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { CURRENT_USER_QUERY } from './components/auth/authQueries';
import client from './apollo-client';
import AuthenticatedRoute from './components/auth/AuthenticatedRoute';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
import CreateFood from './components/food/CreateFood';
import Foods from './components/food/Foods';
import Theme from './style/Theme';
import UpdateFood from './components/food/UpdateFood';
import CreateRecipe from './components/recipe/CreateRecipe';
import CreateMealPlan from './components/mealplan/CreateMealPlan';
import MealPlan from './components/mealplan/MealPlan';
import MealPlans from './components/mealplan/MealPlans';
import UpdateMealPlan from './components/mealplan/UpdateMealPlan';
import Header from './components/Header';
import { isUserAdmin } from './util/UserUtil';

const MainContentContainer = styled.div`
  margin: 0 auto;
  max-width: 960;
  padding: 0px 1rem 1.5rem;
  min-height: 75vh;
`;

function App() {
  const { data: { me }, loading, error } = useQuery(CURRENT_USER_QUERY);
  const renderDevRoutes = useCallback(() => (isUserAdmin(me) ? (
    <>
      <AuthenticatedRoute path="/createFood/" component={CreateFood} />
      <AuthenticatedRoute path="/foods/" component={Foods} exact />
      <AuthenticatedRoute path="/foods/:id" component={UpdateFood} />
    </>
  ) : null));

  return (
    <ApolloProvider client={client}>
      <Theme>
        <Router>
          <Header />
          <MainContentContainer>
            <main>
              {
                loading ? 'Loading...'
                  : (
                    <>
                      <Route path="/" exact component={MealPlan} />
                      <Route path="/signup/" component={Signup} />
                      <Route path="/signin/" component={Signin} />
                      <AuthenticatedRoute path="/createRecipe/" component={CreateRecipe} />
                      <AuthenticatedRoute path="/createMealPlan/" component={CreateMealPlan} />
                      <AuthenticatedRoute path="/mealPlans/" component={MealPlans} exact />
                      <AuthenticatedRoute path="/mealPlan/" component={MealPlan} exact />
                      <AuthenticatedRoute path="/mealPlan/:id" component={UpdateMealPlan} />
                      {renderDevRoutes()}
                    </>
                  )

              }
            </main>
          </MainContentContainer>
        </Router>
      </Theme>
    </ApolloProvider>
  );
}

export default App;
