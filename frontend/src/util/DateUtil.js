import { format, isBefore, isAfter, isEqual, subMonths, addMonths, eachDayOfInterval } from 'date-fns';

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
export const isOnOrBetweenDates = (startDate, endDate, dateToCompare = new Date()) => {
  const formattedDateToCompare = new Date(formatDate(dateToCompare));
  const formattedStartDate = new Date(formatDate(startDate));
  const formattedEndDate = new Date(formatDate(endDate));
  const isEndDateAfterToday = isAfter(formattedEndDate, formattedDateToCompare);
  const isEndDateToday = isEqual(formattedEndDate, formattedDateToCompare);
  const isStartDateBeforeToday = isBefore(formattedStartDate, formattedDateToCompare);
  const isStartDateToday = isEqual(formattedStartDate, formattedDateToCompare);

  return isStartDateToday || isEndDateToday || (isStartDateBeforeToday && isEndDateAfterToday);
};
export function getCalendarDays(middleDate = new Date(), range = 1) {
  const start = subMonths(middleDate, range);
  const end = addMonths(middleDate, range);

  return eachDayOfInterval({ start, end });
}
