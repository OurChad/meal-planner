import React from 'react';
import PropTypes from 'prop-types';
import { format as formatDate } from 'date-fns';
import SearchRecipeSelect from '../recipe/SearchRecipeSelect';

function MealDay({ date, recipe, onSetRecipe }) {
  const handleChange = (selectedRecipe = {}, actionMeta) => {
    if (actionMeta.action === 'create-option') {
      const newRecipe = {
        name: selectedRecipe.value
      };

      onSetRecipe(newRecipe);
    } else {
      onSetRecipe(selectedRecipe.value);
    }
  };

  return (
    <>
      <label htmlFor="recipe">
        <div>{date && formatDate(new Date(date), 'EEE dd MMM yyyy')}</div>
        <SearchRecipeSelect
          id="selectRecipe"
          recipe={recipe}
          onChange={handleChange}
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
