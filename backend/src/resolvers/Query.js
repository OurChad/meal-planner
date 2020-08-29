const { forwardTo } = require('prisma-binding');
const { isSameDay } = require('date-fns');
const { hasPermission, isUserLoggedAndAuthorised, getCalendarDays } = require('../utils');

const Query = {
  me(parent, args, ctx, info) {
    // check if there is a current user ID
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
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }

    // checks if the user has the required permission, otherwise throws an error
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    return ctx.db.query.users({}, info);
  },
  food(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }

    return ctx.db.query.food({ where: { id: args.id } }, info);
  },
  foods(parent, { searchTerm = '' }, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }

    return ctx.db.query.foods({
      where: {
        OR: [
          {
            searchName_contains: searchTerm.toLowerCase()
          },
          {
            subName_contains: searchTerm
          }
        ]
      }
    }, info);
  },
  foodsConnection: forwardTo('db'),
  ingredients: forwardTo('db'),
  ingredientsConnection: forwardTo('db'),
  recipe: forwardTo('db'),
  recipes(parent, { searchTerm }, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }

    return ctx.db.query.recipes({
      where: {
        searchName_contains: searchTerm.toLowerCase()
      }
    }, info);
  },
  mealDay: forwardTo('db'),
  mealPlan(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }
    const mealPlanQuery = forwardTo('db');
    return mealPlanQuery(parent, args, ctx, info);
  },
  mealPlans(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }
    const mealPlansQuery = forwardTo('db');
    return mealPlansQuery(parent, args, ctx, info);
  },
  async calendarMealDays(parent, { date }, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.user) {
      throw new Error('You must be logged in.');
    }
    const calendarDays = getCalendarDays(new Date(date));
    // console.log('***** Query - calendarDays: ', calendarDays);
    const startDate = calendarDays[0].toISOString();
    const endDate = calendarDays.slice(-1)[0].toISOString();
    const mealPlansQuery = {
      where: {
        OR: [
          {
            startDate_gte: startDate,
            startDate_lte: endDate
          },
          {
            endDate_gte: startDate,
            endDate_lte: endDate
          }
        ]
      },
      orderBy: 'startDate_DESC'
    };
    const mealPlans = await ctx.db.query.mealPlans(mealPlansQuery, `
      {
        id,
        startDate
        endDate
        mealDays {
            id
            date
            recipe {
                id
                name
            }
        }
      }
    `);
    const allCalendarDays = calendarDays.map(calendarDate => ({ date: new Date(calendarDate), mealDays: [] }));

    mealPlans.forEach(mealPlan => {
      mealPlan.mealDays.forEach(mealDay => {
        const calendarDayIndex = allCalendarDays.findIndex(calendarDate => {
          return isSameDay(new Date(calendarDate.date), new Date(mealDay.date));
        });

        const calendarDay = allCalendarDays[calendarDayIndex];
        const newMealDay = {
          mealPlanId: mealPlan.id,
          mealDay
        };
        const newCalendarDay = {
          ...calendarDay,
          mealDays: calendarDay.mealDays.concat(newMealDay)
        };

        allCalendarDays.splice(calendarDayIndex, 1, newCalendarDay);
      });
    });

    return allCalendarDays;
  },
  groups(parent, args, ctx, info) {

    if (!isUserLoggedAndAuthorised(ctx)) {
      throw new Error('You must be logged in.');
    }

    const groupsQuery = forwardTo('db');
    return groupsQuery(parent, args, ctx, info);
  },
  group(parent, { id }, ctx, info) {

    if (!isUserLoggedAndAuthorised(ctx)) {
      throw new Error('You must be logged in.');
    }

    return ctx.db.query.group({
      where: {
        id
      }
    }, info);
  },
};

module.exports = Query;
