/**
 * Returns the count of elements equal to the passed item in the passet array
 */
export function arrayCount<T>(array: Array<T>, item: T): number {
  return array.reduce((total, current) => total + (current === item ? 1 : 0), 0);
}

/**
 * returns a sum of the items of the array
 */
export function arraySum(array: number[]): number {
  return array.reduce((total, current) => total + current, 0);
}

/**
 * returns the product of the items in the array
 */
export function arrayProduct(array: number[]) {
  return array.reduce((total, current) => total * current, 1);
}
