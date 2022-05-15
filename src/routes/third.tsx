import EventEmitter from 'events';
export const emitter = new EventEmitter();

import { doMath, isValidInput } from '../utils';
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

export type RouteAction = {
  type: string;
  payload?: WeakObj | string;
};

export type RouteLocation = {
  path: Path;
  to: (path: Path, payload?: RouteAction) => void;
  update: (action: RouteAction) => void;
};

/// TODO: figure out recursive type
export type RouteResult = (ComponentData | RouteSection)[];
export type RouteState<Path extends keyof typeof routes = keyof typeof routes> = typeof routes[Path];

type Requests = Record<string, AbortController | null>;

type Route<State> = {
  state: State;
  render: (state: State) => RouteResult;
  update?: (state: State, action: RouteAction) => Partial<State> | void;
  /// TODO: get type working to only accept state & reducer or machine
  // machine?: any;
  effects?: (state: State, action: RouteAction, requests: Requests) => void;
  onLeave?: (state: State) => Partial<State> | void;
};

const createRoute = <State extends WeakObj>(route: Route<State>) => {
  return route;
};

const button = (text: string, action = { type: 'input', payload: text }): ComponentData => {
  return {
    id: 'button',
    component: 'Button',
    props: {
      text,
    },
    action,
  };
};

// State is immutable in render
const render = (state: State): RouteResult => {
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
        id: 'result2',
        component: 'Result',
        props: {
          input: state.input,
          result: state.result,
        },
      },
      {
        id: 'result2.1',
        component: 'Result',
        props: {
          input: state.input,
          result: state.result,
        },
      },
    ],
    [
      {
        id: 'result3',
        component: 'Result',
        props: {
          input: state.input,
          result: state.result,
        },
      },
    ],
  ];
};

type State = {
  input: string;
  result: string;
};

/// TODO: work out way to auto infer state type
const third = createRoute<State>({
  state: {
    input: '',
    result: '',
  },
  render,
  update: (state, action) => {
    const { type, payload } = action;
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
  effects(state, { type, payload }, requests) {
    if (type === 'fetch' && typeof payload === 'string') {
      if (requests.button) {
        requests.button.abort();
      }

      const controller = new AbortController();
      requests.button = controller;
      const getData = async () => {
        try {
          const data = await (await fetch(payload, controller)).json();
          state.input = data.id;
          requests.button = null;

          /// TODO this should be called automatically by the library?
          // after a state change
          // batch state changes into a single animation frame then call it
          emitter.emit('update', state);
        } catch {}
      };
      getData();
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
export const getComponent = (data: ComponentData, location: RouteLocation) => {
  const Component = components[data.component] as React.ComponentType<ComponentProps & { location: RouteLocation }>;
  const { id, props } = data;
  return Component ? <Component {...props} data-test-id={id} key={id} location={location} /> : null;
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
export const getRoute = (path: Path, state: RouteState | null, action?: RouteAction | null): RouteResult | null => {
  const route = routes[path];
  if (!route) return null;

  // Update triggered by server
  // Refetch view
  if (action === null) {
    return route.render(route.state);
  }

  const nextState = route.update?.({ ...route.state }, action ?? { type: 'default' });
  if (nextState) {
    route.state = {
      ...route.state,
      ...nextState,
    };
  }

  route.effects?.(route.state, action ?? { type: 'default' }, requests);

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
