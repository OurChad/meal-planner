import { format } from 'date-fns';

export const formatDisplayDate = (date) => format(new Date(date), 'EEE dd MMM yyyy');
export const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd');
