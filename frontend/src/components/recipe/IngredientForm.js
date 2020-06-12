import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import debounce from 'debounce-promise';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import Button from '../common/Button';

const StyledFieldSet = styled.fieldset`
  background-color: ${(props) => props.theme.secondaryLight};
  padding: 1rem 2rem!important;
`;

const FormButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  div:last-child {
    margin-left: 1rem;
  }
`;

const IngredientForm = ({ ingredient: ingredientProp, onSubmit, onCancel, isReadOnly }) => {
  const quantityTypes = [
    'CLOVES',
    'CUP',
    'GRAMS',
    'JAR',
    'LEAVES',
    'MILLILITRES',
    'SPRIGS',
    'TABLESPOON',
    'TEASPOON',
    'TIN',
    'WHOLE',
  ];
  const [ingredient, setIngredient] = useState(ingredientProp || { food: {}, quantity: 1, quantityType: quantityTypes[1] });


  const SEARCH_FOODS_QUERY = gql`
      query SEARCH_FOODS_QUERY($searchTerm: String!) {
          foods(searchTerm: $searchTerm) {
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

  const loadOptions = (client) => debounce((searchTerm) => searchFood(client, searchTerm), 350);

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
            <StyledFieldSet>
              <label htmlFor="food">
                <div>Food</div>
                <AsyncSelect
                  id="food"
                  required
                  loadOptions={loadOptions(client)}
                  onChange={(food) => setIngredient({ ...ingredient, food: food.value })}
                  defaultValue={{ label: ingredient.food.name, value: ingredient.food.name }}
                  placeholder="Search for foods..."
                  readOnly={isReadOnly}
                />
              </label>
              <label htmlFor="quantity">
                <div>Quantity</div>
                <div>
                  <input
                    name="quantity"
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => setIngredient({ ...ingredient, quantity: e.target.value })}
                    required
                    min="1"
                    readOnly={isReadOnly}
                  />
                </div>
              </label>
              <label htmlFor="quantityType">
                <div>Quantity Type</div>
                <Select
                  id="multiSelect"
                  name="quantityType"
                  options={quantityTypes.map((quantityType) => ({ value: quantityType, label: quantityType, key: quantityType }))}
                  value={{ value: ingredient.quantityType, label: ingredient.quantityType, key: ingredient.quantityType }}
                  onChange={(newQuantityType) => setIngredient({ ...ingredient, quantityType: newQuantityType.value })}
                  readOnly={isReadOnly}
                />
              </label>
              <FormButtonContainer>
                <div>
                  <Button primary type="submit" onClick={handleSubmit}>Save Ingredient</Button>
                </div>
                <div>
                  <Button onClick={onCancel}>Cancel</Button>
                </div>
              </FormButtonContainer>
            </StyledFieldSet>
          </>
        )
      }
    </ApolloConsumer>
  );
};

IngredientForm.propTypes = {
  ingredient: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool,
};

IngredientForm.defaultProps = {
  ingredient: null,
  onSubmit: null,
  isReadOnly: false,
};

export default IngredientForm;
