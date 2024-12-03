Object.prototype.isEmpty = function(obj) {
  return !Object.keys(obj).length;
}

Object.prototype.isEqual = function(obj) {
  if (Object.keys(this).length !== Object.keys(obj).length) return false;
  for (const [key, val] of Object.entries(obj)) {
    if (this[key] !== val) return false;
  }
  return true;
}

export default {};
