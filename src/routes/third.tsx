// import { assign, createMachine } from 'xstate';
import { WeakObj } from '../utils/types';

type Action = { type: string; payload?: any };

type Realm = {
  state: WeakObj;
  render: (state: WeakObj) => Record<string, any>[] | Record<string, any>;
  update?: (state: Record<string, any>, action: Action) => WeakObj | void;
  /// TODO: get type working to only accept state & reducer or machine
  machine?: any;
  effects?: (state: WeakObj, action: Action) => Promise<AbortController | (() => void) | void> | void;
  onLeave?: (state: WeakObj) => WeakObj | void;
};

const createRealm = (realm: Realm): Realm['render'] => realm.render;

const button = (text: string, action = { type: 'input', payload: text }) => {
  return [
    {
      id: 'button',
      component: 'Button',
      props: {
        text,
      },
      action,
    },
  ];
};

const result = (state: WeakObj) => ({
  id: 'result',
  component: 'Result',
  props: {
    result: state.input,
  },
});

const render = (state: WeakObj) => {
  return [
    result(state),
    [
      [
        {
          id: 'button',
          component: 'Button',
          props: {
            text: 'AC',
          },
          action: {
            type: 'clear',
          },
        },
        {
          id: 'button',
          component: 'Button',
          props: {
            text: '=',
            wide: true,
          },
          action: {
            type: 'equal',
          },
        },
      ],
      [7, 8, 9, 'x'].map((o) => button(o.toString())),
      [4, 5, 6, '÷'].map((o) => button(o.toString())),
      [
        {
          ...button('3'),
          action:
            state.input === '333'
              ? {
                  type: 'fetch',
                  payload: 'https://jsonplaceholder.typicode.com/users/1',
                }
              : {
                  type: 'input',
                  payload: '3',
                },
        },
        ...[2, 1, '+'].map((o) => button(o.toString())),
      ],
      ...[0, '-'].map((o) => button(o.toString())),
    ],
  ];
};

const isOperator = (char: string) => ['+', '-', 'x', '÷'].includes(char);
export const doMath = (s: string) => s;
export const isValidInput = (input: string): boolean => {
  const secondLastChar: string = input.slice(-4, -3);
  const lastChar: string = input[input.length - 2];
  const currentChar: string = input[input.length - 1];

  if (input.length < 2) {
    return false;
  }

  // Prevent double operators
  if (isOperator(lastChar) && isOperator(currentChar)) {
    return false;
  }
  // Prevent starting with 00
  // Prevent operator followed by 00
  if ((input.length === 2 || isOperator(secondLastChar)) && lastChar === '0' && currentChar === '0') {
    return false;
  }
  // Prevent double operators
  if ((isOperator(currentChar) || lastChar === '=') && isOperator(lastChar)) {
    return false;
  }
  return true;
};

const third = createRealm({
  state: {
    input: '',
  },
  render,
  update(state, { type, payload }) {
    // with immer
    if (type === 'clear') {
      state.result = '';
      state.input = '';
      return;
    }

    if (type === 'equal') {
      state.result = doMath(state.input);
      return;
    }

    if (type !== 'input') return;

    // Handle input
    const { input } = state;
    if (!isValidInput(input + payload)) {
      return;
    }

    state.input = state.input + payload;
  },
  async effects(state, { type, payload }) {
    if (type === 'fetch') {
      const controller = new AbortController();
      const data = await (await fetch(payload, controller)).json();
      state.input = data.id;
      return controller;
    }
  },
  onLeave: (state) => {
    state.input = 'left';
  },
});

export default {
  '/third': third,
};
