import EventEmitter from 'events';
export const emitter = new EventEmitter();

import { componentNames, isOperator } from '../utils';
import { ComponentData, Route, RouteAction, RouteResult } from '../utils/types';
// import { reducer, effects } from './calculator-reducer';
import machine from './calculator-machine';

// ------ Components ------
const button = (
  text: string | number,
  props = {},
  action: RouteAction = { type: 'input', payload: text }
): ComponentData => {
  if (!text) throw new Error('button - text must be defined');
  return {
    component: componentNames.Button,
    props: {
      text: text.toString(),
      ...props,
      ...(typeof text === 'string' && isOperator(text) && { operation: true }),
    },
    action,
  };
};

// ------ State ------
export type State = {
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
      {
        component: componentNames.Button,
        props: {
          text: 'AC',
        },
        action: {
          type: 'clear',
        },
      },
      {
        component: componentNames.Button,
        props: {
          text: '=',
          wide: true,
        },
        action: {
          type: 'calculate',
          payload: '=',
        },
      },
    ],
    [7, 8, 9, 'x'].map((o) => button(o)),
    [4, 5, 6, '÷'].map((o) => button(o)),
    [1, 2, state.buttonText, '+'].map((o) => button(o)),
    [
      {
        component: componentNames.Button,
        props: {
          text: 'fetch',
          wide: true,
        },
        action: {
          type: 'fetch',
          payload: 'https://jsonplaceholder.typicode.com/users/1',
        },
      },
    ],
  ];
};

const third: Route<State> = {
  state,
  render,
  machine,
  // reducer,
  // effects,
  onLeave: (state) => {
    console.log('onLeave', state);
  },
};

const routes = {
  '/': third,
};

export default routes;
