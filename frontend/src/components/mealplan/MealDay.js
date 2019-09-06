import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { format as formatDate } from 'date-fns';
import debounce from 'debounce-promise';
import AsyncSelect from 'react-select/async';

const MealDay = function ({ date, recipe = {}, onSetRecipe, readOnly }) {
  const SEARCH_RECIPES_QUERY = gql`
          query SEARCH_RECIPES_QUERY($searchTerm: String!) {
              recipes(where: { name_contains: $searchTerm }) {
                  id
                  name
              }
          }
      `;

  const searchRecipes = (client, searchTerm) => {
    if (!searchTerm) {
      return Promise.resolve([]);
    }
    return client.query({
      query: SEARCH_RECIPES_QUERY,
      variables: { searchTerm },
    }).then((res) => res.data.recipes.map((recipeResult) => (
      {
        label: recipeResult.name,
        value: recipeResult,
      }
    )));
  };

  // Manually query apollo client
  const loadOptions = (client) => debounce((searchTerm) => searchRecipes(client, searchTerm), 350);

  return (
    <>
      <div>{date && formatDate(new Date(date), 'EEE dd MMM yyyy')}</div>
      {
        readOnly
          ? (
            <h3>{recipe.name}</h3>
          )
          : (
            <ApolloConsumer>
              {
                (client) => (
                  <>
                    <label htmlFor="recipe">
                                    Recipe
                      <AsyncSelect
                        id="multiSelect"
                        required
                        loadOptions={loadOptions(client)}
                        onChange={(newRecipe) => onSetRecipe(newRecipe.value)}
                        value={{ label: recipe.name, value: recipe }}
                      />
                    </label>
                  </>
                )
              }
            </ApolloConsumer>
          )
      }
    </>
  );
};

export default MealDay;
