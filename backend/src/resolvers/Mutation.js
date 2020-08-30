const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const {
  hasPermission, isUserLoggedAndAdmin, capitaliseWords
} = require('../utils');
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
const foodMutations = require('./food/foodMutations');
const ingredientMutations = require('./ingredients/ingredientMutations');
const recipeMutations = require('./recipe/recipeMutations');
const groupMutations = require('./groups/groupMutations');
const mealPlanMutations = require('./mealPlans/mealPlanMutations');

const Mutations = {
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();

    const password = await bcrypt.hash(args.password, 10);

    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info.user
    );

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return {
      token,
      user
    };
  },
  async signin(parent, { email, password }, ctx, info) {

    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid username or password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return {
      token,
      user
    };
  },
  async signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');

    return { message: 'Successfully logged out' };
  },
  async requestReset(parent, args, ctx, info) {

    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }

    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });

    const mailRes = await transport.sendMail({
      from: 'admin@mpdev-dev.tech',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`Your Password Reset Token is here!
        \n\n
        <a href="${process.env
    .FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
    });
    return { message: 'Thanks!' };
  },
  async resetPassword(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword) {
      throw new Error("Yo Passwords don't match!");
    }

    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });

    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }

    const password = await bcrypt.hash(args.password, 10);

    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // 6. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7. Set the JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    // 8. return the new user
    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    // 1.if the user exists and has permission
    if (!ctx.request.user) {
      throw new Error('You must be logged in');
    }

    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    const { permissions } = args;
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { id: args.userId },
      data: {
        permissions: {
          set: permissions
        },
      },
    }, info);

    return updatedUser;
  },
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