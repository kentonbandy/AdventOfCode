Array.prototype.splitArray = function(callback) {
  let split = [];
  let current = [];
  for (const item of this) {
    if (callback(item)) {
      if (!current.length) continue;
      split.push(current);
      current = [];
    } else {
      current.push(item);
    }
  }
  if (current.length) split.push(current);
  return split;
}

Array.prototype.count = function(item) {
  return this.reduce((total, current) => total + (current === item), 0);
}

Array.prototype.sum = function() {
  return this.reduce((total, current) => total + current, 0);
}

Array.prototype.product = function() {
  return this.reduce((total, current) => total * current, 1);
}

Array.prototype.hasSameValues = function(arr) {
  if (this.length !== arr.length) return false;
  return this.every(x => arr.includes(x));
}

export default {};