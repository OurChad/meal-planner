import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
// import debounce from 'lodash.debounce';
import debounce from 'debounce-promise';
import AsyncSelect from 'react-select/async';

const IngredientForm = ({ ingredient: ingredientProp, onSubmit }) => {
  const [ingredient, setIngredient] = useState(ingredientProp || { food: {}, quantity: 1 });

  const SEARCH_FOODS_QUERY = gql`
      query SEARCH_FOODS_QUERY($searchTerm: String!) {
          foods(where: { OR: [{ name_contains: $searchTerm }, { subName_contains: $searchTerm }] }) {
              id
              name
              subName
          }
      }
    `;

  const searchFood = (client, searchTerm) => {
    if (!searchTerm) {
      return Promise.resolve([]);
    }
    return client.query({
      query: SEARCH_FOODS_QUERY,
      variables: { searchTerm },
    }).then((res) => res.data.foods.map((food) => (
      {
        label: food.name,
        value: food
      }
    )));
  };

  const loadOptions = (client) => debounce((searchTerm) => {
    console.log('Searching...', searchTerm);
    // turn loading on
    // this.setState({ loading: true });
    // Manually query apollo client
    return searchFood(client, searchTerm);
  }, 350);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(ingredient);
    }
  };

  return (
    <ApolloConsumer>
      {
        (client) => (
          <>
            <label htmlFor="food">
                              Food
              <AsyncSelect
                id="multiSelect"
                required
                loadOptions={loadOptions(client)}
                onChange={(food) => setIngredient({ ...ingredient, food: food.value })}
              />
            </label>
            <label htmlFor="quantity">
                              Quantity
              <input
                name="quantity"
                type="number"
                value={ingredient.quantity}
                onChange={(e) => setIngredient({ ...ingredient, quantity: e.target.value })}
                required
                min="1"
              />
            </label>
            <button type="submit" onClick={handleSubmit}>Add Ingredient</button>
          </>
        )
      }
    </ApolloConsumer>
  );
};

IngredientForm.propTypes = {
  ingredient: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

IngredientForm.defaultProps = {
  onSubmit: null,
};

export default IngredientForm;
