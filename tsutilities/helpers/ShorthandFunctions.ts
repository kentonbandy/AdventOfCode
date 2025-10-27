export function l<T extends unknown[]>(...args: T): void {
  console.log(...args);
}

export function e<T extends unknown[]>(...args: T): void {
  console.error(...args);
}

export function c(): void {
  console.clear();
}
