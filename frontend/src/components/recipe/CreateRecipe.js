import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// import { ALL_FOODS_QUERY } from './queries';
import Form from '../common/Form';
import IngredientForm from './IngredientForm';
import Button from '../common/Button';

export default function CreateRecipe(props) {
  const CREATE_RECIPE_MUTATION = gql`
    mutation createRecipe($name: String!, $ingredients: [IngredientCreateInput!]!, $instructions: String) {
        createRecipe(name: $name, ingredients: $ingredients, instructions: $instructions) {
            id
            name
            ingredients {
                id
                food {
                    id
                    name
                    subName
                }
                quantity
                quantityType
            }
            instructions
      }
    }
  `;
  const initialState = {
    name: '',
    ingredients: [],
    instructions: ''
  };

  const [recipe, setRecipe] = useState(initialState);
  const [toggleIngredientForm, setToggleIngredientForm] = useState({ open: false, ingredient: undefined });

  const saveToState = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  //   const update = (cache, { data: createFood }) => {
  //     const data = cache.readQuery({ query: ALL_FOODS_QUERY });
  //     data.foods.push(createFood);
  //     cache.writeQuery({ query: ALL_FOODS_QUERY, data });
  //   };

  const handleIngredientFormSubmit = (ingredient) => {
    const ingredientIndex = recipe.ingredients.indexOf(toggleIngredientForm.ingredient);

    if (ingredientIndex > -1) {
      recipe.ingredients.splice(ingredientIndex, 1, ingredient);
      setRecipe({ ...recipe });
    } else {
      const ingredients = recipe.ingredients.concat(ingredient);
      setRecipe({ ...recipe, ingredients });
    }

    setToggleIngredientForm({ open: !toggleIngredientForm.open });
  };

  const handleSubmit = (createRecipe) => (e) => {
    e.preventDefault();
    const ingredients = recipe.ingredients.map((ingredient) => ({
      foodId: ingredient.food.id,
      quantity: Number.parseFloat(ingredient.quantity),
      quantityType: ingredient.quantityType,
    }));
    const newRecipe = { ...recipe, ingredients };

    createRecipe({ variables: { ...newRecipe } });
  };

  return (
    <Mutation mutation={CREATE_RECIPE_MUTATION}>
      {
        (createRecipe, { error, loading }) => (
          <Form onSubmit={handleSubmit(createRecipe)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>{props.title}</h2>
              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={recipe.name}
                  onChange={saveToState}
                  required
                />
              </label>
              <label htmlFor="instructions">
                Instructions
                <textarea
                  name="instructions"
                  placeholder=""
                  value={recipe.instructions}
                  onChange={saveToState}
                  required
                />
              </label>
              <label htmlFor="ingredients">
                Ingredients
                {' '}
                <span role="img" aria-label="add_ingredient" onClick={() => setToggleIngredientForm({ open: !toggleIngredientForm.open })}>➕</span>
                <ul>
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                      {ingredient.food.name}
                      {' '}
-
                      {ingredient.quantity}
                      <span
                        role="img"
                        aria-label="edit_ingredient"
                        onClick={() => setToggleIngredientForm({ open: !toggleIngredientForm.open, ingredient })}
                      >
                        🖊
                      </span>
                    </li>
                  )
                  )}
                </ul>
                { toggleIngredientForm.open && <IngredientForm onSubmit={handleIngredientFormSubmit} /> }
              </label>
              <Button type="submit">Create Recipe</Button>
            </fieldset>
          </Form>
        )
      }
    </Mutation>
  );
}
