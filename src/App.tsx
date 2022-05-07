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

  // Allows updating state from route
  if (route?.state && !isEqual(route.state, routeState)) {
    update(route.state);
  }

  useEffect(() => {
    emitter.on('update', (payload) => {
      update((state) => ({
        ...state,
        ...payload,
      }));
    });
    emitter.on('store', (payload: RouteStore) => {
      routeStore.current = payload;
    });
    emitter.on('to', (path: Path, payload) => {
      console.log('to', path);
      to(path);
      update(typeof payload === 'undefined' ? (prev) => prev : payload);
    });
    return () => {
      emitter.removeAllListeners();
    };
  }, []);

  routeStore.current = {
    ...route.store,
    prevPath: path,
  };

  // Debugging
  console.log('client:', route.state, routeState, route.store, routeStore.current);
  // console.log(route.components);

  if (!route) return null;
  return (
    <div className={styles.app}>
      {route.components.map((data) =>
        createSection(data, {
          path,
          to: (nextPath, payload) => {
            emitter.emit('to', nextPath, payload);
          },
          update: (fn) => {
            const result = fn(routeState);
            if (result) {
              emitter.emit('update', result);
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
