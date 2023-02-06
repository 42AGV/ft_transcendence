import { GameState } from 'pong-engine';

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

export type WsException = {
  status: string;
  message: string;
};

export type Query = {
  search?: string;
  offset?: number;
};

export type Avatar = {
  avatarId: string;
  avatarX: number;
  avatarY: number;
};

type PlayState = 'playing' | 'paused';

export type GameInfo = {
  gameState: GameState;
  playState: PlayState;
  playerOneId: string;
  playerTwoId: string;
};
