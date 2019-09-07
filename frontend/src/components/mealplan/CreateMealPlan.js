import React from 'react';
import { CREATE_MEALPLAN_MUTATION } from './mealPlanMutations';
import MealPlanForm from './MealPlanForm';

export default function CreateMealPlan() {
  const handleSubmit = (createMealPlan, mealPlan) => {
    const { mealDays } = mealPlan;
    const mealDayCreateInputs = mealDays.map(({ date, recipe: { id } }) => ({ date, recipe: { id } }));

    createMealPlan({ variables: { ...mealPlan, mealDays: mealDayCreateInputs } });
  };

  return (
    <MealPlanForm
      title="Create Meal Plan"
      mutation={CREATE_MEALPLAN_MUTATION}
      onSubmit={handleSubmit}
    />
  );
}
