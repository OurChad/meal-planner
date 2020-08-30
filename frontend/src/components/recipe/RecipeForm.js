import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Form from '../common/Form';
import IngredientForm from './IngredientForm';
import Button from '../common/Button';

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-left: 1rem;
`;

const CreateRecipeButtonContainer = styled.div`
  margin-top: 1rem;
`;

function RecipeForm({ title, onSubmit, recipe: existingRecipe, mutation, onCompleted, resetOnCompleted, isReadOnly }) {
  const initialState = {
    name: '',
    ingredients: [],
    instructions: ''
  };
  const [recipe, setRecipe] = useState(existingRecipe || initialState);
  const [toggleIngredientForm, setToggleIngredientForm] = useState({ open: false, ingredient: undefined });
  const handleIngredientFormSubmit = useCallback((ingredient) => {
    const ingredientIndex = recipe.ingredients.indexOf(toggleIngredientForm.ingredient);

    if (ingredientIndex > -1) {
      recipe.ingredients.splice(ingredientIndex, 1, ingredient);
      setRecipe({ ...recipe });
    } else {
      const ingredients = recipe.ingredients.concat(ingredient);
      setRecipe({ ...recipe, ingredients });
    }

    setToggleIngredientForm({ open: !toggleIngredientForm.open });
  }, [recipe, toggleIngredientForm, setRecipe, setToggleIngredientForm]);

  const handleIngredientFormCancel = useCallback(() => {
    setToggleIngredientForm({ open: !toggleIngredientForm.open });
  }, [setToggleIngredientForm, toggleIngredientForm]);

  const saveToState = useCallback((e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  }, [setRecipe, recipe]);

  const handleCompleted = useCallback(() => {
    if (onCompleted) {
      onCompleted();
    }

    if (resetOnCompleted) {
      setRecipe(initialState);
    }
  }, [onCompleted, resetOnCompleted, initialState]);

  const [saveRecipe, { loading }] = useMutation(mutation, { onCompleted: handleCompleted });

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    onSubmit(saveRecipe, recipe);
  }, [onSubmit, saveRecipe, recipe]);


  return (
    <Form onSubmit={handleSubmit}>
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>{title}</h2>
        <label htmlFor="name">
          <div>Name</div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={recipe.name}
            onChange={saveToState}
            required
            readOnly={isReadOnly}
          />
        </label>
        <label htmlFor="instructions">
          <div>Instructions</div>
          <textarea
            name="instructions"
            placeholder=""
            value={recipe.instructions}
            onChange={saveToState}
            readOnly={isReadOnly}
          />
        </label>
        <label htmlFor="ingredients">
          <div>Ingredients</div>
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.food.name}>
                {`${ingredient.food.name} - ${ingredient.quantity} `}
                {
                  isReadOnly ? null : (
                    <StyledFontAwesomeIcon
                      icon="edit"
                      aria-label="edit_ingredient"
                      onClick={() => setToggleIngredientForm({ open: !toggleIngredientForm.open, ingredient })}
                    />
                  )
                }

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
                isReadOnly={isReadOnly}
              />
            )
            : isReadOnly ? null : (
              <Button primary disabled={isReadOnly} onClick={() => setToggleIngredientForm({ open: !toggleIngredientForm.open })}>
                <FontAwesomeIcon
                  icon="plus"
                  aria-label="add_ingredient"
                />
              </Button>
            ) }
        </label>
        {
          isReadOnly ? null : (
            <CreateRecipeButtonContainer>
              <Button primary type="submit">Save Recipe</Button>
            </CreateRecipeButtonContainer>
          )
        }
      </fieldset>
    </Form>
  );
}

RecipeForm.propTypes = {
  title: PropTypes.string.isRequired,
  recipe: PropTypes.object,
  mutation: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
  resetOnCompleted: PropTypes.bool,
  isReadOnly: PropTypes.bool,
};

RecipeForm.defaultProps = {
  recipe: undefined,
  onCompleted: () => {},
  resetOnCompleted: false,
  isReadOnly: false,
};

export default RecipeForm;
