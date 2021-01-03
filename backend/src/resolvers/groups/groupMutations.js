const { isUserLoggedAndAuthorised } = require('../../utils');

const groupMutations = {
  async createGroup(parent, {
    group: {
      name, users, owner, isPrivate = false
    }
  }, ctx, info) {
    console.log('******* Begin createGroup, ', name);
    const { id: userId } = isUserLoggedAndAuthorised(ctx);

    const newGroup = await ctx.db.mutation.createGroup({
      data: {
        name,
        isPrivate,
        creator: {
          connect: {
            id: userId
          }
        },
        owner: {
          connect: {
            id: owner || userId
          }
        },
        users: {
          connect: users.map(aUserId => ({ id: aUserId })),
        }
      }
    }, info);

    console.log('******* End createGroup, ', name);
    return newGroup;
  },
  async updateGroup(parent, {
    group: {
      id, name, users, owner, isPrivate = false, mealPlans = []
    }
  }, ctx, info) {
    console.log('******* Begin updateGroup, ', id);
    const { id: userId } = isUserLoggedAndAuthorised(ctx);
    const currentGroup = await ctx.db.query.group({ where: { id } }, '{ owner { id }, users { id }}');

    if (!currentGroup) {
      throw new Error(`Cannot find group with id: ${id}`);
    }

    const { owner: { id: currentOwnerId }, users: currentUsers } = currentGroup;
    const removedUsers = currentUsers.reduce((acc, { id: anUserId }) => {
      if (users.includes(anUserId)) {
        return acc;
      }

      return acc.concat({ id: anUserId });
    }, []);

    const updatedGroup = await ctx.db.mutation.updateGroup({
      data: {
        name,
        isPrivate,
        creator: {
          connect: {
            id: userId
          }
        },
        owner: {
          connect: {
            id: owner || currentOwnerId
          },
        },
        users: {
          connect: users.map(anUserId => ({ id: anUserId })),
          disconnect: removedUsers,
        },
        mealPlans: {
          connect: mealPlans.map(aMealPlanId => ({ id: aMealPlanId })),
        },
      },
      where: {
        id
      }
    }, info);

    console.log('******* End updateGroup, ', id);
    return updatedGroup;
  },
  async deleteGroup(parent, { id }, ctx, info) {
    console.log('******* Begin deleteGroup, ', id);
    const { id: userId } = isUserLoggedAndAuthorised(ctx);
    const { owner: { id: currentOwnerId } } = await ctx.db.query.group({ where: { id } }, '{ owner { id }}');

    if (userId !== currentOwnerId) {
      throw new Error('Unable to delete group!');
    }

    const deletedGroup = await ctx.db.mutation.deleteGroup({
      where: {
        id
      }
    }, info);

    console.log('******* End deleteGroup, ', id);
    return deletedGroup;
  },
};

module.exports = groupMutations;