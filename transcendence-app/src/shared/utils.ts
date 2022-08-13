export function loadEsmModule<T>(modulePath: string): Promise<T> {
  return Function(
    'modulePath',
    `return import(modulePath);`,
  )(modulePath) as Promise<T>;
}
