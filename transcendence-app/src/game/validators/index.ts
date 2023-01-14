import { registerDecorator } from 'class-validator';

const GAME_COMMANDS = [
  'paddleMoveRight',
  'paddleMoveLeft',
  'paddleStop',
  'paddleDrag',
];

// https://stackoverflow.com/questions/51528780/typescript-check-typeof-against-custom-type
type GameCommandType = typeof GAME_COMMANDS[number];

const isGameCommandType = (value: string): value is GameCommandType =>
  GAME_COMMANDS.includes(value);

export function IsGameCommand() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsGameCommand',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'The value passed as command is not a valid game command',
      },
      validator: {
        validate(value: string) {
          return typeof value === 'string' && isGameCommandType(value);
        },
      },
    });
  };
}
