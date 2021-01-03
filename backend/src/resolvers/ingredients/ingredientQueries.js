const { forwardTo } = require('prisma-binding');

const ingredientQueries = {
  ingredients: forwardTo('db'),
  ingredientsConnection: forwardTo('db'),
};

module.exports = ingredientQueries;