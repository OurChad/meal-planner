export function isUserAdmin(user) {
  return user && user.permissions.includes('ADMIN');
}
