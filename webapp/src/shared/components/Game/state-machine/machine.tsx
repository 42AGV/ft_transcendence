import { createMachine } from 'xstate';

export const gameMachine = createMachine({
  predictableActionArguments: true,
  initial: 'start',
  states: {
    start: {
      on: {
        READY: 'wait',
      },
    },
    wait: {
      invoke: {
        src: 'handshake',
        onDone: { target: 'play' },
      },
    },
    play: {
      invoke: {
        src: 'playAction',
        onDone: { target: 'end' },
      },
    },
    end: {
      on: {
        RETRY: 'start',
      },
    },
  },
});
