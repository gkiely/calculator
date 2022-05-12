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

/**
 * Name: realm-ui
 */

/**
 * Problem:
 * - Managing react state and effects can be cumbersome and non-intuitive
 *
 * Solution:
 * An elm inspired approach to React
 *
 * Route
 * state - the state of your application
 * render - a way to turn your state into a UI structure (json)
 * update - a way to update your state based on actions
 * * effects - a way to update your state based on external events
 * * onLeave - a way to update your state based on leaving a route
 *
 * * effects and onLeave are optional
 *
 * interaction -> update -> render
 *
 * It recommended to structure your application into 2 parts:
 * - Components: dumb, re-usable components
 * - Routes: business logic and UI structure
 *
 * Route rules:
 * 3 properties (state, view, reducer) + 2 optional (effects, onLeave)
 * - Optionally use `machine` instead of reducer, state and effects
 * - when machine is used, view gets called with 2 parameters (state, current)
 * view returns json
 * should be able to run in a service worker or a node instance (for SSR and portability)
 *
 * Any changes to state in the update or the effects function update the UI automatically
 * Uses server-sent events api for pushing async updates to client
 * Automatically cancels previous view's async requests
 * You can use immer or redux
 * TODO: support state machines instead of redux
 * https://stackoverflow.com/a/54521035/1845423
 *
 * State persists between routes unless specifically removed on leave
 *
 *
 * FAQ:
 * Why should I use this?
 * - It simplifies your project structure
 *    - It makes it so there are 2 places a developer can update your application:
 *    - Components
 *    - Routes: Business logic and component structure
 * - It requires no use of hooks or a  state management library, just a single call to `update` from every component
 * - It encourages building components that are re-usable
 * - The encourages writing business logic that is re-usable
 * - It separates business logic from your UI
 * - It allows generating new screens without touching your components
 *
 * Why return JSON from the view instead of html or jsx?
 * 1. JSON is platform and library agnostic
 *    - It is possible to generate views from JSON using javascript, swift, kotlin
 *    - It is possible to generate views using react, vue, etc.
 *      - The ability to use libraries is a big advantage as it allows for use of the library's components, api and tooling.
 *      - It's possible to generate html with React or Vue for example using server-side rendering
 * 2. Using JSON separates business logic from UI implementation details
 *    - Rendering html is an implementation detail, just as rendering a SPA application on the client is a UI implementation detail
 *      - The user does not care if you use server rendered HTML, React, Vue or any other library.
 *      - Using JSON allows for UI implentation flexibility. Either server render or use a library, it is up to you.
 */

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

export default createRealm({
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
