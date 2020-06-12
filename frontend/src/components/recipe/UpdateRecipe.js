import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import Alert from '@material-ui/lab/Alert';
import Button from '../common/Button';
import RecipeForm from './RecipeForm';
import { GET_RECIPE_BY_ID } from './recipeQueries';

export default function UpdateRecipe() {
  const { recipeId } = useParams();
  const { data: { recipe }, loading } = useQuery(GET_RECIPE_BY_ID, {
    variables: {
      id: recipeId,
    }
  });

  const UPDATE_RECIPE_MUTATION = gql`
    mutation updateRecipe($id: ID!, $name: String!, $ingredients: IngredientUpdateManyInput, $instructions: String) {
        updateRecipe(id: $id, name: $name, ingredients: $ingredients, instructions: $instructions) {
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

  const [isReadOnly, setIsReadOnly] = useState(true);
  const [showRecipeAlert, setShowRecipeAlert] = useState(false);

  const handleSubmit = async (updateRecipeMutation, updatedRecipe) => {
    const deletedIngredients = recipe.ingredients.filter((anIngredient) => {
      const { ingredients: updatedIngredients } = updatedRecipe;
      return !updatedIngredients.find((updatedIngredient) => anIngredient.id === updatedIngredient.id);
    }).map((anIngredient) => (
      {
        id: anIngredient.id,
      }
    ));

    const defaultIngredients = {
      create: [],
      delete: deletedIngredients,
      update: [],
    };

    const ingredients = updatedRecipe.ingredients.reduce((acc, { id, food, quantity, quantityType }) => {
      if (id) {
        const updateIngredient = {
          id,
          foodId: food.id,
          quantity: Number.parseFloat(quantity),
          quantityType,
        };

        return {
          ...acc,
          update: acc.update.concat(updateIngredient)
        };
      }

      const newIngredient = {
        foodId: food.id,
        quantity: Number.parseFloat(quantity),
        quantityType,
      };
      return {
        ...acc,
        create: acc.create.concat(newIngredient)
      };
    }, defaultIngredients);

    const newRecipe = { ...updatedRecipe, ingredients };

    await updateRecipeMutation({ variables: { ...newRecipe } });
    setIsReadOnly(true);
    setShowRecipeAlert(!showRecipeAlert);
    window.setTimeout(setShowRecipeAlert, 5 * 1000, false);
  };

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  const title = isReadOnly ? 'Recipe' : 'Update Recipe';
  return (
    <>
      {
        isReadOnly
          ? <Button primary onClick={() => setIsReadOnly(false)}>Edit</Button>
          : null
      }
      {
        showRecipeAlert
          ? (
            <Alert variant="filled" severity="success">
            Recipe saved!
            </Alert>
          )
          : null
      }
      <>
        <RecipeForm
          title={title}
          recipe={recipe}
          mutation={UPDATE_RECIPE_MUTATION}
          onSubmit={handleSubmit}
          isReadOnly={isReadOnly}
        />
      </>
    </>
  );
}
