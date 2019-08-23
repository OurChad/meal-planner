import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ALL_FOODS_QUERY } from './queries';

const DELETE_FOOD_MUTATION = gql`
    mutation DELETE_FOOD_MUTATION($id: ID!) {
        deleteFood(id: $id) {
            id
            name
            subName
        }
    }
`;

const update = (cache, payload) => {
  const data = cache.readQuery({ query: ALL_FOODS_QUERY });
  data.foods = data.foods.filter((food) => food.id !== payload.data.deleteFood.id);
  cache.writeQuery({ query: ALL_FOODS_QUERY, data });
};

const DeleteFood = ({ id, children }) => {
  const handleDeleteFood = useCallback((deleteFood) => () => {
    if (window.confirm('Are you sure you want to delete this food?')) {
      deleteFood().catch((err) => {
        alert(err.message);
      });
    }
  }, [id]);

  return (
    <Mutation mutation={DELETE_FOOD_MUTATION} variables={{ id }} update={update}>
      {
        (deleteFood, { error }) => (
          <button onClick={handleDeleteFood(deleteFood)}>
            {children}
          </button>
        )
      }
    </Mutation>
  );
};

DeleteFood.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired
};

export default DeleteFood;
