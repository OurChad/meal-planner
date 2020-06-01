import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { UPDATE_MEALPLAN_MUTATION } from './mealPlanMutations';
import { GET_MEALPLAN_BY_ID } from './mealPlanQueries';
import MealPlanForm from './MealPlanForm';

function UpdateMealPlan({ history }) {
  const { mealPlanID } = useParams();
  const { data: { mealPlan }, loading } = useQuery(GET_MEALPLAN_BY_ID, {
    variables: {
      id: mealPlanID,
    }
  });

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  const handleSubmit = (updateMealPlan, updatedMealPlan) => {
    const { mealDays } = updatedMealPlan;
    const mealDayCreateUpdateInputs = mealDays.map(({ id, date, recipe }) => (recipe ? { id, date, recipe: { id: recipe.id } } : { id, date }));

    updateMealPlan({ variables: { ...updatedMealPlan, mealDays: mealDayCreateUpdateInputs } });
  };

  return (
    <MealPlanForm
      title="Update Meal Plan"
      mealPlan={mealPlan}
      mutation={UPDATE_MEALPLAN_MUTATION}
      onSubmit={handleSubmit}
      onSaveCompleted={() => history.push(`/mealplan/${mealPlanID}`)}
    />
  );
}

UpdateMealPlan.propTypes = {
  history: PropTypes.object.isRequired,
};

export default UpdateMealPlan;
