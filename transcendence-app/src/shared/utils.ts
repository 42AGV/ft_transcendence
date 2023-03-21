import { ConsoleLogger } from '@nestjs/common';

export function loadEsmModule<T>(modulePath: string): Promise<T> {
  return Function(
    'modulePath',
    `return import(modulePath);`,
  )(modulePath) as Promise<T>;
}

export function removeDoubleQuotes(string: string) {
  return string.replace(/^"(.*)"$/, '$1');
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class TranscendenceLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    if (context === 'ExpressAdapter' && message === 'Premature close') {
      return;
    }
    super.error(message, stack, context);
  }
}
