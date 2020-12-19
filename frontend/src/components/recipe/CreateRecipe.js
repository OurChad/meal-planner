import React, { useState } from 'react';
import gql from 'graphql-tag';
import Alert from '@material-ui/lab/Alert';
import RecipeForm from './RecipeForm';

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

  const [showRecipeAlert, setShowRecipeAlert] = useState(false);

  const handleSubmit = async (createRecipe, aRecipe) => {
    const ingredients = aRecipe.ingredients.map((ingredient) => ({
      foodId: ingredient.food.id,
      quantity: Number.parseFloat(ingredient.quantity),
      quantityType: ingredient.quantityType,
    }));
    const newRecipe = { ...aRecipe, ingredients };

    await createRecipe({ variables: { ...newRecipe } });
    setShowRecipeAlert(!showRecipeAlert);
    window.setTimeout(setShowRecipeAlert, 5 * 1000, false);
  };

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
      <RecipeForm
        title="Create Recipe"
        mutation={CREATE_RECIPE_MUTATION}
        onSubmit={handleSubmit}
        resetOnCompleted
      />
    </>
  );
}
