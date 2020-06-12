import gql from 'graphql-tag';

export const CREATE_MEALPLAN_MUTATION = gql`
    mutation createMealPlan($mealPlan: MealPlanCreateInput) {
        createMealPlan(
            mealPlan: $mealPlan
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
    mutation updateMealPlan($mealPlan: MealPlanUpdateInput) {
        updateMealPlan(
            mealPlan: $mealPlan
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
