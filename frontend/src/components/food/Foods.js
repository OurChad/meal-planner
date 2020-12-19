import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { foodPerPage } from '../../config';
import DeleteFood from './DeleteFood';
import { ALL_FOODS_QUERY } from './queries';

const FoodsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
`;

const Food = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    background-color: ${(props) => props.theme.green};
    text-align: center;
    font-size: ${(props) => props.theme.largeFont};
    min-height: 20vh;
    #subName {
        font-weight: bold;
        font-size: ${(props) => props.theme.medFont};
    };    
`;

export default function Foods(props) {
  return (
    <Query
      query={ALL_FOODS_QUERY}
      variables={
        {
          skip: (props.page || 1) * foodPerPage - foodPerPage
        }
      }
    >
      {({ data, error, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (error) {
          return (
            <p>
              Error:
              {error.message}
            </p>
          );
        }
        return (
          <FoodsList>
            {data.foods.map((food) => (
              <Food key={food.id}>
                <Link to={{ pathname: `/foods/${food.id}` }}>
                  <div id="name">{food.name}</div>
                  <div id="subName">{food.subName}</div>
                </Link>
                <DeleteFood id={food.id}>Delete</DeleteFood>
              </Food>
            )
            )}
          </FoodsList>
        );
      }}
    </Query>
  );
}

export { ALL_FOODS_QUERY };
