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
    /**
     * When using StreamableFile to stream user avatars efficiently, it's
     * possible for clients to prematurely close the connection while the
     * server is streaming the file. This can trigger a 'Premature close'
     * error in Node.js. However, this behavior is expected and does not
     * indicate a server error. To minimize false error noise and improve
     * overall system reliability, we've disabled this error in our Console
     * logger class.
     *
     */
    if (context === 'ExpressAdapter' && message === 'Premature close') {
      return;
    }
    super.error(message, stack, context);
  }
}
