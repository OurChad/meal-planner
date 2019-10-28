import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { GET_LATEST_MEALPLANS } from './mealPlanQueries';
import { formatDisplayDate, isOnOrBetweenDates } from '../../util/DateUtil';
import Button from '../common/Button';

const StyledButton = styled(Button)`
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
    background-color: ${(props) => (props.active ? props.theme.secondaryGreen : props.theme.secondaryLight)};
    color: ${(props) => (props.active ? props.theme.primaryLight : props.theme.primaryDark)};
    padding: 1rem;
`;

function MealPlans({ }) {
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
      <MealPlansContainer>
        {
          mealPlans.map(({ id, startDate, endDate, }) => (
            <MealPlanListItem key={id} active={isOnOrBetweenDates(startDate, endDate)}>
              <div>{`From: ${formatDisplayDate(startDate)}`}</div>
              <div>{`To: ${formatDisplayDate(endDate)}`}</div>
            </MealPlanListItem>
          ))
        }
      </MealPlansContainer>
    </>
  );
}

MealPlans.propTypes = {};

MealPlans.defaultProps = {};

export default MealPlans;
