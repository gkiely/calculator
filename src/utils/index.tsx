// import { Location } from './types';
// import routes, { Path, RouteResult, RouteState, RouteStates, RouteSession, RouteAction } from '../routes';
// import * as components from '../components';
// import * as styles from '../styles';
// import { ComponentData, ComponentName, ComponentNames } from '../components/types';
import stringMath from 'string-math';

// export const componentNames = (Object.keys(components) as Array<ComponentName>).reduce(
//   (acc, component) => ({
//     ...acc,
//     [component]: component,
//   }),
//   {} as ComponentNames
// );

// export const getRoute = (
//   path: Path,
//   routeState: RouteState,
//   routeSession: RouteSession,
//   action: RouteAction = ''
// ): RouteResult<RouteStates> => {
//   if (!routes[path]) {
//     console.warn(`Route does not exist: ${path}`);
//   }
//   return routes[path](routeState, routeSession, action as '');
// };

// export const getComponent = (data: ComponentData, location: Location): JSX.Element | null => {
//   const Component = components[data.component] as React.ComponentType<{ location: Location }>;

//   if (!data.id) {
//     console.warn(`Missing id for: ${data.component}`);
//   }
//   if (!Component) {
//     console.warn(`Component does not exist: ${data.component}`);
//   }
//   return Component ? <Component key={data.id} {...data.props} location={location} /> : null;
// };

// /**
//  * Handles grouping UI into sections
//  */
// export const createSection = (data: ComponentData | ComponentData[], location: Location) => {
//   if (Array.isArray(data)) {
//     // Combine id's to make a unique id that persists across re-renders
//     const key = data.map((o) => o.id).join('-');
//     return (
//       <section className={styles.section} key={key}>
//         {data.map((item) => getComponent(item, location))}
//       </section>
//     );
//   }
//   return getComponent(data, location);
// };

// Creates incremented id's for components
// Allows for consistent keys across renders
export const componentIdFactory = (index = 0) => {
  return [
    (prefix = ''): string => {
      return prefix + ++index;
    },
    () => (index = 0),
  ] as const;
};

export const isOperator = (char: string) => ['+', '-', 'x', '÷', '='].includes(char);

export const doMath = (input: string): string => {
  if (!input.endsWith('=')) return '';
  try {
    const parsedInput = input.replace(/=/g, '').replace(/x/gi, '*').replace(/÷/g, '/');
    return `${stringMath(parsedInput)}`;
  } catch {
    return '';
  }
};

export const isValidInput = (input: string): boolean => {
  const secondLastChar: string = input.slice(-4, -3);
  const lastChar: string = input[input.length - 2];
  const currentChar: string = input[input.length - 1];

  if (input.length < 2) {
    return false;
  }

  // Prevent double operators
  if (isOperator(lastChar) && isOperator(currentChar)) {
    return false;
  }
  // Prevent starting with 00
  // Prevent operator followed by 00
  if ((input.length === 2 || isOperator(secondLastChar)) && lastChar === '0' && currentChar === '0') {
    return false;
  }
  // Prevent double operators
  if ((isOperator(currentChar) || lastChar === '=') && isOperator(lastChar)) {
    return false;
  }
  return true;
};
