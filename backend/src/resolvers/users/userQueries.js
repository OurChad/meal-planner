const { hasPermission } = require('../../utils');

const userQueries = {
    me(parent, args, ctx, info) {
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
        if (!ctx.request.user) {
          throw new Error('You must be logged in.');
        }
    
        // checks if the user has the required permission, otherwise throws an error
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    
        return ctx.db.query.users({}, info);
      },
}

module.exports = userQueries;