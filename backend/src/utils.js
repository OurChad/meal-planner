function hasPermission(user, permissionsNeeded) {
    const matchedPermissions = user.permissions.filter(permissionTheyHave =>
      permissionsNeeded.includes(permissionTheyHave)
    );
    if (!matchedPermissions.length) {
      throw new Error(`You do not have sufficient permissions
  
        : ${permissionsNeeded}
  
        You Have:
  
        ${user.permissions}
        `);
    }
  }

  function createFoods(foods, types) {
    const newFoods = foods.map(food => {
        const newFood = {
            name: food,
            types
        }

        if (food === 'tomato' && types.contains('FRUIT')) {
            newFood.types.push('VEGETABLE');
        }

        return newFood;
    })

    return newFoods;
  }

  function isUserLoggedIn(user) {
    if (!user) {
        throw new Error("You must be logged in");
    }
  }

  function isUserAdmin(user) {
    hasPermission(user, ['ADMIN']);
  }
  
  function capitaliseWords(words) {
    const allWords = words.split(' ');

    return allWords.reduce((acc, word) => {
      const capitalised = word.charAt(0).toUpperCase() + word.slice(1)
      return acc.concat(' ' + capitalised);
    }, '').trimStart();
  }

  exports.hasPermission = hasPermission;
  exports.isUserLoggedIn = isUserLoggedIn;
  exports.isUserAdmin = isUserAdmin;
  exports.capitaliseWords = capitaliseWords;