import EventEmitter from 'events';
export const emitter = new EventEmitter();

import { componentIdFactory, componentNames, doMath, isValidInput } from '../utils';
import { ComponentData, Route, RouteResult } from '../utils/types';

const [id, reset] = componentIdFactory();

// ------ Components ------
const button = (text: string | number, action = { payload: text }): ComponentData => {
  return {
    id: id('button'),
    component: 'Button',
    props: {
      text: text.toString(),
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

// ------ Update ------
const update: Route<State>['update'] = (state, action) => {
  const { type, payload } = action;
  const input = state.input + payload;

  const allowedActions = ['clear'];

  if (typeof type === 'string' && !allowedActions.includes(type)) return state;

  // const secondPrevChar: string = input.slice(-4, -3);
  const prevChar: string = input[input.length - 2];
  const currentChar: string = input[input.length - 1];

  if (type === 'clear') {
    return {
      input: '',
      result: '',
      buttonText: 3,
    };
  }

  // Calculate from a previous result
  if (currentChar !== '=' && prevChar === '=') {
    const result = doMath(input.substring(0, input.length - 1));
    return {
      ...state,
      input: result + currentChar,
      result,
    };
  }

  if (!isValidInput(input)) {
    return state;
  }

  if (currentChar === '=') {
    return {
      ...state,
      input,
      result: doMath(input),
    };
  }

  return {
    ...state,
    input,
  };
};

// ------ Render ------
const render = (state: State): RouteResult['components'] => {
  // const state = update(state, action);
  // const effects = effects(state, action);

  reset();
  return [
    {
      id: 'result',
      component: 'Result',
      props: {
        input: state.input,
        result: state.result,
      },
    },
    [
      {
        id: id(componentNames.Button),
        component: componentNames.Button,
        props: {
          text: 'AC',
        },
        action: {
          type: 'clear',
        },
      },
      {
        id: id(componentNames.Button),
        component: componentNames.Button,
        props: {
          text: '=',
          wide: true,
        },
        action: {
          payload: '=',
        },
      },
    ],
    [7, 8, 9, 'x'].map((o) => button(o)),
    [4, 5, 6, '÷'].map((o) => button(o)),
    [1, 2, state.buttonText, '+'].map((o) => button(o)),
    [
      {
        ...button('fetch'),
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

// ------ Effects ------
const effects: Route<State>['effects'] = (state, { type, payload }, requests) => {
  if (!payload || typeof payload !== 'string') return;
  const allowedActions = ['fetch'];

  if (typeof type === 'string' && !allowedActions.includes(type)) return;

  if (type === 'fetch') {
    if (requests.button) {
      requests.button.abort();
    }

    const controller = new AbortController();
    requests.button = controller;
    const getData = async () => {
      try {
        const data = await (await fetch(payload, controller)).json();
        requests.button = null;

        /// TODO this should be called automatically by the library?
        // after a state change
        // batch state changes into a single animation frame then call it
        emitter.emit('update', {
          buttonText: data.id,
        });
      } catch {}
    };
    getData();
    return requests;
  }
};

const third: Route<State> = {
  state,
  render,
  update,
  effects,
  onLeave: (state) => {
    console.log('onLeave', state);
  },
};

const routes = {
  '/': third,
};

export default routes;
