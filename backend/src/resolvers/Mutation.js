const { isUserLoggedAndAdmin } = require('../utils');
const {
  initialiseBreadsAndPastries,
  initialiseDairyAndCheese,
  initialiseCondiments,
  initialiseFruits,
  initialiseGrains,
  initialiseMeats,
  initialiseNuts,
  initialisePastas,
  initialiseVegetables
} = require('./dbInitUtil');

// mutations
const userMutations = require('./users/userMutations');
const foodMutations = require('./food/foodMutations');
const ingredientMutations = require('./ingredients/ingredientMutations');
const recipeMutations = require('./recipe/recipeMutations');
const groupMutations = require('./groups/groupMutations');
const mealPlanMutations = require('./mealPlans/mealPlanMutations');

const Mutations = {
  ...userMutations,
  ...foodMutations,
  ...ingredientMutations,
  ...recipeMutations,
  ...groupMutations,
  ...mealPlanMutations,

  // DB HELPER FUNCTIONS
  async initialiseBreadsAndPastriesData(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const newBreadAndPastriesPromises = initialiseBreadsAndPastries(ctx, info);
    const newBreadAndPastries = await Promise.all(newBreadAndPastriesPromises);

    return newBreadAndPastries;
  },

  async initialiseDairyAndCheeseData(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const newDairyAndCheesePromises = initialiseDairyAndCheese(ctx, info);
    const newDairyAndCheese = await Promise.all(newDairyAndCheesePromises);

    return newDairyAndCheese;
  },

  async initialiseCondimentsData(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const newCondimentsPromises = initialiseCondiments(ctx, info);
    const newCondiments = await Promise.all(newCondimentsPromises);

    return newCondiments;
  },

  async initialiseFruitsData(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const newFruitsPromises = initialiseFruits(ctx, info);
    const newFruits = await Promise.all(newFruitsPromises);

    return newFruits;
  },

  async initialiseGrainsData(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const newGrainsPromises = initialiseGrains(ctx, info);
    const newGrains = await Promise.all(newGrainsPromises);

    return newGrains;
  },

  async initialiseMeatsData(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const newMeatsPromises = initialiseMeats(ctx, info);
    const newMeats = await Promise.all(newMeatsPromises);

    return newMeats;
  },

  async initialiseNutsData(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const newNutsPromises = initialiseNuts(ctx, info);
    const newNuts = await Promise.all(newNutsPromises);

    return newNuts;
  },

  async initialisePastasData(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const newPastasPromises = initialisePastas(ctx, info);
    const newPastas = await Promise.all(newPastasPromises);

    return newPastas;
  },

  async initialiseVegetableData(parent, args, ctx, info) {
    isUserLoggedAndAdmin(ctx);
    const newVegPromises = initialiseVegetables(ctx, info);
    const newVeg = await Promise.all(newVegPromises);

    return newVeg;
  },
};

module.exports = Mutations;