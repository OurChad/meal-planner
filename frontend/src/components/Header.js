import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledHeader = styled.header`
  background: ${(props) => props.theme.primaryGreen};
  margin-bottom: 1.5rem;
`;

const HeaderContentContainer = styled.div`
  margin: 0 auto;
  max-width: 960px;
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

const Header = () => (
  <StyledHeader>
    <HeaderContentContainer>
      <AppName>
        <StyledLink to="/" dark>Nom Noms</StyledLink>
      </AppName>
      <StyledLink to="/users/">Users</StyledLink>
      <StyledLink to="/signup/">Signup</StyledLink>
      <StyledLink to="/signin/">Signin</StyledLink>
      <StyledLink to="/createFood/">Create Food</StyledLink>
      <StyledLink to="/foods/">Foods</StyledLink>
      <StyledLink to="/createRecipe/">Create Recipe</StyledLink>
      <StyledLink to="/createMealPlan/">Create Meal Plan</StyledLink>
    </HeaderContentContainer>
  </StyledHeader>
);

Header.propTypes = {
  // siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: '',
};

export default Header;
