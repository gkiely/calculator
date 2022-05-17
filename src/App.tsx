import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import './styles.css';
import * as styles from './styles';
// import { isEqual, omit } from 'lodash';
import { Path, RouteAction, RouteState } from './utils/types';
import { emitter } from './routes/third';

import { getRoute, renderRoute } from './utils';

export default function App() {
  const location = useLocation();
  const path: Path = location.pathname as Path;
  const to = useNavigate();
  const [action, update] = useState<RouteAction | null>(null);
  const stateRef = useRef<RouteState | null>(null);
  const route = getRoute(path, stateRef.current, action);

  stateRef.current = route.state;

  useEffect(() => {
    emitter.on('update', (state: RouteState) => {
      stateRef.current = {
        ...stateRef.current,
        ...state,
      };
      update({
        type: 'update',
        payload: stateRef.current,
      });
    });
    return () => {
      emitter.removeAllListeners();
    };
  }, [update]);

  return (
    <div className={styles.app}>
      {route &&
        renderRoute(route, {
          path,
          to: (nextPath, action) => {
            to(nextPath);
            if (action) {
              update(action);
            }
          },
          update,
        })}
    </div>
  );
}
