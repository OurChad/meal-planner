import React, { useState } from 'react';
import styled from 'styled-components';
import { isSameDay } from 'date-fns';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const datesToAddClassTo = ['tomorrow', 'in3Days', 'in5Days'];

function tileClassName({ date, view }) {
    // Add class to tiles in month view only
    if (view === 'month') {
        // Check if a date React-Calendar wants to check is on the list of dates to add class to
        // if ([new Date()].find((dDate) => isSameDay(dDate, date))) {
        //   return 'myClassName';
        // }
    }
}

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

export default function Calendar() {
    const [date, setValue] = useState(new Date());
    //   const handleChange = (...params) => {
    //     setDate
    //   };
    return (
        <StyledCalendar
            onChange={setValue}
            value={date}
            tileClassName={tileClassName}
        />
    );
}
