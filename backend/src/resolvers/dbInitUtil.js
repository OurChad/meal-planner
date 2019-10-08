function createFood(food, foodTyoe, ctx, info) {
  const newFood = {
    name: food.toLowerCase(),
    types: foodTyoe,
  };

  return ctx.db.mutation.createFood({
    data: {
      ...newFood,
      types: {
        set: foodTyoe
      }
    }
  }, info);
}

function initialiseBreadsAndPastries(ctx, info) {
  const breadData = require('../foods/breads_and_pastries.json');

  const breads = breadData.breads.map((bread) => {
    return createFood(bread, ['BREAD', 'BAKED'], ctx, info);
  });

  const pastries = breadData.pastries.map((pastry) => {
    return createFood(pastry, ['BAKED'], ctx, info);
  });

  return [...breads, ...pastries];
}

function initialiseDairyAndCheese(ctx, info) {
  const dairyData = require('../foods/dairy.json');

  const dairies = dairyData.dairy.map((dairy) => {
    return createFood(dairy, ['DAIRY'], ctx, info);
  });

  const cheeseData = require('../foods/cheeses.json');

  const cheeses = cheeseData.cheeses.map((cheese) => {
    return createFood(cheese, ['CHEESE', 'DAIRY'], ctx, info);
  });

  return [...dairies, ...cheeses];
}

function initialiseCondiments(ctx, info) {
  const condimentData = require('../foods/condiments.json');

  return condimentData.condiments.map((condiment) => {
    return createFood(condiment, ['CONDIMENT'], ctx, info);
  });
}

function initialiseFruits(ctx, info) {
  const fruitData = require('../foods/fruits.json');

  return fruitData.fruits.map((fruit) => {
    return createFood(fruit, ['FRUIT'], ctx, info);
  });
}

function initialiseGrains(ctx, info) {
  const grainData = require('../foods/grains.json');

  return grainData.grains.map((grain) => {
    return createFood(grain, ['GRAIN'], ctx, info);
  });
}

function initialiseMeats(ctx, info) {
  const meatData = require('../foods/meats.json');

  return meatData.meats.map((meat) => {
    return createFood(meat, ['MEAT'], ctx, info);
  });
}

function initialiseNuts(ctx, info) {
  const nutData = require('../foods/nuts.json');

  return nutData.nuts.map((nut) => {
    return createFood(nut, ['NUT'], ctx, info);
  });
}

function initialisePastas(ctx, info) {
  const pastaData = require('../foods/pastas.json');

  return pastaData.pastas.map((pasta) => {
    return createFood(pasta, ['PASTA'], ctx, info);
  });
}

function initialiseVegetables(ctx, info) {
  const vegData = require('../foods/vegetables.json');

  return vegData.vegetables.map((vegetable) => {
    return createFood(vegetable, ['VEGETABLE'], ctx, info);
  });
}


exports.initialiseBreadsAndPastries = initialiseBreadsAndPastries;
exports.initialiseDairyAndCheese = initialiseDairyAndCheese;
exports.initialiseCondiments = initialiseCondiments;
exports.initialiseFruits = initialiseFruits;
exports.initialiseGrains = initialiseGrains;
exports.initialiseMeats = initialiseMeats;
exports.initialiseNuts = initialiseNuts;
exports.initialisePastas = initialisePastas;
exports.initialiseVegetables = initialiseVegetables;