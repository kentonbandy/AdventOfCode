// thank you Alan Judi
// https://stackoverflow.com/questions/39899072/how-can-i-find-the-prime-factors-of-an-integer-in-javascript/53643340#53643340
export function getPrimeFactors(n) {
  const factors = [];
  let divisor = 2;

  while (n >= 2) {
    if (n % divisor == 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}