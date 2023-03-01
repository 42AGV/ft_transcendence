export function removeDuplicatesFromArray<T extends { [key: string]: unknown }>(
  array: T[],
  key: keyof T,
): T[] {
  return [...new Map(array.map((item) => [item[key], item])).values()];
}
