import stringMath from 'string-math';
import EventEmitter from 'events';
import { ComponentData, ComponentNames } from '../components/types';
import { componentNames, idFactory } from '../utils';
import { WeakSession } from '../utils/types';
import type { Route } from './types';
export const emitter = new EventEmitter();
import { nanoid } from 'nanoid';
import secondRoute from './second';
import { isEqual } from 'lodash';

export * from './types';

const [id, resetId] = idFactory();
const uuid = () => nanoid();

const isOperator = (char: string) => ['+', '-', 'x', '÷', '='].includes(char);

export const createButton = (label: number | string): ComponentData<'Button'> => ({
  id: id(componentNames.Button),
  component: componentNames.Button,
  props: {
    text: `${label}`,
    ...(typeof label === 'string' && isOperator(label) && { operation: true }),
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

const getState = (state: State): State | undefined => {
  const input = state.input ?? '';
  const slice = input.slice(-2) ?? '';
  const secondPrevChar = input.slice(-3, -2);
  const prevChar = slice.charAt(0);
  const nextChar = slice.charAt(1);

  // Reset
  if (input === '') {
    return state;
  }

  // Calculate from a previous result
  if (prevChar === '=') {
    const r = doMath(input.substring(0, input.length - 1));
    return {
      ...state,
      input: r + nextChar,
    };
  }

  // Replace 0 with number when it's the only character
  if (input.length === 2 && prevChar === '0' && !isOperator(nextChar)) {
    return {
      ...state,
      input: nextChar,
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
  if (prevChar === '0' && input.length === 2 && !isOperator(nextChar)) {
    return {
      ...state,
      input: '0',
    };
  }

  // Prevent operator followed by 00
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

export const abort = (requests: Record<string, string>) => {
  Object.keys(requests).forEach((key) => {
    const controller = requestMap.get(key);
    if (controller) {
      controller.abort();
      requestMap.delete(key);
    }
  });
};

const getSession = (session: Session, input: string): Session | undefined => {
  if (session.abort) {
    abort(session.abort);
    return;
  }
  if (session.loading && session.requests && input.slice(-2) === 'AC') {
    requestMap.get(session.requests.button)?.abort();
  }
  if (input.slice(-2) === 'AC') {
    return;
  }
  if (!session.loading && session.prevPath === '/' && input === '333') {
    const id = uuid();
    const controller = new AbortController();
    requestMap.set(id, controller);
    setTimeout(() => console.log('fetching'));
    fetch('https://jsonplaceholder.typicode.com/users/1', controller)
      .then((res) => res.json())
      .then((data) => {
        console.log('success');
        emitter.emit('update', {
          buttonText: data.id,
        });
      })
      .catch(() => {
        console.log('aborted');
      })
      .finally(() => {
        requestMap.delete(id);
        emitter.emit('session');
      });

    return {
      loading: true,
      requests: {
        button: id,
        ...session.requests,
      },
    };
  }
  if (input === '444' && session.prevPath === '/') {
    emitter.emit('to', '/second');
  }
  return session;
};

type Action = 'clear' | 'equal' | 'operator' | 'number' | '';

type State = {
  input?: string;
  buttonText?: number;
};
type Session = WeakSession & {
  loading?: boolean;
};
type Components = ComponentNames['Button'] | ComponentNames['Result'];

const index: Route<State, Components, Session, Action> = (routeState: State, routeSession: Session = {}) => {
  const input = routeState.input ?? '';

  const result = doMath(input);
  const state = getState(routeState);
  const session = getSession(routeSession, input);
  resetId();

  const buttonText = routeState.buttonText ?? 3;

  return {
    session,
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
            update: {
              input: '',
              buttonText: 3,
            },
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
      [7, 8, 9, 'x'].map((o) => createButton(o)),
      [4, 5, 6, '÷'].map((o) => createButton(o)),
      [1, 2, buttonText, '+'].map((o) => createButton(o)),
      [0, '-'].map((o) => createButton(o)),
      [
        {
          id: id(componentNames.Button),
          component: componentNames.Button,
          props: {
            text: 'Navigate to second route',
            to: '/second',
            wide: true,
          },
        },
      ],
    ],
  };
};

const routes = {
  '/': index,
  '/second': secondRoute,
};

export type RoutesType = typeof routes;

export default routes;
