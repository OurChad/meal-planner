const { isUserLoggedAndAdmin, propsToLowerCase } = require('../../utils');

const foodMutations = {
  async createFood(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const { food } = args;
    const foodWithDBFormat = propsToLowerCase(food, ['name', 'subname']);
    const newFood = await ctx.db.mutation.createFood({
      data: {
        ...food,
        searchName: food.name.toLowerCase(),
        types: {
          set: foodWithDBFormat.types
        }
      }
    }, info);

    return newFood;
  },

  async updateFood(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    
    const food = { ...args };
    delete food.id;
    
    const updatedFood = await ctx.db.mutation.updateFood({
      where: {
        id: args.id
      },
      data: {
        ...food,
        searchName: food.name.toLowerCase(),
        types: {
          set: food.types
        }
      }
    }, info);

    return updatedFood;
  },

  async deleteFood(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const deletedFood = await ctx.db.mutation.deleteFood({
      where: {
        id: args.id
      },
    }, info);

    return deletedFood;
  },
};

module.exports = foodMutations;