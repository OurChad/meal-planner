import gql from 'graphql-tag';

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
