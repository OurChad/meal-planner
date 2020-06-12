import React from 'react';
import { useHistory } from 'react-router-dom';
import SearchRecipeSelect from './SearchRecipeSelect';

function SearchRecipes() {
  const history = useHistory();
  const handleChange = ({ value: { id } }, { action }) => {
    if (action === 'create-option') {
      history.push('/createRecipe');
    } else {
      history.push(`/recipe/${id}`);
    }
  };

  return (
    <>
      <label htmlFor="recipe">
        <h2>Search Recipes</h2>
        <SearchRecipeSelect
          id="recipe"
          onChange={handleChange}
        />
      </label>
    </>
  );
}

SearchRecipes.propTypes = {
};

SearchRecipes.defaultProps = {
};

export default SearchRecipes;
