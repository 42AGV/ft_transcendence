export enum Color {
  WARNING = 'text-color-warning',
  SUBMIT = 'text-color-submit',
  ONLINE = 'text-color-online',
  OFFLINE = 'text-color-offline',
  LIGHT = 'text-color-light',
  BACKGROUND = 'text-color-background',
  DARK = 'text-color-dark',
}

export function instanceOfArrayTyped(
  value: object,
  elementChecker: (object: any) => boolean,
): boolean {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every((user) => {
    return elementChecker(user);
  });
} /* maybe this one shouldn't be here */
