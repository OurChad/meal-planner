import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { addDays, eachDayOfInterval } from 'date-fns';
import { formatDate } from '../../util/DateUtil';
import { actions, reducer as mealPlanReducer } from '../../state/mealplan';
import MealDay from './MealDay';
import Form from '../common/Form';
import Button from '../common/Button';

const MealPlanForm = ({ title, mutation, onSubmit, onSaveCompleted: onCompleted, mealPlan: existingMealPlan }) => {
  const start = formatDate(new Date());
  const end = formatDate(addDays(new Date(), 6));
  const initialState = existingMealPlan ? {
    ...existingMealPlan,
    startDate: formatDate(existingMealPlan.startDate),
    endDate: formatDate(existingMealPlan.endDate),
  } : {
    startDate: start,
    endDate: end,
    mealDays: eachDayOfInterval({
      start: new Date(start),
      end: new Date(end)
    }).map((date) => ({ date: formatDate(date) })),
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
          <div>Start Date</div>
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
          <div>End Date</div>
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
        <Button primary type="submit">Save Meal Plan</Button>
      </fieldset>
    </Form>
  );
};

MealPlanForm.propTypes = {
  title: PropTypes.string,
  mutation: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSaveCompleted: PropTypes.func,
  mealPlan: PropTypes.shape({
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    mealDays: PropTypes.array.isRequired,
  }),
};

MealPlanForm.defaultProps = {
  title: 'Meal Plan',
  mealPlan: null,
  onSaveCompleted: () => {},
};

export default MealPlanForm;
