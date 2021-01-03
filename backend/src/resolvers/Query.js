const userQueries = require('./users/userQueries');
const foodQueries = require('./food/foodQueries');
const ingredientQueries = require('./ingredients/ingredientQueries');
const recipeQueries = require('./recipe/recipeQueries');
const mealPlanQueries = require('./mealPlans/mealPlanQueries');
const groupQueries = require('./groups/groupQueries');

const Query = {
  ...userQueries,
  ...foodQueries,
  ...ingredientQueries,
  ...recipeQueries,
  ...mealPlanQueries,
  ...groupQueries,
};

module.exports = Query;
