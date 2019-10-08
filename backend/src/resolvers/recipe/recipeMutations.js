const { isUserLoggedAndAdmin } = require('../../utils');

const recipeMutations = {
  async createRecipe(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const { name, ingredients, instructions } = args;
    
    const createIngredients = ingredients.map(({ quantity, quantityType, foodId }) => {
      return {
        quantity,
        quantityType,
        food: {
          connect: {
            id: foodId
          }
        }
      };
    });

    const createdRecipe = await ctx.db.mutation.createRecipe({
      data: {
        name: name.toLowerCase(),
        instructions,
        ingredients: {
          create: createIngredients,
        },
    
        // format for playground mutations
        // ...args,
        // ingredients: {
        //   ...args.ingredients[0]
        // }
      }
    }, info);
    
    return createdRecipe;
  },
  async updateRecipe(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const {
      name, ingredients, instructions 
    } = args;
    const createIngredients = ingredients.create && ingredients.create.map(({ quantity, quantityType, foodId }) => {
      return {
        quantity,
        quantityType,
        food: {
          connect: {                            
            id: foodId
          }
        }
      };
    });
    const updateIngredients = ingredients.update && ingredients.update.map(({
      id, quantity, quantityType, foodId 
    }) => {
      return {
        where: {
          id 
        },
        data: {
          quantity,
          quantityType,
          food: {
            connect: {                            
              id: foodId
            }
          }
        }
      };
    });
    const updatedRecipe = await ctx.db.mutation.updateRecipe({
      where: {
        id: args.id
      },
      data: {
        name: name.toLowerCase(),
        instructions,
        ingredients: {
          create: createIngredients,
          connect: ingredients.connect, // ingredients.filter(ingredient => ingredient.connect).map(id => ({ id })),
          update: updateIngredients,
          delete: ingredients.delete // ingredients.filter(ingredient => ingredient.delete).map(id => ({ id })),
        },
      }
    }, info);
    
    return updatedRecipe;
  },
  async deleteRecipe(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const { id } = args;
    const where = { id };
    const recipe = await ctx.db.query.recipe({ where }, '{ ingredients { id }}');
    
    const deletedRecipe = await ctx.db.mutation.deleteRecipe({ where }, info);
    // delete any associated Ingredients
    await recipe.ingredients.forEach(ingredientId => ctx.db.mutation.deleteIngredient({
      where: ingredientId
    }));
            
    return deletedRecipe;
  },
};

module.exports = recipeMutations;