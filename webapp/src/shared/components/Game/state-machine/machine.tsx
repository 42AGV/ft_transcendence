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
