import React from 'react'
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ALL_FOODS_QUERY } from './Foods';

const DELETE_FOOD_MUTATION = gql`
    mutation DELETE_FOOD_MUTATION($id: ID!) {
        deleteFood(id: $id) {
            id
            name
            subName
        }
    }
`
const handleDeleteFood = (deleteFood) => () => {
  if (window.confirm('Are you sure you want to delete this food?')) {
    deleteFood().catch(err => {
      alert(err.message);
    });
  }
}

const update = (cache, payload) => {
  const data = cache.readQuery({ query: ALL_FOODS_QUERY });
  data.foods = data.foods.filter(food => food.id !== payload.data.deleteFood.id);
  cache.writeQuery({ query: ALL_FOODS_QUERY, data });
};

export default function DeleteFood(props) {
  return (
    <Mutation mutation={DELETE_FOOD_MUTATION} variables={{ id: props.id }} update={update}>
      {
        (deleteFood, { error }) => (
          <button onClick={handleDeleteFood(deleteFood)}>
            {props.children}
          </button>
        )
      }
      
    </Mutation>
  )
}
