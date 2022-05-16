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
  const [data, update] = useState<RouteAction | null>(null);
  const stateRef = useRef<RouteState | null>(null);
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
