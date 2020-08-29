import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import MaterialAppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import {
  Input,
  DateRange,
  AddToQueue,
  AddCircleOutline,
  MenuBook,
  Restaurant,
  Menu as MenuIcon,
  Search as SearchIcon
} from '@material-ui/icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import { CURRENT_USER_QUERY } from './auth/authQueries';
import { isUserAdmin } from '../util/UserUtil';

import { theme } from '../style/Theme';

const styles = (materialTheme) => ({
  root: {
    '& a': {
      color: '#fff',
      textShadow: 'none',
      textDecoration: 'none',
    }
  },
  appBar: {
    backgroundColor: theme.primaryColor
  },
  toolbar: materialTheme.mixins.toolbar
});

const ToolBarContainer = styled.div`
    margin: 0 auto;
    width: 1080px;
    max-width: 1080px;
    padding: 1.5rem 0;
    display: flex;
`;

const AppNameContainer = styled.div`
    width: 100%;
`;

const AppName = styled.h1`
    margin: 0 0 1rem 0;

    @media (max-width: 768px) {
        margin: 0 0 1rem 1rem;
    }
`;

const NavButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: true;
    width: 100%;
`;


const StyledLink = styled(Link)`
  color: ${(props) => (props.dark ? props.theme.primaryDark : props.theme.primaryLight)};
  margin-right: 1rem;
  &:last-child {
    margin-right: 0;
  }
`;

function AppBar({ classes }) {
  const history = useHistory();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback((open) => () => {
    setMenuOpen(open);
  }, [setMenuOpen]);

  const { data = {} } = useQuery(CURRENT_USER_QUERY);
  const { me } = data;
  const renderDevLinks = useCallback(() => (isUserAdmin(me) ? (
    <>
      <StyledLink to="/createFood/">Create Food</StyledLink>
    </>
  ) : null));

  const navigateToPage = useCallback((route) => () => {
    toggleMenu(false)();
    history.push(route);
  }, [toggleMenu, history]);

  const renderDevListItemLinks = useCallback(() => (isUserAdmin(me) ? (
    <>
      <ListItem button key="Create Food" onClick={navigateToPage('/createFood')}>
        <ListItemIcon><AddCircleOutline /></ListItemIcon>
        <ListItemText primary="Create Food" />
      </ListItem>
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
      <StyledLink to="/createMealPlan/">Create Meal Plan</StyledLink>
      <StyledLink to="/recipes/">Recipes</StyledLink>
      <StyledLink to="/createRecipe/">Create Recipe</StyledLink>
    </>
  )));

  const renderListItemLinks = useCallback(() => (!me ? (
    <>
      <ListItem button key="Signup" onClick={navigateToPage('/signup')}>
        <ListItemIcon><AddToQueue /></ListItemIcon>
        <ListItemText primary="Signup" />
      </ListItem>
      <ListItem button key="Signin" onClick={navigateToPage('/signin')}>
        <ListItemIcon><Input /></ListItemIcon>
        <ListItemText primary="Signin" />
      </ListItem>
    </>
  ) : (
    <>
      <ListItem button key="Meal Plans" onClick={navigateToPage('/mealPlans/')}>
        <ListItemIcon><Restaurant /></ListItemIcon>
        <ListItemText primary="Meal Plans" />
      </ListItem>
      <ListItem button key="Create Meal Plan" onClick={navigateToPage('/createMealPlan')}>
        <ListItemIcon><DateRange /></ListItemIcon>
        <ListItemText primary="Create Meal Plan" />
      </ListItem>
      <ListItem button key="Recipes" onClick={navigateToPage('/recipes')}>
        <ListItemIcon><SearchIcon /></ListItemIcon>
        <ListItemText primary="Recipes" />
      </ListItem>
      <ListItem button key="Create Recipe" onClick={navigateToPage('/createRecipe')}>
        <ListItemIcon><MenuBook /></ListItemIcon>
        <ListItemText primary="Create Recipe" />
      </ListItem>
    </>
  )));

  return (
    <div className={classes.root}>
      <MaterialAppBar position="static" className={classes.appBar}>
        <ToolBarContainer>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={toggleMenu(true)}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <AppNameContainer>
            <AppName>
              <StyledLink to="/" dark>Nom Noms</StyledLink>
            </AppName>
          </AppNameContainer>
          <NavButtonsContainer className={classes.menuButtonsWrapper}>
            <Hidden smDown>
              {renderLinks()}
              {renderDevLinks()}
            </Hidden>
          </NavButtonsContainer>
        </ToolBarContainer>
      </MaterialAppBar>
      <SwipeableDrawer
        open={menuOpen}
        onClose={toggleMenu(false)}
        onOpen={toggleMenu(true)}
      >
        <div>
          <div className={classes.toolbar} />
          <Divider />
          <List>
            {renderListItemLinks()}
            {renderDevListItemLinks()}
          </List>
        </div>
      </SwipeableDrawer>
    </div>
  );
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppBar);
