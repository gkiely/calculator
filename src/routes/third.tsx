import EventEmitter from 'events';
export const emitter = new EventEmitter();

import { componentIdFactory, componentNames, doMath, isValidInput } from '../utils';
import { WeakObj } from '../utils/types';
import * as components from '../components';
import * as styles from '../styles';

export type ComponentName = keyof typeof components;
export type Path = keyof typeof routes;

/// TODO: fix component props
// export type ComponentProps = Parameters<typeof components[ComponentName]>[number];
export type ComponentProps = Record<string, any>;
export type ComponentData = {
  id: string;
  component: ComponentName;
  props: Omit<ComponentProps, 'id' | 'location'>;
  action?: RouteAction;
};

export type RouteSection = ComponentData[];

export type RouteAction = WeakObj;

export type RouteLocation = {
  path: Path;
  to: (path: Path, data?: RouteAction) => void;
  update: (data: RouteAction) => void;
};

/// TODO: figure out recursive type
export type RouteResult = (ComponentData | RouteSection)[];
export type RouteState<Path extends keyof typeof routes = keyof typeof routes> = typeof routes[Path];

type Requests = Record<string, AbortController | null>;

type Route<State> = {
  state: State;
  render: (state: State) => RouteResult;
  update?: (state: State, data: RouteAction) => Partial<State>;
  /// TODO: get type working to only accept state & reducer or machine
  // machine?: any;
  effects?: (state: State, data: RouteAction, requests: Requests) => void;
  onLeave?: (state: State) => Partial<State> | void;
};

function createRoute<S>(route: Route<S>): Route<S> {
  return route;
}

const [id, reset] = componentIdFactory();

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

// State is immutable in render
const render = (state: State): RouteResult => {
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
          type: 'calculate',
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

type State = {
  input: string;
  result: string;
  buttonText: number;
};

/// TODO: work out way to auto infer state type
const third = createRoute<State>({
  state: {
    input: '',
    result: '',
    buttonText: 3
  },
  render,
  update: (state, action) => {
    const { type, payload } = action;
    const input = state.input + payload;

    // const secondPrevChar: string = input.slice(-4, -3);
    const prevChar: string = input[input.length - 2];
    const currentChar: string = input[input.length - 1];

    if (type === 'clear') {
      return {};
    }

    // Calculate from a previous result
    if (type === 'calculate' && prevChar === '=') {
      const result = doMath(input.substring(0, input.length - 1));
      state.input = result + currentChar;
      state.result = '';
      return state;
    }

    if (!isValidInput(input)) {
      return state;
    }

    if (type === 'calculate') {
      state.input = input;
      state.result = doMath(input);
      return state;
    }

    if (type && type !== 'input') return state;

    state.input = input;
    return state;
  },
  effects(state, { type, payload }, requests) {
    if (!payload || typeof payload !== 'string') return;
    if (type === 'fetch') {
      if (requests.button) {
        requests.button.abort();
      }

      const controller = new AbortController();
      requests.button = controller;
      const getData = async () => {
        try {
          const data = await (await fetch(payload, controller)).json();
          state.buttonText = data.id;
          requests.button = null;

          /// TODO this should be called automatically by the library?
          // after a state change
          // batch state changes into a single animation frame then call it
          emitter.emit('update', state);
        } catch {}
      };
      getData();
      return requests;
    }
  },
  onLeave: (state) => {
    console.log('onLeave', state);
  },
});

const routes = {
  '/': third,
};

export default routes;

/// TODO: move methods these to utils
export const getComponent = (componentData: ComponentData, location: RouteLocation) => {
  const Component = components[componentData.component] as React.ComponentType<
    ComponentProps & { location: RouteLocation }
  >;
  const { id, props, action } = componentData;
  return Component ? <Component {...props} action={action} data-test-id={id} key={id} location={location} /> : null;
};

// Combine component id's to make a unique section id that persists across re-renders
const getSectionKey = (route: ComponentData | RouteSection): string => {
  return Array.isArray(route) ? route.map((route) => getSectionKey(route)).join('-') : route.id ? route.id : '';
};

export const createSection = (route: ComponentData | RouteSection, location: RouteLocation): JSX.Element | null => {
  if (Array.isArray(route)) {
    const key = getSectionKey(route);
    return (
      <section key={key} className={styles.section}>
        {route.map((item) => createSection(item, location))}
      </section>
    );
  }
  return getComponent(route, location);
};

const requests: Requests = {} as Requests;

// getRoute runs:
// - update x
// - effects x
// - render x
export const getRoute = (path: Path, state: RouteState | null, data?: RouteAction | null): RouteResult | null => {
  const route = routes[path];
  if (!route) return null;

  // Update triggered by server
  // Refetch view
  if (data === null) {
    return route.render(route.state);
  }

  const nextState = route.update?.({ ...route.state }, data ?? {});
  if (nextState) {
    route.state = {
      ...route.state,
      ...nextState,
    };
  }

  route.effects?.(route.state, data ?? {}, requests);

  /// TODO: remove requests when they fulfill?
  // if (effects) {
  //   const requests = Array.isArray(effects) ? effects : [effects];
  //   requests.forEach((obj) =>
  //     obj.request.finally(() => {
  //       requestArr = requestArr.filter((o) => o.id !== obj.id);
  //     })
  //   );
  //   requestArr.push(...requests);
  // }

  // TODO: abort requests and cleanup onLeave

  const result = route.render(route.state);

  return result;
};

export const renderRoute = (route: RouteResult, location: RouteLocation) => {
  return route.map((item) => createSection(item, location));
};
