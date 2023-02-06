import { createMachine } from 'xstate';

interface GameContext {
  gameId: string;
}

export type GameEvent =
  | { type: 'READY' }
  | { type: 'PLAY' }
  | { type: 'END' }
  | { type: 'RETRY' };

export const gameMachine = createMachine<GameContext, GameEvent>({
  predictableActionArguments: true,
  initial: 'start',
  states: {
    start: {
      on: {
        READY: 'play',
      },
    },
    wait: {
      invoke: {
        src: 'handshake',
      },
      on: { PLAY: 'play' },
    },
    play: {
      on: {
        END: 'end',
      },
    },
    end: {
      on: {
        RETRY: 'start',
      },
    },
  },
});
