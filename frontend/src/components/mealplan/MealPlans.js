import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { addDays, subDays, isSameDay } from 'date-fns';
import { GET_MEALPLANS_BY_DATE } from './mealPlanQueries';
import MealPlanCalendar from './MealPlanCalendar';
import Button from '../common/Button';
import Calendar from '../common/Calendar';
import { getCalendarDays, isOnOrBetweenDates } from '../../util/DateUtil';

const StyledButton = styled(Button)`
    margin-bottom: 1rem;
`;

const StyledCalendar = styled(Calendar)`
    margin-bottom: 1rem;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 4fr 8fr;
  grid-template-rows: fit-content(100%);
  grid-gap: 1rem;

  @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const MealPlansContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: fit-content(100%);
    grid-row: 1 / span -1;
    grid-gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

function MealPlans() {
  const history = useHistory();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealPlanQueryDate] = useState(currentDate);
  const { data: { mealPlans }, loading } = useQuery(GET_MEALPLANS_BY_DATE, {
    variables: {
      startDate: subDays(mealPlanQueryDate, 30),
      endDate: addDays(mealPlanQueryDate, 30),
    }
  });

  const [mappedMealDays, setMappedMealDays] = useState([]);

  useEffect(() => {
    const calendarDays = getCalendarDays(mealPlanQueryDate, 1);
    const allMealDays = calendarDays.map((date) => {
      const filteredMealPlans = mealPlans?.filter(({ startDate: mealPlanStartDate, endDate }) => isOnOrBetweenDates(mealPlanStartDate, endDate, date));

      const mealDays = filteredMealPlans?.reduce((acc, { id, mealDays: mealPlanDays }) => {
        const mealDay = mealPlanDays?.find((aMealDay) => isSameDay(date, new Date(aMealDay.date)));

        const calendarMealDay = {
          id,
          date,
          mealDay: mealDay ?? {},
        };

        return acc.concat(calendarMealDay);
      }, []);

      return {
        date,
        mealDays,
      };
    });

    setMappedMealDays(allMealDays);
  }, [mealPlans, mealPlanQueryDate]);

  // if (loading) {
  //   return (
  //     <div>Loading...</div>
  //   );
  // }

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
      <ContentContainer>
        <div>
          <StyledCalendar onClickDay={setCurrentDate} initialDate={currentDate} />
        </div>

        {
          loading ? <div>Loading...</div> : (
            <MealPlansContainer>
              <MealPlanCalendar startDate={currentDate} calendarMealDays={mappedMealDays} />
            </MealPlansContainer>
          )
        }

      </ContentContainer>
    </>
  );
}

MealPlans.propTypes = {};

MealPlans.defaultProps = {};

export default MealPlans;
