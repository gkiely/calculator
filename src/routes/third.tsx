import { WeakObj } from '../utils/types';

type Action = { type: string; payload?: any };

type Realm = {
  state: WeakObj;
  view: (o: WeakObj) => Record<string, any>[];
  update: (state: WeakObj, action: Action) => WeakObj | void;
  effects: (state: WeakObj, action: Action) => Promise<AbortController | (() => void) | void>;
};

type RouteFn = (update?: (o: WeakObj) => any) => Realm;

const createRoute = (route: Realm): Realm => route;

/**
 * Rules:
 * 3 properties + 1 for effects
 * view has to return json
 * should be able to run in a service worker or node instance (for SSR)
 *
 * Any changes to state in the update or the effects function update the UI automatically
 * Uses server-sent events api for pushing async updates to client
 * Automatically cancels previous view's async requests
 * You can use immer or redux
 * TODO: support state machines instead of redux
 * https://stackoverflow.com/a/54521035/1845423
 */

const view = (state: WeakObj) => {
  return [
    {
      id: 'result',
      component: 'Result',
      props: {
        result: state.input,
      },
    },
    [
      {
        id: 'button',
        component: 'Button',
        props: {
          text: '3',
        },
        action:
          state.input === '333'
            ? {
                type: 'fetch',
                payload: 'https://jsonplaceholder.typicode.com/users/1',
              }
            : {
                type: 'input',
                payload: '1',
              },
      },
    ],
  ];
};

export default createRoute({
  state: {
    input: '',
  },
  view,
  update(state, action) {
    // with immer
    if (action.type === 'input') {
      state.input = action.payload;
    }
    // Or with redux
    // switch (action.type) {
    //   case 'input':
    //     return {
    //       ...state,
    //       input: state.input + action.payload,
    //     };
    //   default:
    //     return state;
    // }
  },
  async effects(state, { type, payload }) {
    if (type === 'fetch') {
      const controller = new AbortController();
      const data = await (await fetch(payload, controller)).json();
      state.input = data.id;
      return controller;
    }
  },
});
