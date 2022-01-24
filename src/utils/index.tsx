import { Location, WeakObj } from './types';
import routes, { Route } from '../routes';
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

export const getRoute = (path: keyof typeof routes, routeState: WeakObj): Route => {
  if (!routes[path]) {
    console.warn(`Route does not exist: ${path}`);
  }
  return routes[path](routeState);
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
// TODO: remove sectionCount in favor of setting id on server w/ above syntax
let sectionCount = 0;
export const createRoute = (data: ComponentData | ComponentData[], location: Location) => {
  if (Array.isArray(data)) {
    return (
      <section className={styles.section} key={++sectionCount}>
        {data.map((item) => getComponent(item, location))}
      </section>
    );
  }
  return getComponent(data, location);
};
