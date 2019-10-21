import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { format as formatDate } from 'date-fns';
import debounce from 'debounce-promise';
import AsyncSelect from 'react-select/async';

function MealDay({ date, recipe, onSetRecipe }) {
  const SEARCH_RECIPES_QUERY = gql`
          query SEARCH_RECIPES_QUERY($searchTerm: String!) {
              recipes(searchTerm: $searchTerm) {
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
  const client = useApolloClient();
  return (
    <>
      <div>{date && formatDate(new Date(date), 'EEE dd MMM yyyy')}</div>
      <label htmlFor="recipe">
                            Recipe
        <AsyncSelect
          id="multiSelect"
          isClearable
          loadOptions={loadOptions(client)}
          onChange={(newRecipe) => onSetRecipe(newRecipe ? newRecipe.value : newRecipe)}
          value={{ label: recipe && recipe.name, value: recipe }}
        />
      </label>
    </>
  );
}

MealDay.propTypes = {
  date: PropTypes.string.isRequired,
  onSetRecipe: PropTypes.func.isRequired,
  recipe: PropTypes.object,
};

MealDay.defaultProps = {
  recipe: {},
};

export default MealDay;
