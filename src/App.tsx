import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { emitter, Path, RouteState, RouteSession } from './routes';
import { createSection, getRoute } from './utils';
import './styles.css';
import * as styles from './styles';
import { isEqual } from 'lodash';

export default function App() {
  const location = useLocation();
  const path = location.pathname as Path;
  const to = useNavigate();
  const [routeState, update] = useState<RouteState>({});
  const routeSession = useRef<RouteSession>({ prevPath: path });
  const prevPath = routeSession.current.prevPath as Path;
  const route = getRoute(path, routeState, routeSession.current);

  // Clean up onLeave
  if (prevPath !== path) {
    const prevRoute = getRoute(prevPath, {}, {});
    if (prevRoute.onLeave) {
      route.session = routeSession.current = {
        prevPath: routeSession.current.prevPath,
        ...prevRoute.onLeave.session,
      };
      if (prevRoute.onLeave.state) {
        route.state = routeSession.current.state = prevRoute.onLeave.state;
      }
    }
  }

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
    emitter.on('session', (payload: RouteSession = {}) => {
      routeSession.current = payload;
    });
    emitter.on('to', (path: Path, payload: RouteState) => {
      console.log('to', path);
      to(path);
      update(typeof payload === 'undefined' ? (prev) => prev : payload);
    });
    return () => {
      emitter.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debugging
  // console.log(route.components);
  console.log('client:', route.state, routeState, route.session, routeSession.current);

  routeSession.current = {
    ...route.session,
    prevPath: path,
  };

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
