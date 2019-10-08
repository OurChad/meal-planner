const { isUserLoggedAndAdmin } = require('../../utils');

const ingredientMutations = {
  async createIngredient(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const { quantity, quantityType, foodId } = args;
    const createdIngredient = await ctx.db.mutation.createIngredient({
      data: {
        quantity,
        quantityType,
        food: {
          connect: {
            id: foodId,
          }
        }
      }
    }, info);
    
    return createdIngredient;
  },
  async updateIngredient(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const {
      id, quantity, quantityType, foodId 
    } = args;
    const updatedIngredient = await ctx.db.mutation.updateIngredient({
      where: {
        id: id,
      },
      data: {
        quantity,
        quantityType,
        food: {
          connect: {
            id: foodId,
          }
        }
      }
    }, info);
    
    return updatedIngredient;
  },
  async deleteIngredient(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const deletedIngredient = await ctx.db.mutation.deleteIngredient({
      where: {
        id: args.id,
      },
    }, info);
    
    return deletedIngredient;
  },
};

module.exports = ingredientMutations;