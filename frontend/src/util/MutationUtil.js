import { pickBy } from 'lodash';

function removeTypeNameProperty(value, key) {
  return key !== '__typename';
}

export function cloneWithoutTypeName(obj) {
  return pickBy(obj, removeTypeNameProperty);
}
