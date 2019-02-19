import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import FoodForm from './FoodForm';
import { ALL_FOODS_QUERY, SINGLE_FOOD_QUERY } from './queries';

export default function UpdateFood(props) {

  const UPDATE_FOOD_MUTATION = gql`
    mutation updateFood($id: ID!, $name: String!, $subName: String, $types: [FoodType!]!, $image: String) {
      updateFood(id: $id, name: $name, subName: $subName, types: $types, image: $image) {
        id
        name
        subName
        types
        image
      }
    }
  `

  const [food, setFood] = useState({});

  const update = (cache, { data: { updateFood } }) => {
    const data = cache.readQuery({ query: ALL_FOODS_QUERY });
    const originalFood = data.foods.find(food => food.id === updateFood.id);
    const indexOfFood = data.foods.indexOf(originalFood);
    data.foods.splice(indexOfFood, 1, updateFood);
    cache.writeQuery({ query: ALL_FOODS_QUERY, data });
  };
  
  return (
    <Query 
      query={SINGLE_FOOD_QUERY}
      variables={{
        id: props.match.params.id
      }}>
      {({ data, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (!data.food) return <p>No Item Found for ID {props.id}</p>;
      
        return (
          <Mutation mutation={UPDATE_FOOD_MUTATION} variables={{ ...food }} update={update}>
            {
              (updateFood, { error, loading }) => (
                <FoodForm 
                  food={data.food}
                  setFoodData={setFood}
                  title='Update Food'
                  submitLabel='Update Food'
                  loading={loading}
                  error={error}
                  onSubmit={async e => {
                    e.preventDefault();
                    await updateFood();
                  }}
                />
              )
            }      
          </Mutation>
        )
      }}
    </Query>
  )
}
