import { gameMachine } from './machine';
import { createActorContext } from '@xstate/react';

export const StateMachineContext = createActorContext(gameMachine);
