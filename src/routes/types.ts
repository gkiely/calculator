import type { RoutesType } from './index';
import type { ComponentData, ComponentName, ComponentNames } from '../components/types';
import type { WeakObj } from '../utils/types';

export type Route<S extends WeakObj = WeakObj, C extends ComponentName = ComponentName> = {
  state?: S;
  components: Array<ComponentData<C> | ComponentData<C>[]>;
};

export type Path = keyof RoutesType;
type Nested<T> = T extends Route<infer A> ? A : never;

////////////////////////////////////////////////
//// Get component parameters
////////////////////////////////////////////////
type NestedSecondArg<T> = T extends Route<WeakObj, infer R> ? R : never;
type ComponentsInRoute = {
  [k in keyof RoutesType]: NestedSecondArg<ReturnType<RoutesType[k]>>;
};
type GetParams<P> = P extends Path
  ? {
      [k in keyof ComponentNames]: {
        [p in P]: ComponentsInRoute[P];
      };
    }
  : never;

type A = {
  [k in keyof GetParams<Path>]: SingleObjectType<GetParams<Path>[k]>;
};
type B<P extends Path> = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [k in keyof A]: k extends A[k][P] ? GetRouteParams<P> : never;
};
type C = {
  [k in keyof RoutesType]: B<k>;
}[Path];

export type ComponentParams = {
  [k in keyof C]: UnionToIntersection<C[k] extends never ? never : C[k]>;
};
//// End of getting component parameters /////

export type RouteStatesObj = {
  [k in keyof RoutesType]: Nested<ReturnType<RoutesType[k]>>;
};
type GetRouteStates<P> = P extends Path ? Nested<ReturnType<RoutesType[P]>> : never;
export type RouteStates = GetRouteStates<keyof RoutesType>;

type GetRouteParams<P> = P extends Path ? Parameters<RoutesType[P]>[number] : never;
export type RouteParams = GetRouteParams<keyof RoutesType>;

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type SingleObjectType<U> = UnionToIntersection<U> extends infer O ? { [K in keyof O]: O[K] } : never;
export type Params = SingleObjectType<RouteParams>;
export type Param = keyof Params;

export type Routes = {
  [k in keyof RoutesType]: (o: Parameters<RoutesType[k]>[number]) => Route<RouteStatesObj[k]>;
};
