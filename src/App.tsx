import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import isEqual from 'lodash.isequal';

import { emitter, Path, RouteState, RouteStore } from './routes';
import { createSection, getRoute } from './utils';
import './styles.css';
import * as styles from './styles';

export function App() {
  const [path, to] = useState<Path>('/');
  const [routeState, update] = useState<RouteState>({});
  const routeStore = useRef<RouteStore>({});
  const route = getRoute(path, routeState, routeStore.current);
  const [, render] = useState(0);

  // Allows updating state from route
  if (route?.state && !isEqual(route.state, routeState)) {
    update(route.state);
  }

  useEffect(() => {
    emitter.on('render', () => {
      render((s) => s + 1);
    });
    emitter.on('update', (payload) => {
      update((state) => ({
        ...state,
        ...payload,
      }));
    });
    emitter.on('store', (payload: RouteStore) => {
      routeStore.current = payload;
    });
    return () => {
      emitter.removeAllListeners();
    };
  }, []);

  console.log('client', route.state, routeState);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - we need to move RouteStore to be the 2nd argument of Route<State, Store, Components>
  routeStore.current = route.store;

  // Debugging
  // console.log('render:', route.state, routeState, route.store, routeStore.current);
  // console.log(route.components);

  if (!route) return null;
  return (
    <div className={styles.app}>
      {route.components.map((data) =>
        createSection(data, {
          path,
          to: (nextPath, o) => {
            to(nextPath);
            update(typeof o === 'undefined' ? (prev) => prev : o);
          },
          update: (fn) => {
            const result = fn(routeState);
            if (result) {
              update((s) => ({
                ...s,
                ...result,
              }));
            }
          },
        })
      )}
    </div>
  );
}

export default function AppContainer() {
  return (
    <Router>
      <App />
    </Router>
  );
}
