export function arrayOfLength<T = unknown>(length: number): T[] {
  return [...Array(length)]
}
