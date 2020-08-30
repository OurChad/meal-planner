import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { getDate } from 'date-fns';
import { Create as CreateIcon } from '@material-ui/icons';
import { getMonth } from '../../util/DateUtil';

const CalendarMealDaysContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: minmax(min-content, max-content);
    grid-gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const MealDayContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 1fr minmax(300px, 11fr);
    grid-gap: 1rem;
    overflow: hidden;
`;

const MealDayDateContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
    text-align: center;
`;

const MealDaysContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
`;

const MealDay = styled.div`
    display: flex;
    background-color: ${(props) => props.theme.secondaryLight};
    padding: 1rem;
    height: fill-available;
`;

const Recipe = styled.div`
    flex-grow: 1;
    max-width: 90%;
    font-weight: bold;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
`;

const ScrollableDiv = styled.div`
  height: 50vh;
  overflow-y: auto;
`;

const EditButtonContainer = styled(CreateIcon)`
    flex-grow: 0;
    width: 20px;
    height: 20px;
`;

function MealPlanCalendar({ calendarMealDays, startDate }) {
  const history = useHistory();

  const handleEditMealDay = useCallback((id) => (() => {
    if (id) {
      history.push(`/mealPlan/${id}/edit`);
    } else {
      history.push('/createMealPlan');
    }
  }), [history]);

  const allMealDays = useMemo(() => calendarMealDays.map(({ date, mealDays }) => (
    <MealDayContainer id={date.toString()} key={date.toString()}>
      <MealDayDateContainer>
        <div>
          {getDate(date)}
          {' '}
          <br />
          {' '}
          {getMonth(new Date(date))}
        </div>
      </MealDayDateContainer>
      <MealDaysContainer>
        {
          mealDays?.length ? mealDays?.map(({ id: mealPlanId, mealDay }) => (
            <MealDay key={mealDay.id}>
              <Recipe>{mealDay?.recipe ? mealDay?.recipe.name : 'No meal'}</Recipe>
              <EditButtonContainer onClick={handleEditMealDay(mealPlanId)} />
            </MealDay>
          )) : (
            <MealDay>
              <Recipe>No meal</Recipe>
            </MealDay>
          )
        }
      </MealDaysContainer>
    </MealDayContainer>
  )
  ), [calendarMealDays, handleEditMealDay]);

  useEffect(() => {
    const topPos = document.getElementById(startDate.toString())?.offsetTop;
    const container = document.getElementById('mealDaysContainer');
    const containerOffset = container.offsetTop;
    container.scrollTop = (topPos - containerOffset);
  }, [startDate]);

  return (
    <ScrollableDiv id="mealDaysContainer">
      <CalendarMealDaysContainer>
        {allMealDays}
      </CalendarMealDaysContainer>
    </ScrollableDiv>
  );
}

MealPlanCalendar.propTypes = {
  calendarMealDays: PropTypes.array,
  startDate: PropTypes.object,
};

MealPlanCalendar.defaultProps = {
  calendarMealDays: [],
  startDate: new Date(),
};

export default MealPlanCalendar;
