import stringMath from 'string-math';

import { ComponentData } from '../components/types';
import { WeakObj } from '../utils/types';
import { componentNames } from '../utils';

let idCount = 0;
const id = (prefix?: string): string => `${prefix ? `${prefix}-` : ''}${++idCount}`;

type Components = Array<ComponentData | ComponentData[]>;
export type Route<T extends WeakObj = WeakObj> = {
  state?: T;
  components: Components;
};

const Button = (label: number | string): ComponentData => ({
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

const index = ({ input = '' }: { input?: string }): Route<{ input: string }> => {
  const result = doMath(input);
  const components: Components = [
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

const test = ({ so }: { so?: string }): Route<{ so?: string }> => {
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
      so: 'sup',
    },
  };
};

const routes = {
  '/': index,
  test,
};

export type Path = keyof typeof routes;
type Nested<T> = T extends Route<infer A> ? A : never;

export type RouteStates = {
  [k in keyof typeof routes]: Partial<Nested<ReturnType<typeof routes[k]>>>;
};

type Distribute<P> = P extends Path ? Partial<Parameters<typeof routes[P]>[number]> : never;

export type RouteParams = Distribute<keyof typeof routes>;

const as = <T extends Record<string, unknown>>(value: T) => value;

export type Routes = {
  [k in keyof typeof routes]: (o: Partial<Parameters<typeof routes[k]>[number]>) => Route<RouteStates[k]>;
};

export default as<Routes>(routes);
