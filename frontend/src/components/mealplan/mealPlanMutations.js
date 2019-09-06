import gql from 'graphql-tag';

export const CREATE_MEALPLAN_MUTATION = gql`
    mutation createMealPlan($data: MealPlanCreateInput!) {
        createMealPlan(
            data: $data
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
