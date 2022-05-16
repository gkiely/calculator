import EventEmitter from 'events';
export const emitter = new EventEmitter();

import { doMath, isValidInput, componentNames } from '../utils';
import { ComponentData, Route, RouteAction, RouteResult } from '../utils/types';

// ------ Components ------
const button = (
  text: string | number,
  props = {},
  action: RouteAction = { type: 'input', payload: text }
): ComponentData => {
  return {
    component: componentNames.Button,
    props: {
      text: text.toString(),
      ...props,
    },
    action,
  };
};

// ------ State ------
type State = {
  input: string;
  result: string;
  buttonText: number;
};

const state: State = {
  input: '',
  result: '',
  buttonText: 3,
};

// ------ View ------
const render = (state: State): RouteResult['components'] => {
  return [
    {
      component: componentNames.Result,
      props: {
        input: state.input,
        result: state.result,
      },
    },
    [
      button('AC', {}, { type: 'clear' }),
      button(
        '=',
        { wide: true },
        {
          type: 'calculate',
          payload: '=',
        }
      ),
    ],
    [7, 8, 9, 'x'].map((o) => button(o)),
    [4, 5, 6, '÷'].map((o) => button(o)),
    [1, 2, state.buttonText, '+'].map((o) => button(o)),
    [
      button(
        'fetch',
        { wide: true },
        {
          type: 'fetch',
          payload: 'https://jsonplaceholder.typicode.com/users/1',
        }
      ),
    ],
  ];
};

// ------ Reducer ------
const reducer: Route<State>['reducer'] = (state, action) => {
  const { type, payload } = action;
  const input = state.input + payload;
  const prevChar: string = input[input.length - 2];
  const currentChar: string = input[input.length - 1];

  switch (type) {
    case 'input':
      if (prevChar === '=') {
        const result = doMath(input.substring(0, input.length - 1));
        return {
          ...state,
          input: result + currentChar,
          result: '',
        };
      }
      if (isValidInput(input)) {
        return {
          ...state,
          input,
        };
      }
      return state;
    case 'clear':
      return {
        buttonText: 3,
        input: '',
        result: '',
      };
    case 'calculate':
      if (isValidInput(input)) {
        return {
          ...state,
          result: doMath(input),
          input,
        };
      }
      return state;
    default:
      return state;
  }
};

// ------ Effects ------
const effects: Route<State>['effects'] = async (state, { type, payload }, requests) => {
  switch (type) {
    case 'fetch':
      if (typeof payload === 'string') {
        const data = await requests.get(payload);
        emitter.emit('update', {
          buttonText: data.id,
        });
      }
    default:
      return;
  }
};

const third: Route<State> = {
  state,
  render,
  reducer,
  effects,
  onLeave: (state) => {
    console.log('onLeave', state);
  },
};

const routes = {
  '/': third,
};

export default routes;
