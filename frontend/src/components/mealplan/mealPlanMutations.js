import gql from 'graphql-tag';

export const CREATE_MEALPLAN_MUTATION = gql`
    mutation createMealPlan($startDate: DateTime!, $endDate: DateTime!, $mealDays: [MealDayCreateInput]) {
        createMealPlan(
            startDate: $startDate
            endDate: $endDate
            mealDays: $mealDays
            ) {
            id
            startDate
            endDate
            mealDays {
                date
                recipe {
                    id
                    name
                }
            }
        }
    }
`;
