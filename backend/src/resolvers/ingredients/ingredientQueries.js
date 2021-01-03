const { forwardTo } = require('prisma-binding');
const { isSameDay } = require('date-fns');
const { hasPermission, isUserLoggedAndAuthorised, getCalendarDays } = require('../../utils');

const ingredientQueries = {
  ingredients: forwardTo('db'),
  ingredientsConnection: forwardTo('db'),
}

module.exports = ingredientQueries;