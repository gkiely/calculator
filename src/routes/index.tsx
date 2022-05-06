import stringMath from 'string-math';
import EventEmitter from 'events';
import { ComponentData, ComponentName, ComponentNames } from '../components/types';
import { componentNames } from '../utils';
import { WeakObj } from '../utils/types';
import type { Route as RouteResult } from './types';
export const emitter = new EventEmitter();

export * from './types';
type Route<T extends WeakObj, C extends ComponentName = ComponentName, S extends WeakObj = WeakObj> = (
  state: T,
  store: S
) => RouteResult<T, C, S>;

const idFactory = () => {
  let index = 0;
  return {
    id: (prefix = ''): string => {
      return prefix + ++index;
    },
    resetId: () => (index = 0),
  };
};

const { id, resetId } = idFactory();

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

const getState = (input: string): State | undefined => {
  const slice = input.slice(-2) ?? '';

  // Reset
  if (slice === 'AC') {
    return {
      input: '',
    };
  }

  // Calculate from a previous result
  const prevEntry = slice.charAt(0);
  const entry = slice.charAt(1);
  if (prevEntry === '=') {
    const r = doMath(input.substring(0, input.length - 1));
    return {
      input: r + entry,
    };
  }

  // Prevent double operators
  if ((isOperator(entry) || entry === '=') && isOperator(prevEntry)) {
    return {
      input: input.substring(0, input.length - 1),
    };
  }
};

const getStore = (store: Store, input: string): Store | undefined => {
  // Testing fetch and re-render
  // if (!store.loading && input.includes('3')) {
  //   console.log('fetch');
  //   fetch('https://jsonplaceholder.typicode.com/users/1')
  //     .then((res) => res.json())
  //     .then(() => {
  //       return new Promise((resolve) => setTimeout(resolve, 3000));
  //     })
  //     .then((data) => {
  //       console.log('success');
  //       console.log(data);
  //     })
  //     .finally(() => emitter.emit('store'));
  //   return {
  //     loading: true,
  //   };
  // }
  if (store) return store;
};

type State = {
  input?: string;
};
type Store = {
  loading?: boolean;
};
type Components = ComponentNames['Button'] | ComponentNames['Result'];

const index: Route<State, Components, Store> = ({ input = '' }, routeStore: Store = {}) => {
  const result = doMath(input);
  const state = getState(input);
  const store = getStore(routeStore, state?.input ?? input);
  resetId();

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
      [7, 8, 9, 'x'].map((o) => Button(o)),
      [4, 5, 6, '÷'].map((o) => Button(o)),
      [1, 2, 3, '+'].map((o) => Button(o)),
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
  // test,
};

export type RoutesType = typeof routes;

export default routes;
