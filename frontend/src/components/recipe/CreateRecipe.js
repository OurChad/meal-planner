import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Alert from '@material-ui/lab/Alert';
import Form from '../common/Form';
import IngredientForm from './IngredientForm';
import Button from '../common/Button';

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-left: 1rem;
`;

const CreateRecipeButtonContainer = styled.div`
  margin-top: 1rem;
`;

export default function CreateRecipe() {
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
  const [showRecipeAlert, setShowRecipeAlert] = useState(false);
  const [toggleIngredientForm, setToggleIngredientForm] = useState({ open: false, ingredient: undefined });

  const saveToState = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

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

  const handleIngredientFormCancel = () => {
    setToggleIngredientForm({ open: !toggleIngredientForm.open });
  };

  const handleSubmit = (createRecipe) => async (e) => {
    e.preventDefault();
    const ingredients = recipe.ingredients.map((ingredient) => ({
      foodId: ingredient.food.id,
      quantity: Number.parseFloat(ingredient.quantity),
      quantityType: ingredient.quantityType,
    }));
    const newRecipe = { ...recipe, ingredients };

    await createRecipe({ variables: { ...newRecipe } });
    setShowRecipeAlert(!showRecipeAlert);
    window.setTimeout(setShowRecipeAlert, 5 * 1000, false);
    setRecipe(initialState);
  };

  const [createRecipe, { loading }] = useMutation(CREATE_RECIPE_MUTATION);

  return (
    <>
      {
        showRecipeAlert
          ? (
            <Alert variant="filled" severity="success">
            Recipe saved!
            </Alert>
          )
          : null
      }
      <Form onSubmit={handleSubmit(createRecipe)}>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Create Recipe</h2>
          <label htmlFor="name">
            <div>Name</div>
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
            <div>Instructions</div>
            <textarea
              name="instructions"
              placeholder=""
              value={recipe.instructions}
              onChange={saveToState}
            />
          </label>
          <label htmlFor="ingredients">
            <div>Ingredients</div>
            <ul>
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.food.name}>
                  {`${ingredient.food.name} - ${ingredient.quantity} `}
                  <StyledFontAwesomeIcon
                    icon="edit"
                    aria-label="edit_ingredient"
                    onClick={() => setToggleIngredientForm({ open: !toggleIngredientForm.open, ingredient })}
                  />
                </li>
              )
              )}
            </ul>
            { toggleIngredientForm.open
              ? (
                <IngredientForm
                  onSubmit={handleIngredientFormSubmit}
                  onCancel={handleIngredientFormCancel}
                  ingredient={toggleIngredientForm.ingredient}
                />
              )
              : (
                <Button primary onClick={() => setToggleIngredientForm({ open: !toggleIngredientForm.open })}>
                  <FontAwesomeIcon
                    icon="plus"
                    aria-label="add_ingredient"
                  />
                </Button>
              ) }
          </label>
          <CreateRecipeButtonContainer>
            <Button primary type="submit">Create Recipe</Button>
          </CreateRecipeButtonContainer>
        </fieldset>
      </Form>
    </>
  );
}
