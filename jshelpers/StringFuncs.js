String.prototype.sumCount = function(matchArr) {
  let sum = 0;
  for (const match of matchArr) {
    sum += this.split(match).length - 1;
  }
  return sum;
}