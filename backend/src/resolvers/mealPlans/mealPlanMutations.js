const { isUserLoggedAndAuthorised } = require('../../utils');

const mealPlanMutations = {
  async createMealPlan(parent, {
    mealPlan: {
      startDate, endDate, user, group, mealDays
    }
  }, ctx, info) {
    isUserLoggedAndAuthorised(ctx);

    const mappedMealDays = mealDays.reduce((acc, { date, recipe = {} }) => {
      const { id, name } = recipe;
      let recipeInput = {};
      if (id) {
        recipeInput = { connect: { id } };
      } else if (name) {
        recipeInput = { create: { name } };
      }
      //   const recipeConnection = recipe ? { recipe: { connect: { id: recipe.id } } } : {};
      const mealDayForAPI = {
        date,
        recipe: {
          ...recipeInput
        }
      };
      const create = [...acc.create, mealDayForAPI];
      return {
        create
      };
    }, { create: [] });

    const data = {
      data: {
        startDate,
        endDate,
        mealDays: mappedMealDays,
        user: user ? {
          connect: {
            id: user
          }
        } : undefined,
        group: group ? {
          connect: {
            id: group
          }
        } : undefined,
      }
    };

    const createdMealPlan = await ctx.db.mutation.createMealPlan(
      data, info
    );

    return createdMealPlan;
  },
  async updateMealPlan(parent, {
    mealPlan: {
      id, startDate, endDate, user, group, mealDays, deletedMealDays = []
    }
  }, ctx, info) {
    isUserLoggedAndAuthorised(ctx);

    const initialMealDaysUpdated = {
      create: [],
      update: [],
      delete: deletedMealDays.map(deletedMealDay => ({ id: deletedMealDay })),
    };

    const mealDaysCreateUpdateData = await mealDays.reduce(async (accPromise, { id: mealDayID, date, recipe }) => {
      const acc = await accPromise;
      let recipeInput = {};
        
      if (!recipe && mealDayID) {
        const where = { id: mealDayID };
        const existingMealDay = await ctx.db.query.mealDay({ where }, '{ recipe { id } }');
        recipeInput = existingMealDay.recipe ? { recipe: { disconnect: true } } : {};
      } else if (recipe) {
        const { id: recipeId, name } = recipe;
        if (recipeId) {
          recipeInput = { connect: { id: recipeId } };
        } else if (name) {
          recipeInput = { create: { name } };
        }
        // recipeInput = { recipe: { connect: { id: recipe.id } } };
      }

      const mealDayData = {
        date,
        recipe: {
          ...recipeInput,
        }
      };

      if (mealDayID) {
        const updatedMealDay = {
          where: {
            id: mealDayID
          },
          data: mealDayData
        };

        return {
          ...acc,
          update: acc.update.concat(updatedMealDay)
        };
      }

      return {
        ...acc,
        create: acc.create.concat(mealDayData)
      };
    }, Promise.resolve(initialMealDaysUpdated));

    const mealDaysUpdated = {
      ...mealDaysCreateUpdateData,
    };

    const mealPlanUpdateData = {
      where: {
        id
      },
      data: {
        startDate,
        endDate,
        mealDays: mealDaysUpdated,
        user: user ? {
          connect: {
            id: user
          }
        } : undefined,
        group: group ? {
          connect: {
            id: group
          }
        } : undefined,
      },
    };

    const updatedMealPlan = await ctx.db.mutation.updateMealPlan(
      mealPlanUpdateData, info
    );

    return updatedMealPlan;
  },
};

module.exports = mealPlanMutations;