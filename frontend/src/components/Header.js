import React, { useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './auth/authQueries';
import { isUserAdmin } from '../util/UserUtil';

const StyledHeader = styled.header`
  background: ${(props) => props.theme.primaryColor};
  margin-bottom: 1.5rem;
`;

const HeaderContentContainer = styled.div`
  margin: 0 auto;
  max-width: 1080px;
  padding: 1.5rem 1rem;
`;

const AppName = styled.h1`
  margin: 0 0 1rem 0;
`;

const StyledLink = styled(Link)`
  color: ${(props) => (props.dark ? props.theme.primaryDark : props.theme.primaryLight)};
  margin-right: 1rem;
  &:last-child {
    margin-right: 0;
  }
`;

const Header = () => {
  const { data = {} } = useQuery(CURRENT_USER_QUERY);
  const { me } = data;
  const renderDevLinks = useCallback(() => (isUserAdmin(me) ? (
    <>
      <StyledLink to="/createMealPlan/">Create Meal Plan</StyledLink>
      <StyledLink to="/createFood/">Create Food</StyledLink>
      <StyledLink to="/foods/">Foods</StyledLink>
    </>
  ) : null));

  const renderLinks = useCallback(() => (!me ? (
    <>
      <StyledLink to="/signup/">Signup</StyledLink>
      <StyledLink to="/signin/">Signin</StyledLink>
    </>
  ) : (
      <>
        <StyledLink to="/mealPlans/">Meal Plans</StyledLink>
        <StyledLink to="/createRecipe/">Create Recipe</StyledLink>
      </>
    )));

  return (
    <StyledHeader>
      <HeaderContentContainer>
        <AppName>
          <StyledLink to="/" dark>Nom Noms</StyledLink>
        </AppName>
        {renderLinks()}
        {renderDevLinks()}
      </HeaderContentContainer>
    </StyledHeader>
  );
};

export default Header;
