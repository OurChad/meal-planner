const { subMonths, addMonths, eachDayOfInterval } = require('date-fns');

function getRequestUser(ctx) {
  const { request: { user } } = ctx;

  return user;
}

function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave => permissionsNeeded.includes(permissionTheyHave));
  if (!matchedPermissions.length) {
    throw new Error(`You do not have sufficient permissions
  
        : ${permissionsNeeded}
  
        You Have:
  
        ${user.permissions}
        `);
  }
}

function isUserLoggedIn(user) {
  if (!user) {
    throw new Error('You must be logged in');
  }
}

function isUserAdmin(user) {
  hasPermission(user, ['ADMIN']);
}

function isUserLoggedAndAdmin(ctx) {
  const user = getRequestUser(ctx);

  isUserLoggedIn(user);

  return isUserAdmin(user);
}

function isUserLoggedAndAuthorised(ctx) {
  const user = getRequestUser(ctx);

  isUserLoggedIn(user);

  return user;
}

function capitaliseWords(words) {
  const allWords = words.split(' ');

  return allWords.reduce((acc, word) => {
    const capitalised = word.charAt(0).toUpperCase() + word.slice(1);
    return acc.concat(` ${capitalised}`);
  }, '').trimStart();
}

function propsToLowerCase(obj, props) {
  return Object.keys(obj).reduce((acc, key) => {
    if (props.includes(key)) {
      return {
        ...acc,
        [key]: obj[key].toLowerCase(),
      };
    }

    return acc;
  }, {});
}

function getCalendarDays(middleDate = new Date()) {
  const start = subMonths(middleDate, 1);
  const end = addMonths(middleDate, 1);

  return eachDayOfInterval({ start, end });
}

exports.getRequestUser = getRequestUser;
exports.hasPermission = hasPermission;
exports.isUserLoggedIn = isUserLoggedIn;
exports.isUserAdmin = isUserAdmin;
exports.isUserLoggedAndAdmin = isUserLoggedAndAdmin;
exports.isUserLoggedAndAuthorised = isUserLoggedAndAuthorised;
exports.capitaliseWords = capitaliseWords;
exports.propsToLowerCase = propsToLowerCase;
exports.getCalendarDays = getCalendarDays;