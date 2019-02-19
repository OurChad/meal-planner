import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import FoodForm from './FoodForm';
import { ALL_FOODS_QUERY } from './queries';


export default function CreateFood(props) {

  const CREATE_FOOD_MUTATION = gql`
    mutation createFood($food: FoodInput!) {
      createFood(food: $food) {
        id
        name
        subName
        types
        image
      }
    }
  `
  const initialState = {
    name: '',
    subName: '',
    types: [],
    image: '',
  };  
  const [food, setFood] = useState(initialState);

  const update = (cache, { data: createFood }) => {
    const data = cache.readQuery({ query: ALL_FOODS_QUERY });
    data.foods.push(createFood);
    cache.writeQuery({ query: ALL_FOODS_QUERY, data });
  };
  
  return (
    <Mutation mutation={CREATE_FOOD_MUTATION} variables={{food}} update={update}>
      {
        (createFood, { error, loading }) => (
          <FoodForm 
            food={food}
            setFoodData={setFood}
            title='Create a New Food'
            submitLabel='Create Food'
            loading={loading}
            error={error}
            onSubmit={async e => {
              e.preventDefault();
              await createFood();
            }}
            resetFormOnSubmit
          />
        )
      }      
    </Mutation>
  )
}
