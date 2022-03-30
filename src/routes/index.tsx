import { useEffect } from 'react';
import { useRef, useState } from 'react';
import stringMath from 'string-math';
import { ComponentData, ComponentName, ComponentsList } from '../components/types';
import { componentNames } from '../utils';
import { WeakObj } from '../utils/types';
import type { Route as RouteResult } from './types';

export * from './types';
type Route<T extends WeakObj, C extends ComponentName = ComponentName> = (arg: T) => RouteResult<T, C>;

let idCount = 0;
const id = (prefix?: string): string => `${prefix ? `${prefix}-` : ''}${++idCount}`;

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

const screen = (result: string, input: string): ComponentsList => {
  return [
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
};

const index: Route<{ input?: string }, 'Button' | 'Result'> = ({ input = '' }) => {
  // console.log('render');
  // useEffect(() => {
  //   if(input.includes('3')){
  //     console.log('trigger render');
  //   }
  // }, [input]);

  // if(input.includes('3')){
  //   // return immediately with loading state
  //   // store abortcontroller in Map
  //   // if render runs again and input does not incl 3, Abort
  // }

  // console.log(clicks);
  // const clicks = useRef(0);
  const result = doMath(input);
  const components = screen(result, input);

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

const test: Route<{ so?: string }, 'Button'> = ({ so }) => {
  return {
    components: [
      {
        id: '2134',
        component: componentNames.Button,
        props: {
          text: 'hi',
        },
        // component: componentNames.Result,
        // props: {
        //   result: 'so',
        //   input: '',
        // },
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

export type RoutesType = typeof routes;

export default routes;
