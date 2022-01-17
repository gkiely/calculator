import { BrowserRouter as Router } from "react-router-dom";
import { useState } from 'react';
import isEqual from 'lodash.isequal';

import "./styles.css";
import * as styles from "./styles";

import * as components from "./components";
import routes, { ComponentData, Route, Path } from "./routes";
import { Location, WeakObj } from './utils/types';

const getRoute = (path: keyof typeof routes, routeState: WeakObj): Route  => {
  if(!routes[path]){
    console.warn(`Route does not exist: ${path}`);
  }
	return routes[path](routeState);
}

const getComponent = (data: ComponentData, location: Location) => {
  const Component = components[data.component as keyof typeof components];
  if(!data.id){
    console.warn(`Missing id for: ${data.component}`);
  }
  if(!Component){
    console.warn(`Component does not exist: ${data.component}`);
  }
  return Component ? <Component key={data.id} {...data.props} location={location} /> : null;
};

/**
 * Handles grouping UI into sections
 */
// TODO: remove sectionCount in favor of setting id on server w/ above syntax
let sectionCount = 0;
const createRoute = (data: ComponentData | ComponentData[], location: Location) => {
  if(Array.isArray(data)){
    return <section className={styles.section} key={++sectionCount}>
      {data.map((item: any) => getComponent(item, location))}
    </section>
  }
  return getComponent(data, location);
}


export function App() {
  const [path, to] = useState<keyof typeof routes>('/');
	const [routeState, update] = useState<WeakObj>({});
	const route = getRoute(path, routeState);

  // Allows updating state from route
  if(route.state && !isEqual(route.state, routeState)){
    update(route.state);
  }

  if(!route) return null;
  return <div className={styles.app}>
    {
      route.components.map(data => createRoute(
        data,
        {
          path,
          to: (path: Path, o: any) => {
            to(path);
            update(typeof o === "undefined" ? (prev => prev) : o);
          },
          update,
        }
      ))
    }
  </div>
}

export default function AppContainer() {
  return (
    <Router>
      <App />
    </Router>
  );
}
