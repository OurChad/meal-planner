import React, { useReducer } from 'react';
import { Mutation } from 'react-apollo';
import { addDays, eachDayOfInterval, format as formatDate } from 'date-fns';
import { CREATE_MEALPLAN_MUTATION } from './mealPlanMutations';
import { actions, reducer as mealPlanReducer } from '../../state/mealplan';
import MealDay from './MealDay';
import Form from '../common/Form';

export default function CreateMealPlan(props) {
  const start = formatDate(new Date(), 'yyyy-MM-dd');
  const end = formatDate(addDays(new Date(), 6), 'yyyy-MM-dd');
  const initialState = {
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

  const handleSetRecipe = (date) => (newRecipe) => {
    dispatch({ type: actions.SET_MEALDAY_RECIPE, value: { date, recipe: newRecipe } });
  };

  const handleSubmit = (createMealPlan) => async (e) => {
    e.preventDefault();
    const mappedMealDays = mealPlan.mealDays.reduce((acc, { date, recipe }) => {
      const recipeConnection = recipe ? { recipe: { connect: { id: recipe.id } } } : {};
      const mealDayForAPI = {
        date,
        ...recipeConnection
      };
      const create = [...acc.create, mealDayForAPI];
      return {
        create
      };
    },
    {
      create: []
    }
    );
    const { startDate, endDate } = mealPlan;

    await createMealPlan({ variables: { data: { startDate, endDate, mealDays: mappedMealDays } } });
  };

  return (
    <Mutation mutation={CREATE_MEALPLAN_MUTATION}>
      {
        (createMealPlan, { error, loading }) => (
          <Form onSubmit={handleSubmit(createMealPlan)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>{props.title}</h2>
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
                mealPlan.mealDays.map(({ date, recipe }) => (
                  <MealDay
                    date={date}
                    recipe={recipe}
                    onSetRecipe={handleSetRecipe(date)}
                  />
                ))
              }
              <button type="submit">Create Meal Plan</button>
            </fieldset>
          </Form>
        )
      }
    </Mutation>
  );
}
