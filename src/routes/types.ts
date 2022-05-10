import type { RoutesType } from './index';
import type { ComponentData, ComponentName, ComponentNames } from '../components/types';
import type { WeakObj, WeakSession } from '../utils/types';

export type Route<T extends WeakObj, C = ComponentName, S = WeakObj, A extends RouteAction = ''> = (
  state: T,
  session: S,
  action: A
) => RouteResult<T, C, S>;

export type RouteResult<State = WeakObj, C = ComponentName, Session = WeakSession> = {
  state?: State;
  session?: Session;
  onLeave?: {
    state?: Partial<State>;
    session?: Partial<Session>;
  };
  components: Array<ComponentData<C> | ComponentData<C>[]>;
};

export type Path = keyof RoutesType;
type Nested<T> = T extends RouteResult<infer A> ? A : never;

////////////////////////////////////////////////
//// Get component parameters
////////////////////////////////////////////////
type NestedSecondArg<T> = T extends RouteResult<WeakObj, infer R> ? R : never;
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
  [k in keyof A]: k extends A[k][P] ? GetRouteState<P> : never;
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

type GetRouteState<P> = P extends Path ? Parameters<RoutesType[P]>[0] : never;
export type RouteState = GetRouteState<keyof RoutesType>;
type GetRouteSession<P> = P extends Path ? Parameters<RoutesType[P]>[1] : never;
export type RouteSession = GetRouteSession<keyof RoutesType>;
export type RouteAction = Parameters<RoutesType[keyof RoutesType]>[2];

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type SingleObjectType<U> = UnionToIntersection<U> extends infer O ? { [K in keyof O]: O[K] } : never;
export type Params = SingleObjectType<RouteState>;
export type Param = keyof Params;

export type Routes = {
  [k in keyof RoutesType]: (o: Parameters<RoutesType[k]>[number]) => RouteResult<RouteStatesObj[k]>;
};
