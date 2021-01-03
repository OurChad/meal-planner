const { forwardTo } = require('prisma-binding');

const foodQueries = {
  food(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }
    
    return ctx.db.query.food({ where: { id: args.id } }, info);
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
};

module.exports = foodQueries;