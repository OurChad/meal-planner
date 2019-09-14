const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }

    return ctx.db.query.user({
      where: {
        id: ctx.request.userId
      }
    }, info);
  },
  users(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }

    // checks if the user has the required permission, otherwise throws an error
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    return ctx.db.query.users({}, info);
  },
  food(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }

    return ctx.db.query.food({where: { id: args.id }}, info);
  },
  foods: forwardTo('db'),
  foodsConnection: forwardTo('db'),
  ingredients: forwardTo('db'),
  ingredientsConnection: forwardTo('db'),
  recipe: forwardTo('db'),
  async recipes(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }
    const recipesQuery = forwardTo('db');
    return await recipesQuery(parent, args, ctx, info);
  },
  mealDay: forwardTo('db'),
  async mealPlan(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }
    const mealPlanQuery = forwardTo('db');
    return await mealPlanQuery(parent, args, ctx, info);
  },
  async mealPlans(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }
    const mealPlansQuery = forwardTo('db');
    return await mealPlansQuery(parent, args, ctx, info);
  },
};

module.exports = Query;
