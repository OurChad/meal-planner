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
  foods(parent, { searchTerm = '' }, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }

    return ctx.db.query.foods({
      where: { 
        OR: [
          { 
            searchName_contains: searchTerm.toLowerCase() 
          }, 
          { 
            subName_contains: searchTerm 
          }
        ] 
      }
    }, info);
  },
  foodsConnection: forwardTo('db'),
  ingredients: forwardTo('db'),
  ingredientsConnection: forwardTo('db'),
  recipe: forwardTo('db'),
  recipes(parent, { searchTerm }, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }

    return ctx.db.query.recipes({
      where: {
        searchName_contains: searchTerm.toLowerCase() 
      }
    }, info);
  },
  mealDay: forwardTo('db'),
  mealPlan(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }
    const mealPlanQuery = forwardTo('db');
    return mealPlanQuery(parent, args, ctx, info);
  },
  mealPlans(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }
    const mealPlansQuery = forwardTo('db');
    return mealPlansQuery(parent, args, ctx, info);
  },
};

module.exports = Query;
