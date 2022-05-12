import { assign, createMachine } from 'xstate';
import { doMath, isValidInput } from './third';

export default createMachine({
  context: { input: '', result: '' },
  id: 'calculator',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CLEAR: 'cleared',
        CALCULATE: {
          cond: (context, event) => isValidInput(context.input + event.input),
          target: 'calculated',
        },
        INPUT: {
          cond: (context, event) => isValidInput(context.input + event.input),
          target: 'inputting',
        },
      },
    },
    inputting: {
      entry: assign({
        input: (context, event) => context.input + event.input,
      }),
      always: 'idle',
    },
    cleared: {
      entry: assign({
        result: () => '',
      }),
      always: 'idle',
    },
    calculated: {
      entry: assign({
        result: (context, event) => doMath(context.input),
      }),
      always: 'idle',
    },
  },
});
