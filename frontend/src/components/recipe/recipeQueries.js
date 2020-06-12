import gql from 'graphql-tag';

export const GET_RECIPE_BY_ID = gql`
    query GET_RECIPE_BY_ID($id: ID!) {
        recipe(where: { id: $id }) {
            id
            name
            ingredients {
                id
                food {
                    id
                    name
                    subName
                }
                quantity
                quantityType
            }
            instructions
        }
    }
`;
