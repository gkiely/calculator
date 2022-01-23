import stringMath from 'string-math';
import { ComponentData } from '../components/types';
import { WeakObj } from '../utils/types';

import { componentNames } from '../utils';

let idCount = 0;
const id = (prefix?: string): string => `${prefix ? `${prefix}-` : ''}${++idCount}`;
const numbers = Array.from(Array(10).keys());

export type Route = {
  state?: WeakObj;
  components: Array<ComponentData | ComponentData[]>;
};
export type Path = keyof typeof routes;
type RouteFunction = (routeState: WeakObj) => Route;
type Routes = Record<string, RouteFunction>;

const ButtonRow = (item: number | string, props: { [key: string]: string }): ComponentData => ({
  id: id(componentNames.Button),
  component: componentNames.Button,
  props: {
    text: `${item}`,
    ...(typeof item !== 'string' && !numbers.includes(item) && { operation: true }),
    ...(item === 0 && { wide: true }),
    ...props,
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

const index = ({ input = '' }: { input?: string }): Route => {
  const result = doMath(input);
  const components: Route['components'] = [
    {
      id: id(componentNames.Result),
      component: componentNames.Result,
      props: {
        input,
        result,
      },
    },
    [
      {
        id: id(componentNames.Button),
        component: componentNames.Button,
        props: {
          text: 'AC',
          input,
          result,
        },
      },
      {
        id: id('Button'),
        component: componentNames.Button,
        props: {
          wide: true,
          text: '=',
          input,
          result,
        },
      },
    ],
    [7, 8, 9, 'x'].map((o) => ButtonRow(o, { input, result })),
    [4, 5, 6, '÷'].map((o) => ButtonRow(o, { input, result })),
    [1, 2, 3, '+'].map((o) => ButtonRow(o, { input, result })),
    [0, '-'].map((o) => ButtonRow(o, { input, result })),
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

const routes: Routes = {
  '/': index,
};

export default routes;
