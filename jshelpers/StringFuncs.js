String.prototype.sumCount = function(matchArr) {
  let sum = 0;
  for (const match of matchArr) {
    sum += this.split(match).length - 1;
  }
  return sum;
}

// returns an array of the indices containing the char
String.prototype.indicesOf = function(char) {
  return this.split("").reduce((a, c, i) => {
    if (c === char) a.push(i);
    return a;
  }, []);
}

String.prototype.rstrip = function (char = " ") {
  let str = this;
  while (str.endsWith(char)) {
    str = str.slice(0, str.length - 1);
  }
  return str;
}