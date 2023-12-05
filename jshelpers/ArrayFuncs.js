export default Array.prototype.splitArray = function(callback) {
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