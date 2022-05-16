// import { ComponentName } from '../components/types';
// import { Path, Param, Params, ComponentParams, RouteAction } from '../routes';

// export type WeakSession = WeakObj & {
//   prevPath?: string;
//   requests?: {
//     [k: string]: string;
//   };
//   abort?: WeakSession['requests'];
// };
export type WeakObj = Record<string, unknown>;

// export type Location<P extends ComponentName = ComponentName> = {
//   path: Path;
//   param?: Param;
//   to: (path: Path, o?: Params) => void;
//   update: (o: (state: ComponentParams[P]) => ComponentParams[P] & { action?: RouteAction }) => void;
// };

// TODO: Delete by the end of march 2022
// Delete once the above update is proven working
// update: React.Dispatch<React.SetStateAction<ComponentParams[P]>>;
// update: (o: ComponentParams[P] | ((o: ComponentParams[P]) => ComponentParams[P])) => ComponentParams[P];

// Get nested generic
// https://stackoverflow.com/questions/63631364/infer-nested-generic-types-in-typescript
// type Nested<T> = T extends RouteResult<infer A> ? A : never;

// Typescript union type to single mapped type
// https://stackoverflow.com/questions/56981452/typescript-union-type-to-single-mapped-type

/**
 * Merge two objects
 * https://stackoverflow.com/questions/60795256/typescript-type-merging
 * https://www.typescriptlang.org/play?ssl=4&ssc=1&pln=76&pc=1#code/PTAEAUEMGdoSwHYHNQBcCeAHAptNALAJwHsBXJfUAUQA9NIEATAHgBUA+UAW0gGtdQrAMqhsdBowLYuoRNFTZIk4gDNQAG0gAvOOvQBYAFAhRAN0jrSkVIhSp82NFmwA6Qfjh4L0YqHwwpUAAjbARsFThUAmtZBAVCaGwAYxtiBC9CRy5sQiRsRiMTVF9ofGIAd1AAtMdiIIArZNQXIwwcCEI4Lki4U0cAXlB5TuRQAB9QBFIuEMJx4OJidUUEeaC4JEQoieh0GaX5qfV1edImcMR8gG5W52pxJjZOQdZRGgUmPHBO7ps+0AA-IJQAAuUAAb1AAG0ANKxUD8dCqQQAXTBrFhKNAAF8boZbu0APKYVIICww7DoaBPUCDcFGUCM6FwxAIynI1gogC0APRbw+jDwACVksRCCwYQAaQSYzhAsJ9OZgmF47FQxEclF4gmOEUAR1IcEyjApVJpdIZTNh8I1ak5PL5YgFwtF4uYUplMJRctAcLBCpyqvV7LtWIAZJbGbbBNrDG1ddgDUb8gBZHJ5U3U1jSgCqz1A+sNxszNLDBcTRfyJbzsfjoGJpIsady2BL2dAedpkfmDbgaXJlKz7G7E17-fU1eHhiZ81oSUsjGwzELyZNg6e0pXxfXeanM4mc4XS63VZ37E3FdXbfY7Frd2beQAcmkcwg+whCQ0mlnc-naPRHm7elpxnK0WVWE9GAfVt13bPM0XuACWGgthMVzWVb27bFQDLYDQLA+ExzJdRoLbX8UV5X1+VCQU2SRO1u3wxkgThJ0aLwaMc0YpiZyBf8JGYFDuJ4-DD1IRdUK9aUzkXCIwkYc9hJEmcxIknM0NAGSLnkvdlNAm8lJ49FMUMpllWoz46ORLiQOUoF1K9UzGX9bBFTxGdsSMTD8Tje902wZ8EFfd8AEFCEISAzVeNjLMyJQ0j0KoEHQKEUVzCzaLixgEvQJKUu9WlQDCiL0GYfjHhQjEphmHI0o7KFqtmb0DJ8utoOKyKswyvAspyvLUvSmLMsUbKEEShh8vzKFOW66EA0IFFu3s2aJqUoFoMC4K0g6qLfyUlzFW7MEoRzLEhrwBrXNqpbgXOvK1tADaXzfbbws6tg9ts0CDpyI7bvedj7q+5a7tWr7eMe-zNpehAdp-DtdPwn7CD++a73aaDP0aFJ4c7QZprOgHLMuxVFuBjsVuSh6nqCmGse-D6Ef2yYrpRr7jtO2aSeu8noqJ2iwZ49aoee996Zxxm82Z+a-r550gYhnNKYMcGmWFltobFr8JbgxHvpZw72YNwMjB1SGW0l54R3uVAIpSNh5hzaVvi6Ho+j1iZ2res1aFtyB7fbXqxtyibUvPG27dQZgndAIPxuSsOPfNvJxdQalVKXdsXd+XpHAmOOQ4T71pQz6PnZ+N289jka+tD5r0ccKBYEKgByehYBbvE61YXAo91wqCa506bpOwn5YJh6m+gZnIX91ArHUdErjeHAUnyMElc8o3Z5SBel5Xpp14p3FTcMFQzhSd8nBwELYByPvZqn9gAAoAEoIS3nVb8SQg+975dLzbjNPNcOICX6vy7s4b+982D-0giWcE2JQGsxvG-SBN876-1gfIABSYgHUlnmCAAjMvIIxDTjnDkvkHE4cW6QBbvMFuQQW6oIgafeM0CsE9xwURAcwCUHSjAWgr+mC-48JJO+PhBCkGCJQeA9B2BOFiKjrwic65Z6URIcEchMjQB0JYfI9hUDRHYJURI8cpF1zzWlIg5BipWEKKUaY5gqjLH8MVDYqoOjaH0IcSIn+yiXHmOIm46k1iIRVE0TQ6U+i-G+QwQE5xrj-IIOxDY3RQi2HxMUSY7hZjGwkRSeorxoAiE4k8WQ0AAAmaJej6GMOYXEjhuT-7JJbKkzxkAom6NiYY1qxjEl5NwZWKCRT3E5FkfYyZOQmkDJgUMyCoTmDhNsdMwgsyEnzLgYA1MYywms06d4tZGycmDO2Xg3Z7TimQDBAABnKREm5pTam9OEf0zZXD-6Y21mnZZBzjbrOOX05pZycHfOxr8lZujbHArmZ8sF-lU77I8Y8o5jzulxP8VshFFtwkgKBW8kF2Ko4oXCcMWw4dyXIBOU4oZKEqVIEEdMWYlLba2EOMymZsKPmBNJf81ZH8aUtJxXkP5KLCHPOhZE7x3LTnEsEv5ZgEqylpIBeHDRMrCVwt5Yqhl8xlUPIlTU3ReqJgGomMaoViTux0sVQa1VRqcT6u0ZK9VJSykWqdWa6VpTSEYq8m8rF8KSV2tADQf0nLCCpUNVKmglFGo5GjUg2VtKvmhvDZMSNSbPEZoTVGrEsaI01XzTQlNwqQ0W0hLmrNBac1ggZUmt1Gbn55vmAy1+ja+lBp1ZWsNx0iHSiqbWiJGaoQAGYC1NrBM-D11T5hjo7ZOstoKK2iqrf2wdw712ZuLY2utO7ZidsDdk1NIqlzbu3XqtUW6+0f1SoWkdlEr1Htft25xKFt0FxHfWtloxr2GtvYg+9U7H0-pGCgf9ya35vttb2jNX7L2-og9m791d4rBzvSiB9Van1IZxC+oxPL33prA7YaNEw80oe3ZRyd+6aPzGfqag9ORF2lq1UR2Da7AOgHQDo8jQwkNUdvfRh9z9IToG6Ry4trGJiMbwxRyNrGoNZLNiFQqeEmRPIZe5JklS806cZEkMEQRFjLAYAZ0AjAwQafwpAKppHkAWZnEEezzHCAWZPl9bA8bI0WZUE+vYJn1AWaQD54tFn8AOaQKqBuoAABC6nuxaaQxZypJmlgrAs1ZiESk7NRac0yJIrn0tmYQB5vzAX9jBe7EgItswItRYobJS4jAYuEccCFBLgwUIhWlHF28QA
 */
// type Primitive = string | number | boolean | bigint | symbol | null | undefined;
// type Expand<T> = T extends Primitive ? T : { [K in keyof T]: T[K] };

// type OptionalKeys<T> = {
//   [K in keyof T]-?: T extends Record<K, T[K]> ? never : K;
// }[keyof T];

// type RequiredKeys<T> = {
//   [K in keyof T]-?: T extends Record<K, T[K]> ? K : never;
// }[keyof T] &
//   keyof T;

// type RequiredMergeKeys<T, U> = RequiredKeys<T> & RequiredKeys<U>;

// type OptionalMergeKeys<T, U> =
//   | OptionalKeys<T>
//   | OptionalKeys<U>
//   | Exclude<RequiredKeys<T>, RequiredKeys<U>>
//   | Exclude<RequiredKeys<U>, RequiredKeys<T>>;

// type MergeNonUnionObjects<T, U> = Expand<
//   {
//     [K in RequiredMergeKeys<T, U>]: Expand<Merge<T[K], U[K]>>;
//   } & {
//     [K in OptionalMergeKeys<T, U>]?: K extends keyof T
//       ? K extends keyof U
//         ? Expand<Merge<Exclude<T[K], undefined>, Exclude<U[K], undefined>>>
//         : T[K]
//       : K extends keyof U
//       ? U[K]
//       : never;
//   }
// >;

// type MergeNonUnionArrays<T extends readonly unknown[], U extends readonly unknown[]> = Array<
//   Expand<Merge<T[number], U[number]>>
// >;

// type MergeArrays<T extends readonly unknown[], U extends readonly unknown[]> = [T] extends [never]
//   ? U extends unknown
//     ? MergeNonUnionArrays<T, U>
//     : never
//   : [U] extends [never]
//   ? T extends unknown
//     ? MergeNonUnionArrays<T, U>
//     : never
//   : T extends unknown
//   ? U extends unknown
//     ? MergeNonUnionArrays<T, U>
//     : never
//   : never;

// type MergeObjects<T, U> = [T] extends [never]
//   ? U extends unknown
//     ? MergeNonUnionObjects<T, U>
//     : never
//   : [U] extends [never]
//   ? T extends unknown
//     ? MergeNonUnionObjects<T, U>
//     : never
//   : T extends unknown
//   ? U extends unknown
//     ? MergeNonUnionObjects<T, U>
//     : never
//   : never;

// export type Merge<T, U> =
//   | Extract<T | U, Primitive>
//   | MergeArrays<Extract<T, readonly unknown[]>, Extract<U, readonly unknown[]>>
//   | MergeObjects<Exclude<T, Primitive | readonly unknown[]>, Exclude<U, Primitive | readonly unknown[]>>;

import * as components from '../components';
import routes from '../routes/third';
export type ComponentName = keyof typeof components;
export type Path = keyof typeof routes;

/// TODO: fix component props
// export type ComponentProps = Parameters<typeof components[ComponentName]>[number];
export type ComponentProps = Record<string, any>;
export type ComponentData = {
  id: string;
  component: ComponentName;
  props: Omit<ComponentProps, 'id' | 'location'>;
  action?: RouteAction;
};

export type RouteSection = ComponentData[];

export type RouteAction = WeakObj;

export type RouteLocation = {
  path: Path;
  to: (path: Path, data?: RouteAction) => void;
  update: (data: RouteAction) => void;
};

/// TODO: figure out recursive type
export type RouteResult = {
  state: RouteState | null;
  components: (ComponentData | RouteSection)[] | null;
};
export type RouteState<Path extends keyof typeof routes = keyof typeof routes> = typeof routes[Path]['state'];

export type Requests = Record<string, AbortController | null>;

export type Route<State> = {
  state: State;
  render: (state: State) => RouteResult['components'];
  update: (state: State, data: RouteAction) => State;
  /// TODO: get type working to only accept state & reducer or machine
  // machine?: any;
  effects?: (state: State, data: RouteAction, requests: Requests) => void;
  onLeave?: (state: State) => Partial<State> | void;
};
