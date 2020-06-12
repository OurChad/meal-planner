const { isUserLoggedAndAuthorised } = require('../../utils');

const recipeMutations = {
  async createRecipe(parent, { name, ingredients, instructions }, ctx, info) {
    const { id: userId } = isUserLoggedAndAuthorised(ctx);

    const createIngredients = ingredients.map(({ quantity, quantityType, foodId }) => {
      return {
        quantity,
        quantityType,
        food: {
          connect: {
            id: foodId
          }
        },
      };
    });

    const createdRecipe = await ctx.db.mutation.createRecipe({
      data: {
        name,
        searchName: name.toLowerCase(),
        instructions,
        ingredients: {
          create: createIngredients,
        },
        author: {
          connect: {
            id: userId
          }
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
  async updateRecipe(parent, {
    id, name, ingredients = {}, instructions
  }, ctx, info) {
    isUserLoggedAndAuthorised(ctx);
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
      id: ingredientId, quantity, quantityType, foodId
    }) => {
      return {
        where: {
          id: ingredientId
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
        id
      },
      data: {
        name,
        searchName: name.toLowerCase(),
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
    isUserLoggedAndAuthorised(ctx);
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