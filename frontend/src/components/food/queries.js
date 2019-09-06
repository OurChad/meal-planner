import gql from 'graphql-tag';
import { foodPerPage } from '../../config';

const ALL_FOODS_QUERY = gql`
    query ALL_FOODS_QUERY($skip: Int = 0, $first: Int = ${foodPerPage}) {
        foods(first: $first, skip: $skip, orderBy: name_ASC) {
            id
            name
            subName
            types
            image
        }
    }
`;

const SINGLE_FOOD_QUERY = gql`
    query SINGLE_FOOD_QUERY($id: ID!) {
        food(id: $id) {
            id
            name
            subName
            types
            image
        }
    }
`;

export { ALL_FOODS_QUERY, SINGLE_FOOD_QUERY };
