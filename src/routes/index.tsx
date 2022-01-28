import stringMath from 'string-math';

import { ComponentData, ComponentName, ComponentNames, ComponentsList } from '../components/types';
import { WeakObj } from '../utils/types';
import { componentNames } from '../utils';

let idCount = 0;
const id = (prefix?: string): string => `${prefix ? `${prefix}-` : ''}${++idCount}`;

// type ComponentsList = Array<ComponentData | ComponentData[]>;
export type Route<S extends WeakObj = WeakObj, C extends ComponentName = ComponentName> = {
  state?: S;
  components: Array<ComponentData<C> | ComponentData<C>[]>;
};

type ButtonComponent = ComponentData<'Button'>;
const Button = (label: number | string): ButtonComponent => ({
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

type Index = {
  input?: string;
};

const index = ({ input = '' }: Index): Route<{ input: string }, 'Button' | 'Result'> => {
  const result = doMath(input);
  const components: ComponentsList = [
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
  ];

  /**
   * State updates
   */

  // Clear
  const slice = input.slice(-2) ?? '';
  if (slice === 'AC') {
    return {
      state: {
        input: '',
      },
      components,
    };
  }

  // Allow calculating from a previous result
  const lastEntry = slice.charAt(0);
  const currentEntry = slice.charAt(1);
  if (lastEntry === '=') {
    const r = doMath(input.substring(0, input.length - 1));
    return {
      state: {
        input: r + currentEntry,
      },
      components,
    };
  }

  // Prevent double operators
  if ((isOperator(currentEntry) || currentEntry === '=') && isOperator(lastEntry)) {
    return {
      state: {
        input: input.substring(0, input.length - 1),
      },
      components,
    };
  }

  return {
    components,
  };
};

const test = ({ so }: { so?: string }): Route<{ so?: string }, 'Button'> => {
  return {
    components: [
      {
        id: '2134',
        component: componentNames.Button,
        props: {
          text: 'hi',
        },
      },
    ],
    state: {
      so,
    },
  };
};

const routes = {
  '/': index,
  test,
};

export type Path = keyof typeof routes;
type Nested<T> = T extends Route<infer A> ? A : never;

////////////////////////////////////////////////
//// Get component parameters
////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type NestedSecondArg<T> = T extends Route<infer A, infer B> ? B : never;
type ComponentsInRoute = {
  [k in keyof typeof routes]: NestedSecondArg<ReturnType<typeof routes[k]>>;
};
type GetParams<P> = P extends Path
  ? {
      [k in keyof ComponentNames]: {
        [p in P]: ComponentsInRoute[P];
      };
    }
  : never;

type A = {
  [k in keyof GetParams<Path>]: SingleObjectType<GetParams<Path>[k]>;
};
type B<P extends Path> = {
  [k in keyof A]: k extends A[k][P] ? GetRouteParams<P> : never;
};
type C = {
  [k in keyof Routes]: B<k>;
}[Path];

export type D = {
  [k in keyof C]: C[k] extends never ? never : C[k];
};

export type ComponentParams = {
  [k in keyof D]: UnionToIntersection<D[k]>;
};
//// End of getting component parameters /////

export type RouteStatesObj = {
  [k in keyof typeof routes]: Nested<ReturnType<typeof routes[k]>>;
};
type GetRouteStates<P> = P extends Path ? Nested<ReturnType<typeof routes[P]>> : never;
export type RouteStates = GetRouteStates<keyof typeof routes>;

type GetRouteParams<P> = P extends Path ? Parameters<typeof routes[P]>[number] : never;
export type RouteParams = GetRouteParams<keyof typeof routes>;

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type SingleObjectType<U> = UnionToIntersection<U> extends infer O ? { [K in keyof O]: O[K] } : never;
export type Params = SingleObjectType<RouteParams>;
export type Param = keyof Params;

const as = <T extends Record<string, unknown>>(value: T) => value;

export type Routes = {
  [k in keyof typeof routes]: (o: Parameters<typeof routes[k]>[number]) => Route<RouteStatesObj[k]>;
};

export default as<Routes>(routes);
