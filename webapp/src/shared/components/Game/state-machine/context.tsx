import * as React from 'react';
import { useMachine } from '@xstate/react';
import { gameMachine } from './machine';
import {
  StateFrom,
  AnyStateMachine,
  InterpreterFrom,
  Prop,
  ServiceMap,
} from 'xstate';

type StateMachineContextType = {
  state: StateFrom<AnyStateMachine>;
  send: Prop<InterpreterFrom<AnyStateMachine>, 'send'>;
};

type StateMachineContextProps = {
  children: React.ReactNode;
  services?: {
    [key in string]: () => Promise<string>;
  };
};

const StateMachineContext = React.createContext<
  StateMachineContextType | undefined
>(undefined);

export const StateMachineContextProvider = ({
  children,
  services,
}: StateMachineContextProps) => {
  const [state, send] = useMachine(gameMachine, {
    services: {
      ...services,
    },
  });

  return (
    <StateMachineContext.Provider value={{ state, send }}>
      {children}
    </StateMachineContext.Provider>
  );
};

export function useStateMachineContext() {
  const context = React.useContext(StateMachineContext);
  if (context === undefined) {
    throw new Error(
      'useGameStateContext must be within GameStateContextProvider',
    );
  }
  return context;
}
