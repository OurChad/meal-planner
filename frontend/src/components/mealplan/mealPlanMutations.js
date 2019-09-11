import gql from 'graphql-tag';

export const CREATE_MEALPLAN_MUTATION = gql`
    mutation createMealPlan($startDate: DateTime!, $endDate: DateTime!, $mealDays: [MealDayCreateUpdateInput]) {
        createMealPlan(
            startDate: $startDate
            endDate: $endDate
            mealDays: $mealDays
            ) {
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

export const UPDATE_MEALPLAN_MUTATION = gql`
    mutation updateMealPlan($id: ID!, $startDate: DateTime!, $endDate: DateTime!, $mealDays: [MealDayCreateUpdateInput], $deletedMealDays: [ID]) {
        updateMealPlan(
            id: $id
            startDate: $startDate
            endDate: $endDate
            mealDays: $mealDays
            deletedMealDays: $deletedMealDays
            ) {
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
