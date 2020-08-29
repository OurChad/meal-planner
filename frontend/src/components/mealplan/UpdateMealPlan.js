import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { cloneWithoutTypeName } from '../../util/MutationUtil';
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

  const handleSubmit = (updateMealPlanMutation, aMealPlan) => {
    const { mealDays } = aMealPlan;
    const mealDayCreateUpdateInputs = mealDays.map(({ id, date, recipe }) => {
      if (recipe) {
        const recipeInput = cloneWithoutTypeName(recipe);

        return {
          id,
          date,
          recipe: recipeInput,
        };
      }

      return { id, date };
    });
    const clonedMealPlan = cloneWithoutTypeName(aMealPlan);
    const updatedMealPlan = {
      ...clonedMealPlan,
      mealDays: mealDayCreateUpdateInputs,
    };

    updateMealPlanMutation({ variables: { mealPlan: updatedMealPlan } });
  };

  return (
    <MealPlanForm
      title="Update Meal Plan"
      mealPlan={mealPlan}
      mutation={UPDATE_MEALPLAN_MUTATION}
      onSubmit={handleSubmit}
      onSaveCompleted={() => history.push('/mealPlans')}
    />
  );
}

UpdateMealPlan.propTypes = {
  history: PropTypes.object.isRequired,
};

export default UpdateMealPlan;
