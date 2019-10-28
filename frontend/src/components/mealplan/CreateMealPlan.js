import React from 'react';
import PropTypes from 'prop-types';
import { CREATE_MEALPLAN_MUTATION } from './mealPlanMutations';
import { GET_LATEST_MEALPLANS } from './mealPlanQueries';
import MealPlanForm from './MealPlanForm';

function CreateMealPlan({ history }) {
  const update = (cache, { data: mealPlan }) => {
    const data = cache.readQuery({ query: GET_LATEST_MEALPLANS });
    data.mealPlans.push(mealPlan);
    cache.writeQuery({ query: GET_LATEST_MEALPLANS, data });
  };

  const handleSubmit = (createMealPlan, mealPlan) => {
    const { startDate, endDate, mealDays } = mealPlan;
    const mealDayCreateInputs = mealDays.map(({ date, recipe }) => (recipe ? { date, recipe: { id: recipe.id } } : { date }));

    createMealPlan({ variables: { startDate, endDate, mealDays: mealDayCreateInputs }, update });
  };

  return (
    <MealPlanForm
      title="Create Meal Plan"
      mutation={CREATE_MEALPLAN_MUTATION}
      onSubmit={handleSubmit}
      onSaveCompleted={() => history.push('/mealplan')}
    />
  );
}

CreateMealPlan.propTypes = {
  history: PropTypes.object.isRequired,
};

export default CreateMealPlan;
