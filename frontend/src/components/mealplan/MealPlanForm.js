import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { addDays, eachDayOfInterval, format as formatDate } from 'date-fns';
import { actions, reducer as mealPlanReducer } from '../../state/mealplan';
import MealDay from './MealDay';
import Form from '../common/Form';

const MealPlanForm = ({ title, mutation, onSubmit, onSaveCompleted: onCompleted, mealPlan: exisitingMealPlan }) => {
  const start = formatDate(new Date(), 'yyyy-MM-dd');
  const end = formatDate(addDays(new Date(), 6), 'yyyy-MM-dd');
  const initialState = exisitingMealPlan || {
    startDate: start,
    endDate: end,
    mealDays: eachDayOfInterval({
      start: new Date(start),
      end: new Date(end)
    }).map((date) => ({ date: formatDate(date, 'yyyy-MM-dd') })),
  };

  const [mealPlan, dispatch] = useReducer(mealPlanReducer, initialState);

  const saveToState = (type) => (e) => {
    dispatch({ type, value: e.target.value });
  };

  const handleSetRecipe = ({ id, date }) => (newRecipe) => {
    dispatch({ type: actions.SET_MEALDAY_RECIPE, value: { id, date, recipe: newRecipe } });
  };

  const handleSubmit = (saveMealPlan) => (e) => {
    e.preventDefault();

    onSubmit(saveMealPlan, mealPlan);
  };

  const [saveMealPlan, { loading }] = useMutation(mutation, { onCompleted });

  return (
    <Form onSubmit={handleSubmit(saveMealPlan)}>
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>{title}</h2>
        <label htmlFor="startDate">
                Start Date
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={mealPlan.startDate}
            onChange={saveToState(actions.SET_START_DATE)}
            required
          />
        </label>
        <label htmlFor="endDate">
                End Date
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={mealPlan.endDate}
            onChange={saveToState(actions.SET_END_DATE)}
            required
          />
        </label>
        {
          mealPlan.mealDays.map(({ id, date, recipe }) => (
            <MealDay
              key={date}
              date={date}
              recipe={recipe}
              onSetRecipe={handleSetRecipe({ id, date })}
            />
          ))
        }
        <button type="submit">Save Meal Plan</button>
      </fieldset>
    </Form>
  );
};

MealPlanForm.propTypes = {
  title: PropTypes.string,
  mutation: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSaveCompleted: PropTypes.func.isRequired,
  mealPlan: PropTypes.shape({
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    mealDays: PropTypes.array.isRequired,
  }),
};

MealPlanForm.defaultProps = {
  title: 'Meal Plan',
  mealPlan: null,
};

export default MealPlanForm;
