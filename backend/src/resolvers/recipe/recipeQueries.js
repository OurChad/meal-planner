const { forwardTo } = require('prisma-binding');

const recipeQueries = {
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
}

module.exports = recipeQueries;