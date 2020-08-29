import gql from 'graphql-tag';

export const GET_MEALPLAN_BY_ID = gql`
    query GET_MEALPLAN_BY_ID($id: ID!) {
        mealPlan(where: { id: $id }) {
            id,
            startDate
            endDate
            mealDays {
                id
                date
                recipe {
                    id
                    name
                }
            }
        }
    }
`;

export const GET_LATEST_MEALPLANS = gql`
    query GET_LATEST_MEALPLANS($first: Int = 10) {
        mealPlans(orderBy: startDate_DESC, first: $first) {
            id,
            startDate
            endDate
            mealDays {
                id
                date
                recipe {
                    id
                    name
                }
            }
        }
    }
`;

export const GET_MEALPLANS_BY_DATE = gql`
    query GET_MEALPLANS_BY_DATE($startDate: DateTime, $endDate: DateTime) {
        mealPlans(
            where: {
                OR: [
                    {
                        startDate_gte: $startDate,
                        startDate_lte: $endDate
                    },
                    {
                        endDate_gte: $startDate,
                        endDate_lte: $endDate
                    }
                ]
            },
            orderBy: startDate_DESC) {
            id,
            startDate
            endDate
            mealDays {
                id
                date
                recipe {
                    id
                    name
                }
            }
        }
    }
`;

export const GET_LATEST_MEALPLAN = gql`
    query GET_LATEST_MEALPLAN($first: Int = 1) {
        mealPlans(orderBy: startDate_DESC, first: $first) {
            id,
            startDate
            endDate
            mealDays {
                id
                date
                recipe {
                    id
                    name
                }
            }
        }
    }
`;

export const GET_ACTIVE_MEALPLAN = gql`
    {
        activeMealPlan @client {
            id
            startDate
            endDate
            mealDays {
                id
                date
                recipe {
                    id
                    name
                }
            }
        }
    }
`;

export const GET_ACTIVE_MEALPLAN_QUERY = gql`
    query GET_ACTIVE_MEALPLAN_QUERY {
        activeMealPlan @client {
            id
            startDate
            endDate
            mealDays {
                id
                date
                recipe {
                    id
                    name
                }
            }
        }
    }
`;

export const GET_CALENDAR_MEALDAYS = gql`
    query GET_CALENDAR_MEALDAYS($date: DateTime) {
        calendarMealDays(date: $date) {
                date
                mealDays {
                mealPlanId
                mealDay {
                    date
                    recipe {
                    name
                    }
                }
            }
        }
    }
`;
