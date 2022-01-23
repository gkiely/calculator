import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import isEqual from 'lodash.isequal';

import routes from './routes';
import { createRoute, getRoute } from './utils';
import { WeakObj } from './utils/types';
import './styles.css';
import * as styles from './styles';

export function App() {
  const [path, to] = useState<keyof typeof routes>('/');
  const [routeState, update] = useState<WeakObj>({});
  const route = getRoute(path, routeState);

  // Allows updating state from route
  if (route.state && !isEqual(route.state, routeState)) {
    update(route.state);
  }

  if (!route) return null;
  return (
    <div className={styles.app}>
      {route.components.map((data) =>
        createRoute(data, {
          path,
          to: (nextPath, o) => {
            to(nextPath);
            update(typeof o === 'undefined' ? (prev) => prev : o);
          },
          update,
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
