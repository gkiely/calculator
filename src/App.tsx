import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import './styles.css';
import * as styles from './styles';
// import { isEqual, omit } from 'lodash';
import { emitter, getRoute, Path, renderRoute, RouteAction, RouteState } from './routes/third';

export default function App() {
  const location = useLocation();
  const path: Path = location.pathname as Path;
  const to = useNavigate();
  const [action, update] = useState<RouteAction | null>(null);
  const stateRef = useRef<RouteState>({} as RouteState);
  const route = getRoute(path, stateRef.current, action);

  useEffect(() => {
    emitter.on('update', (state: RouteState) => {
      stateRef.current = state;
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
          to: (nextPath, action) => {
            to(nextPath);
            if (action) {
              update(action);
            }
          },
          update: (action) => {
            update(action);
          },
        })}
    </div>
  );
}
