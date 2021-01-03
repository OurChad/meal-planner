const { forwardTo } = require('prisma-binding');
const { isSameDay } = require('date-fns');
const { getCalendarDays } = require('../../utils');

const mealPlanQueries = {
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
}

module.exports = mealPlanQueries;