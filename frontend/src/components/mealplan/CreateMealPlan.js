import React from 'react';
import { CREATE_MEALPLAN_MUTATION } from './mealPlanMutations';
import MealPlanForm from './MealPlanForm';

export default function CreateMealPlan() {
  const handleSubmit = (createMealPlan, mealPlan) => {
    const { startDate, endDate, mealDays } = mealPlan;
    const mealDayCreateInputs = mealDays.map(({ date, recipe }) => (recipe ? { date, recipe: { id: recipe.id } } : { date }));

    createMealPlan({ variables: { startDate, endDate, mealDays: mealDayCreateInputs } });
  };

  return (
    <MealPlanForm
      title="Create Meal Plan"
      mutation={CREATE_MEALPLAN_MUTATION}
      onSubmit={handleSubmit}
    />
  );
}
