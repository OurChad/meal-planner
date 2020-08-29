import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const StyledCalendar = styled(ReactCalendar)`
    .react-calendar__tile--active {
        background-color: ${(props) => props.theme.primaryColor} !important;
        color: ${(props) => props.theme.primaryLight} !important;
    }

    .react-calendar__tile--now {
        background-color:  ${(props) => props.theme.primaryColorHighlight};
        color: ${(props) => props.theme.primaryLight} !important;

        &:hover {
            background-color: ${(props) => props.theme.primaryColorDarken} !important;
        }
    }

    .react-calendar__month-view__days__day--weekend {
        color: ${(props) => props.theme.primaryColorHighlight};
    }
`;

function Calendar({ initialDate, onClickDay }) {
  const [date, setValue] = useState(initialDate);

  const handleOnClickDay = (value) => {
    setValue(value);
    onClickDay(value);
  };

  return (
    <StyledCalendar
      onClickDay={handleOnClickDay}
      onChange={setValue}
      value={date}
    />
  );
}

Calendar.propTypes = {
  initialDate: PropTypes.object,
  onClickDay: PropTypes.func.isRequired,
};

Calendar.defaultProps = {
  initialDate: new Date(),
};

export default Calendar;
