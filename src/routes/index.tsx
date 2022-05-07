import stringMath from 'string-math';
import EventEmitter from 'events';
import { ComponentData, ComponentNames } from '../components/types';
import { componentNames } from '../utils';
import { WeakObj, WeakStore } from '../utils/types';
import type { Route } from './types';
export const emitter = new EventEmitter();
import { nanoid } from 'nanoid';
import secondRoute from './second';

export * from './types';

const idFactory = () => {
  let index = 0;
  return [
    (prefix = ''): string => {
      return prefix + ++index;
    },
    () => (index = 0),
  ] as const;
};

const [id, resetId] = idFactory();
const uuid = () => nanoid();

const Button = (label: number | string): ComponentData<'Button'> => ({
  id: id(componentNames.Button),
  component: componentNames.Button,
  props: {
    text: `${label}`,
    ...(typeof label === 'string' && { operation: true }),
    ...(label === 0 && { wide: true }),
  },
});

const doMath = (input: string): string => {
  if (!input.endsWith('=')) return '';
  try {
    const parsedInput = input.replace(/=/g, '').replace(/x/gi, '*').replace(/÷/g, '/');
    return `${stringMath(parsedInput)}`;
  } catch {
    return '';
  }
};

const isOperator = (char: string) => ['+', '-', 'x', '÷'].includes(char);

const getState = (state: State): State | undefined => {
  const input = state.input ?? '';
  const slice = input.slice(-2) ?? '';
  const secondPrevChar = input.slice(-3, -2);
  const prevChar = slice.charAt(0);
  const nextChar = slice.charAt(1);

  // Reset
  if (slice === 'AC') {
    return {
      buttonText: 3,
      input: '',
    };
  }

  // Calculate from a previous result
  if (prevChar === '=') {
    const r = doMath(input.substring(0, input.length - 1));
    return {
      ...state,
      input: r + nextChar,
    };
  }

  // Prevent starting with an operator (except for - )
  if (input.length === 1 && isOperator(input) && input !== '-') {
    return {
      ...state,
      input: '',
    };
  }

  // Prevent 0 followed by another 0
  if (isOperator(secondPrevChar) && prevChar === '0' && !isOperator(nextChar)) {
    return {
      ...state,
      input: input.substring(0, input.length - 1),
    };
  }

  // Prevent double operators
  if ((isOperator(nextChar) || nextChar === '=') && isOperator(prevChar)) {
    return {
      ...state,
      input: input.substring(0, input.length - 1),
    };
  }
  if (state) return state;
};

// Store all requests as a map and keep track of their abort controllers
const requestMap = new Map<string, AbortController>();

const getStore = (store: Store, input: string): Store | undefined => {
  if (store.loading && store.requests && input.slice(-2) === 'AC') {
    requestMap.get(store.requests.button)?.abort();
  }
  if (!store.loading && input === '333') {
    const id = uuid();
    const controller = new AbortController();
    requestMap.set(id, controller);
    setTimeout(() => console.log('fetching'));
    fetch('https://jsonplaceholder.typicode.com/users/1', controller)
      .then((res) => res.json())
      .then((data) => {
        console.log('success', data);
        emitter.emit('update', {
          buttonText: data.id,
        });
      })
      .catch(() => {
        console.log('aborted');
      })
      .finally(() => {
        requestMap.delete(id);
        emitter.emit('store');
      });

    return {
      loading: true,
      requests: {
        button: id,
        ...store.requests,
      },
    };
  }
  if (input === '444' && store.prevPath === '/') {
    emitter.emit('to', '/second');
  }
  if (store) return store;
};

type State = {
  input?: string;
  buttonText?: number;
};
type Store = WeakStore & {
  loading?: boolean;
  requests?: {
    [k: string]: string;
  };
};
type Components = ComponentNames['Button'] | ComponentNames['Result'];

const index: Route<State, Components, Store> = (routeState: State, routeStore: Store = {}) => {
  const input = routeState.input ?? '';
  const result = doMath(input);
  const state = getState(routeState);
  const store = getStore(routeStore, input);
  resetId();

  // Debugging
  // console.log('server', routeState, state);

  const buttonText = routeState.buttonText ?? 3;

  return {
    store,
    state,
    components: [
      {
        id: id(componentNames.Result),
        component: componentNames.Result,
        props: {
          result,
          input,
        },
      },
      [
        {
          id: id(componentNames.Button),
          component: componentNames.Button,
          props: {
            text: 'AC',
          },
        },
        {
          id: id(componentNames.Button),
          component: componentNames.Button,
          props: {
            text: '=',
            wide: true,
          },
        },
      ],
      {
        id: id(componentNames.Button),
        component: componentNames.Button,
        props: {
          text: 'Navigate to second route',
          to: '/second',
          wide: true,
        },
      },
      [7, 8, 9, 'x'].map((o) => Button(o)),
      [4, 5, 6, '÷'].map((o) => Button(o)),
      [1, 2, buttonText, '+'].map((o) => Button(o)),
      [0, '-'].map((o) => Button(o)),
    ],
  };
};

// const test: Route<{ so?: string }, typeof componentNames.Result> = ({ so }) => {
//   return {
//     components: [
//       {
//         id: '2134',
//         component: componentNames.Result,
//         props: {
//           result: 'so',
//           input: '',
//         },
//         // component: componentNames.Button,
//         // props: {
//         //   text: 'hi',
//         // },
//       },
//     ],
//     state: {
//       so,
//     },
//   };
// };

const routes = {
  '/': index,
  '/second': secondRoute,
  // test,
};

export type RoutesType = typeof routes;

export default routes;
