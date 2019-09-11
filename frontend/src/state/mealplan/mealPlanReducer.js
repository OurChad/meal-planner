import { eachDayOfInterval, format as formatDate } from 'date-fns';
import { SET_START_DATE, SET_END_DATE, SET_MEALDAY_RECIPE } from './mealPlanActions';

function getMealDays(startDate, endDate, currentMealDays = []) {
  const newMealDays = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) }).map((date) => {
    const existingMealDay = currentMealDays.find((day) => formatDate(new Date(day.date), 'yyyy-MM-dd') === formatDate(date, 'yyyy-MM-dd'));

    return existingMealDay || { date };
  });

  const deletedMealDays = currentMealDays.filter((mealDay) => !newMealDays.find((latestMealDay) => mealDay.id === latestMealDay.id))
    .map((mealDay) => mealDay.id);

  return [newMealDays, deletedMealDays];
}

export default function mealPlanReducer(state, action) {
  switch (action.type) {
    case SET_START_DATE: {
      const { value: startDate } = action;
      const { endDate, mealDays } = state;
      const [newMealDays, deletedMealDays] = getMealDays(startDate, endDate, mealDays);

      return { ...state, startDate, mealDays: newMealDays, deletedMealDays };
    }
    case SET_END_DATE: {
      const { value: endDate } = action;
      const { startDate, mealDays } = state;
      const [newMealDays, deletedMealDays] = getMealDays(startDate, endDate, mealDays);

      return { ...state, endDate, mealDays: newMealDays, deletedMealDays };
    }
    case SET_MEALDAY_RECIPE: {
      const { date } = action.value;
      const { mealDays } = state;
      const originalMealDay = mealDays.find((mealDay) => mealDay.date === date);
      const indexOfMealDay = mealDays.indexOf(originalMealDay);
      mealDays.splice(indexOfMealDay, 1, action.value);
      return { ...state, mealDays };
    }
    default: {
      return state;
    }
  }
}
