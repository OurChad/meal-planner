import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { formatDate, formatDisplayDate } from '../../util/DateUtil';
import { GET_LATEST_MEALPLAN } from './mealPlanQueries';
import Button from '../common/Button';

const StyledButton = styled(Button)`
    margin-bottom: 1rem;
`;

const MealDaysContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const MealDay = styled.div`
    background-color: ${(props) => props.theme.secondaryLight};
    padding: 1rem;
`;

const Recipe = styled.div`
    font-weight: bold;
    font-size: 1.5rem;
    margin-top: 1rem;
`;

function MealPlan({ history }) {
  const { data, loading, client } = useQuery(GET_LATEST_MEALPLAN);

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }
  const [mealPlan] = data.mealPlans;
  const { mealDays } = mealPlan;
  const activeMealPlan = {
    ...mealPlan,
    startDate: formatDate(mealPlan.startDate),
    endDate: formatDate(mealPlan.endDate),
  };

  client.writeData({ data: { activeMealPlan } });

  return (
    <>
      <StyledButton
        primary
        onClick={() => {
          history.push(`/mealPlan/${mealPlan.id}`);
        }}
      >
          Edit
      </StyledButton>
      <MealDaysContainer>
        {
          mealDays.sort((a, b) => (a.date < b.date ? -1 : 1)).map(({ date, recipe }) => (
            <MealDay>
              <div>{formatDisplayDate(date)}</div>
              <Recipe>{recipe ? recipe.name : 'Eating somewhere else'}</Recipe>
            </MealDay>
          ))
        }
      </MealDaysContainer>
    </>
  );
}

MealPlan.propTypes = {
  history: PropTypes.object.isRequired,
};

export default MealPlan;
