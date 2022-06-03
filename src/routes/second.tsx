import { createButton } from './index';
import { ComponentNames } from '../components/types';
import { componentNames, idFactory } from '../utils';
import { WeakObj, WeakSession } from '../utils/types';
import { Route, RouteResult } from './types';

type State = WeakObj & {
  input?: string;
};
type Components = ComponentNames['Button'] | ComponentNames['Result'];
type Session = WeakSession & {
  readonlyState?: State;
};

const [id, resetId] = idFactory();

const secondRoute: Route<State, Components, Session> = (
  routeState,
  routeSession = {},
): RouteResult<State, Components, Session> => {
  const state = routeState;
  resetId();

  // Store the state in route session and return the same thing to enable read only
  if (routeSession.prevPath !== '/second') {
    routeSession.readonlyState = state;
  }

  return {
    state: routeSession.readonlyState,
    session: routeSession,
    onLeave: {
      session: {},
    },
    components: [
      {
        id: id(componentNames.Result),
        component: componentNames.Result,
        props: {
          result: `readonly ${state.input ? '- ' + state.input : ''}`,
          input: '',
        },
      },
      [
        {
          id: id(componentNames.Button),
          component: componentNames.Button,
          props: {
            text: 'Hello world',
            wide: true,
          },
        },
        {
          id: id(componentNames.Button),
          component: componentNames.Button,
          props: {
            text: '=',
          },
        },
      ],
      ['🚗', '🚀', '😀', 'x'].map(o => createButton(o)),
      ['🎃', '👻', '🤠', '÷'].map(o => createButton(o)),
      ['🥶', '😀', '🚀', '+'].map(o => createButton(o)),
      [0, '-'].map(o => createButton(o)),
      [
        {
          id: id(componentNames.Button),
          component: componentNames.Button,
          props: {
            text: 'Navigate to first route',
            to: '/',
            wide: true,
          },
        },
      ],
    ],
  };
};

export default secondRoute;
