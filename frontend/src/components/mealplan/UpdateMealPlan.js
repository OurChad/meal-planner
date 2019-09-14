import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { UPDATE_MEALPLAN_MUTATION } from './mealPlanMutations';
import { GET_ACTIVE_MEALPLAN_QUERY } from './mealPlanQueries';
import MealPlanForm from './MealPlanForm';

function UpdateMealPlan({ history }) {
  const { data } = useQuery(GET_ACTIVE_MEALPLAN_QUERY);

  const { activeMealPlan } = data;

  const handleSubmit = (updateMealPlan, updatedMealPlan) => {
    const { mealDays } = updatedMealPlan;
    const mealDayCreateUpdateInputs = mealDays.map(({ id, date, recipe }) => (recipe ? { id, date, recipe: { id: recipe.id } } : { id, date }));

    updateMealPlan({ variables: { ...updatedMealPlan, mealDays: mealDayCreateUpdateInputs } });
  };

  return (
    <MealPlanForm
      title="Update Meal Plan"
      mealPlan={activeMealPlan}
      mutation={UPDATE_MEALPLAN_MUTATION}
      onSubmit={handleSubmit}
      onSaveCompleted={() => history.push('/mealplan')}
    />
  );
}

UpdateMealPlan.propTypes = {
  history: PropTypes.object.isRequired,
};

export default UpdateMealPlan;
