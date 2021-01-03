const { forwardTo } = require('prisma-binding');
const { isUserLoggedAndAuthorised } = require('../../utils');

const groupQueries = {
  groups(parent, args, ctx, info) {

    if (!isUserLoggedAndAuthorised(ctx)) {
      throw new Error('You must be logged in.');
    }
    
    const groupsQuery = forwardTo('db');
    return groupsQuery(parent, args, ctx, info);
  },
  group(parent, { id }, ctx, info) {
    
    if (!isUserLoggedAndAuthorised(ctx)) {
      throw new Error('You must be logged in.');
    }
    
    return ctx.db.query.group({
      where: {
        id
      }
    }, info);
  },
};

module.exports = groupQueries;