import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import debounce from 'debounce-promise';
import AsyncCreatableSelect from 'react-select/async-creatable';

function SearchRecipeSelect({ recipe, onChange }) {
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
    <AsyncCreatableSelect
      id="selectRecipe"
      isClearable
      loadOptions={loadOptions(client)}
      onChange={onChange}
      value={{ label: recipe && recipe.name, value: recipe }}
    />
  );
}

SearchRecipeSelect.propTypes = {
  recipe: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

SearchRecipeSelect.defaultProps = {
  recipe: {},
};

export default SearchRecipeSelect;
