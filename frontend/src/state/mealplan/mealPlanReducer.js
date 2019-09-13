import { eachDayOfInterval, isAfter, addDays, subDays } from 'date-fns';
import { SET_START_DATE, SET_END_DATE, SET_MEALDAY_RECIPE } from './mealPlanActions';
import { formatDate } from '../../util/DateUtil';

function getMealDays(start, end, currentMealDays = []) {
  const newMealDays = eachDayOfInterval({ start, end }).map((date) => {
    const existingMealDay = currentMealDays.find((day) => formatDate(day.date) === formatDate(date));

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
      const startDateAsDate = new Date(startDate);
      let endDateAsDate = new Date(endDate);
      if (isAfter(startDateAsDate, endDateAsDate)) {
        endDateAsDate = addDays(startDateAsDate, 1);
      }
      const [newMealDays, deletedMealDays] = getMealDays(startDateAsDate, endDateAsDate, mealDays);

      return { ...state, endDate: formatDate(endDateAsDate), startDate, mealDays: newMealDays, deletedMealDays };
    }
    case SET_END_DATE: {
      const { value: endDate } = action;
      const { startDate, mealDays } = state;
      const endDateAsDate = new Date(endDate);
      let startDateAsDate = new Date(startDate);
      if (!isAfter(endDateAsDate, startDateAsDate)) {
        startDateAsDate = subDays(endDateAsDate, 1);
      }
      const [newMealDays, deletedMealDays] = getMealDays(startDateAsDate, endDateAsDate, mealDays);

      return { ...state, startDate: formatDate(startDateAsDate), endDate, mealDays: newMealDays, deletedMealDays };
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
