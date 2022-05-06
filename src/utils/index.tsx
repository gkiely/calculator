import { Location } from './types';
import routes, { Path, Route, RouteState, RouteStates, RouteStore } from '../routes';
import * as components from '../components';
import * as styles from '../styles';
import { ComponentData, ComponentName, ComponentNames } from '../components/types';

export const componentNames = (Object.keys(components) as Array<ComponentName>).reduce(
  (acc, component) => ({
    ...acc,
    [component]: component,
  }),
  {} as ComponentNames
);

export const getRoute = (path: Path, routeState: RouteState, routeStore: RouteStore): Route<RouteStates> => {
  if (!routes[path]) {
    console.warn(`Route does not exist: ${path}`);
  }
  return routes[path](routeState, routeStore);
};

export const getComponent = (data: ComponentData, location: Location): JSX.Element | null => {
  const Component = components[data.component] as React.ComponentType<{ location: Location }>;

  if (!data.id) {
    console.warn(`Missing id for: ${data.component}`);
  }
  if (!Component) {
    console.warn(`Component does not exist: ${data.component}`);
  }
  return Component ? <Component key={data.id} {...data.props} location={location} /> : null;
};

/**
 * Handles grouping UI into sections
 */
export const createSection = (data: ComponentData | ComponentData[], location: Location) => {
  if (Array.isArray(data)) {
    // Combine id's to make a unique id that persists across re-renders
    const key = data.map((o) => o.id).join('-');
    return (
      <section className={styles.section} key={key}>
        {data.map((item) => getComponent(item, location))}
      </section>
    );
  }
  return getComponent(data, location);
};
