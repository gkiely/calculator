import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import './styles.css';
import * as styles from './styles';
// import { isEqual, omit } from 'lodash';
import { Path, RouteAction, RouteState } from './utils/types';
import { emitter } from './routes/third';

import { getRoute, renderRoute } from './utils';
import { AnyState } from 'xstate';

export default function App() {
  const location = useLocation();
  const path: Path = location.pathname as Path;
  const to = useNavigate();
  const [data, update] = useState<RouteAction | null>(null);
  const stateRef = useRef<RouteState | AnyState | null>(null);
  const route = getRoute(path, stateRef.current, data);

  stateRef.current = route.state;

  useEffect(() => {
    emitter.on('update', (state: RouteState) => {
      stateRef.current = {
        ...stateRef.current,
        ...state,
      };
      update(null);
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
          to: (nextPath, data) => {
            to(nextPath);
            if (data) {
              update(data);
            }
          },
          update,
        })}
    </div>
  );
}
