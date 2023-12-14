// splits this on items where the callback returns true, returning an array of arrays
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

// returns a count of how many times the given item is found in the array
Array.prototype.count = function(item) {
  return this.reduce((total, current) => total + (current === item), 0);
}

// returns a sum of the items of the array
Array.prototype.sum = function() {
  return this.reduce((total, current) => total + current, 0);
}


// returns the product of the items in the array
Array.prototype.product = function() {
  return this.reduce((total, current) => total * current, 1);
}

// compares this with another array and returns true if they contain the same values
// regardless of order
Array.prototype.hasSameValues = function(arr) {
  if (this.length !== arr.length) return false;
  return this.every(x => arr.includes(x));
}

// returns an array with the item moved, doesn't mutate this
Array.prototype.moveItem = function(from, to) {
  const newArr = [...this];
  newArr.splice(to,0,newArr.splice(from,1)[0]);
  return newArr;
}

export default {};