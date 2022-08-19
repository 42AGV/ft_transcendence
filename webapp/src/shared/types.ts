export enum Color {
  WARNING = 'text-color-warning',
  SUBMIT = 'text-color-submit',
  ONLINE = 'text-color-online',
  OFFLINE = 'text-color-offline',
  LIGHT = 'text-color-light',
  BACKGROUND = 'text-color-background',
  DARK = 'text-color-dark',
}

export type Position = {
  x: number;
  y: number;
};

export function instanceOfArrayTyped(
  array: object,
  elementChecker: (object: any) => boolean,
): boolean {
  if (!Array.isArray(array)) {
    return false;
  }
  return array.every((element) => elementChecker(element));
} /* maybe this one shouldn't be here */
