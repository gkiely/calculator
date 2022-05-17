import { assign, createMachine } from 'xstate';
import { doMath, isValidInput } from '../utils';

// ------ Machine ------

/**
 * For testing in the browser
  const doMatch = () => '';
  const isValidInput = () => true;
 */

export default /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAbZBXdqAuA9gE4B0AlhOmAMTJWpGKgAOBsZeZBAdkyAB6IAzCQCcogCwBGIQHZZAJikSVE0QFZ1AGhABPRMpKzpyoQDZZU2aNnqJ6gL4OdaTDnzFylGq+y48YHys7Jw8fIIIIuLScorKqhraeogK9kbSAAzqZhkAHFIKGWZmTi4Yfh6kFFTUZNzMWHhBbBxcvEgCwmKSMvJKqmqaOvoIALRS6lIkCuq5+XlColLFQqUgvu6EVd7UAGZgeMgAFs0hbeFd0b1xA4nDBmrpUlJFEhkaGVKiuWsb-p7oAioCB1KDUCA8MDkbgANwIAGsoX9KiRAcDQQg6nC0KFuABtDIAXVOrTCHQib2mtkWKlEZjesiECnuCDMCiez1y6gysnp4l+5U2njqDTwnG4YJJuIuY1m0xs6lECmKSiE9iSI1GhXUJByslyojkGQUvLmP2c60F-1IdDADEg1Cl53JiFysl1jNyhVyxWeBVkLNGQhEMzmQme9KyEnyArc1pIyICEEdHWCpPaoAibo9clERUKxniLK+7sLeQK9iEdlWa24BAgcD4ieF3idZMziC1uQyJEW6nDlnsZjNLPDJG7XzVmgU4i5xljFS2qKBIIlbYznQQUjm3Wkb2UL2MPOLxpIDOMEnMTKE7wXQqq9Ua4qg65l29yu+Un0yR4DyTGywiIqSiyBkEhmLMPL6ne8a2vaECvi6W47lc+4-gygZMiQwFKLkcgqIy-YwSiiaQIhHbIR+qHfoeGH-gowZnjyZh0vYQ6TDWZRxpU5GbkGYG9hoA7KNkI7-lq+q6jyebhosTISMqThOEAA */
createMachine<{
  input: string;
  result: string;
  buttonText?: number;
}>({
  context: {
    input: '',
    result: '',
    buttonText: 3,
  },
  id: 'calculator',
  initial: 'idle',
  states: {
    idle: {
      on: {
        clear: 'cleared',
        calculate: {
          cond: (context, event) => isValidInput(context.input + event.payload),
          target: 'calculated',
        },
        input: {
          cond: (context, event) => isValidInput(context.input + event.payload),
          target: 'inputting',
        },
        fetch: 'loading',
      },
    },
    loading: {
      invoke: {
        src: (context, event) => fetch('https://jsonplaceholder.typicode.com/users/1').then((res) => res.json()),
        onError: 'failure',
        onDone: {
          target: 'success',
          actions: [
            assign({
              buttonText: (context, event) => {
                debugger;
                return event.data.id;
              },
            }),
          ],
        },
      },
    },
    inputting: {
      entry: assign({
        result: (context) => {
          const prevChar = context.input[context.input.length - 1];
          return prevChar === '=' ? '' : context.result;
        },
        input: (context, event) => {
          const prevChar = context.input[context.input.length - 1];
          if (prevChar === '=') {
            return context.result + event.payload;
          }
          return context.input + event.payload;
        },
      }),
      always: 'idle',
    },
    cleared: {
      entry: assign({
        input: '',
        result: '',
      }),
      always: 'idle',
    },
    calculated: {
      entry: assign({
        input: (context, event) => context.input + event.payload,
        result: (context, event) => doMath(context.input + event.payload),
      }),
      always: 'idle',
    },
    success: {
      type: 'final',
    },
    failure: {},
  },
});
