import { registerDecorator } from 'class-validator';
import { GameMode as GameModetype } from 'pong-engine';

const GAME_COMMANDS = [
  'paddleMoveRight',
  'paddleMoveLeft',
  'paddleStop',
  'paddleDrag',
];

const GAME_MODES = ['classic', 'shortPaddle', 'mysteryZone'];

// https://stackoverflow.com/questions/51528780/typescript-check-typeof-against-custom-type
type GameCommandType = (typeof GAME_COMMANDS)[number];

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

export const isGameModeType = (value: string): value is GameModetype =>
  GAME_MODES.includes(value);

export function IsGameMode() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsGameCommand',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'The value passed as command is not a valid game mode',
      },
      validator: {
        validate(value: string) {
          return typeof value === 'string' && isGameModeType(value);
        },
      },
    });
  };
}
