import { ComponentNames } from '../components/types';
import { componentNames } from '../utils';
import { WeakObj } from '../utils/types';
import { Route, RouteResult } from './types';

type State = {
  input?: string;
};
type Components = ComponentNames['Button'] | ComponentNames['Result'];
type Store = WeakObj;

const secondRoute: Route<State, Components, Store> = (routeState): RouteResult<State, Components, Store> => {
  const input = routeState.input ?? '';

  return {
    components: [
      {
        id: '2134',
        component: componentNames.Result,
        props: {
          result: 'second route',
          input: '',
        },
      },
      {
        id: '1234',
        component: componentNames.Button,
        props: {
          text: 'back',
          to: '/',
        },
      },
    ],
    state: {
      input,
    },
  };
};

export default secondRoute;
