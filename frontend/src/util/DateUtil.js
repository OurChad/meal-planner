import { format, isBefore, isAfter, isEqual } from 'date-fns';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getMonth(date) {
  return months[date.getMonth()];
}
export const formatDisplayDate = (date) => format(new Date(date), 'EEE dd MMM yyyy');
export const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd');
export const isOnOrBetweenDates = (startDate, endDate) => {
  const currentDate = new Date(formatDate(new Date()));
  const formattedStartDate = new Date(formatDate(startDate));
  const formattedEndDate = new Date(formatDate(endDate));
  const isEndDateAfterToday = isAfter(formattedEndDate, currentDate);
  const isEndDateToday = isEqual(formattedEndDate, currentDate);
  const isStartDateBeforeToday = isBefore(formattedStartDate, currentDate);
  const isStartDateToday = isEqual(formattedStartDate, currentDate);

  return isStartDateToday || isEndDateToday || (isStartDateBeforeToday && isEndDateAfterToday);
};
