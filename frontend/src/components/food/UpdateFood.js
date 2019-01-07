import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import FoodForm from './FoodForm';

export default function UpdateFood(props) {

  const UPDATE_FOOD_MUTATION = gql`
    mutation updateFood($id: ID!, $name: String!, $subName: String, $types: [FoodType!]!, $image: String) {
      updateFood(id: $id, name: $name, subName: $subName, types: $types, image: $image) {
        name
        subName
        types
        image
      }
    }
  `

  const [food, setFood] = useState(props.location.state.food);
  
  return (
    <Mutation mutation={UPDATE_FOOD_MUTATION} variables={{ ...food }}>
      {
        (updateFood, { error, loading }) => (
          <FoodForm 
            food={food}
            setFood={setFood}
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
}
