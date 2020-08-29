import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getMonth } from '../../util/DateUtil';
import Button from '../common/Button';

const StyledButton = styled(Button)`
    margin-bottom: 1rem;
`;

const MealDaysContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const MealDayContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 10fr;
    grid-template-rows: fit-content(100%);
    grid-gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 2fr 10fr;
    }
`;

const MealDayDateContainer = styled.div`
    display: grid;
    /* grid-template-rows: 1fr 1fr; */
    grid-template-columns: 1fr;
    /* grid-gap: 1rem; */
    text-align: center;

    /* @media (max-width: 768px) {
        grid-template-columns: 1fr;
    } */
`;

const MealDay = styled.div`
    background-color: ${(props) => props.theme.secondaryLight};
    padding: 1rem;
`;

const Recipe = styled.div`
    font-weight: bold;
`;

function MealPlan({ history, mealPlan }) {
  if (!mealPlan) {
    return (
      <>
        <StyledButton
          primary
          onClick={() => {
            history.push('/createmealplan');
          }}
        >
          Create Meal Plan
        </StyledButton>
      </>
    );
  }

  const { mealDays } = mealPlan;

  return (
    <>
      <MealDaysContainer>
        {
          mealDays.sort((a, b) => (a.date < b.date ? -1 : 1)).map(({ date, recipe }) => {
            const currentDay = new Date(date);
            return (
              <MealDayContainer>
                <MealDayDateContainer>
                  <div>
                    {currentDay.getDate()}
                    {' '}
                    <br />
                    {' '}
                    {getMonth(currentDay)}
                  </div>
                  <div />
                </MealDayDateContainer>
                <MealDay key={date}>
                  <Recipe>{recipe ? recipe.name : 'Eating somewhere else'}</Recipe>
                </MealDay>
              </MealDayContainer>
            );
          })
        }
      </MealDaysContainer>
    </>
  );
}

MealPlan.propTypes = {
  history: PropTypes.object.isRequired,
};

export default MealPlan;
