import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { GET_LATEST_MEALPLANS } from './mealPlanQueries';
import { formatDisplayDate, isOnOrBetweenDates } from '../../util/DateUtil';
import MealPlan from './MealPlan';
import Button from '../common/Button';
import Calendar from '../common/Calendar';

const StyledButton = styled(Button)`
    margin-bottom: 1rem;
`;

const StyledCalendar = styled(Calendar)`
    margin-bottom: 1rem;
`;

const MealPlansContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const MealPlanListItem = styled.div`
    background-color: ${(props) => (props.active ? props.theme.primaryColorDarken : props.theme.secondaryLight)};
    color: ${(props) => (props.active ? props.theme.primaryLight : props.theme.primaryDark)};
    padding: 1rem;
`;

function MealPlans() {
  const history = useHistory();
  const { data: { mealPlans }, loading } = useQuery(GET_LATEST_MEALPLANS);

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <>
      <h2>Meal Plans</h2>
      <StyledButton
        primary
        onClick={() => {
          history.push('/createmealplan');
        }}
      >
        Create Meal Plan
          </StyledButton>
      <StyledCalendar />
      <MealPlansContainer>
        {
          mealPlans.map((mealPlan) => (
            <MealPlan key={mealPlan.id} mealPlan={mealPlan} />
          ))
        }
      </MealPlansContainer>
    </>
  );
}

MealPlans.propTypes = {};

MealPlans.defaultProps = {};

export default MealPlans;
